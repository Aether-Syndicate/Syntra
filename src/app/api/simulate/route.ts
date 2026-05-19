//src/app/api/simulate/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; 
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { runSimulation } from "@/lib/simulator"; 
import { GoogleGenerativeAI } from "@google/generative-ai"; // The Brain
import { buildSimulatorPrompt } from "@/lib/prompts/simulatorPrompt";

// Initialize the AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request using our custom typed helper
    const session = await getSession();
    if (!session || !session.user?.email || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized neural link." }, { status: 401 });
    }

    // 2. Parse the Scenario Request from UI Sliders
    const body = await req.json();
    const { scenario } = body;

    if (!scenario || !scenario.domain || typeof scenario.percentageChange === "undefined") {
        return NextResponse.json({ error: "Invalid scenario payload" }, { status: 400 });
    }

    // 3. Fetch User's Current State
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ error: "Twin architecture not found" }, { status: 404 });
    }

    // 4. Run the Deterministic Math Engine (Fixed nested schema paths!)
    const simulationResult = runSimulation(
        user.scores.health,
        user.scores.finance,
        user.scores.career,
        scenario
    );

    // 5. THE AI LAYER: Translate the math into an emotional projection
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    
    const prompt = buildSimulatorPrompt({
      currentScores: {
        health: user.scores.health,
        finance: user.scores.finance,
        career: user.scores.career
      },
      projectedScores: {
        health: simulationResult.timeline[1].health,
        finance: simulationResult.timeline[1].finance,
        career: simulationResult.timeline[1].career
      },
      scenario
    });

    const result = await model.generateContent(prompt);
    let aiText = result.response.text();
    
    // 6. THE REGEX FAILSAFE
    aiText = aiText.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
    
    let aiAnalysis;
    try {
      aiAnalysis = JSON.parse(aiText);
    } catch (e) {
      console.error("Gemini JSON mapping failed. Triggering UI failsafe:", aiText);
      // Hardcoded fallback so the frontend UI NEVER crashes during a live demo
      aiAnalysis = {
        insight: `Projecting a shift in ${scenario.domain}. The twin architecture predicts cascading impacts across other domains.`,
        warning: null
      };
    }

    // 7. The Final Payload Handshake
    return NextResponse.json({
        success: true,
        simulation: simulationResult, // The Math (for Recharts graphs)
        aiAnalysis: aiAnalysis          // The Story (for the UI text cards)
    }, { status: 200 });

  } catch (error: any) {
    console.error("SIMULATION ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}