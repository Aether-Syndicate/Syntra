// src/app/api/ai/recommend/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Log from "@/models/Log";
import { buildTwinContext } from "@/lib/aiContextBuilder";
import { GoogleGenerativeAI } from "@google/generative-ai"; 

// Decoupled AI Logic & Safe Parsing utilities
import { buildTwinReflectionPrompt } from "@/lib/prompts/twinReflection";
import { calculateConfidence } from "@/lib/confidenceScore";
import { parseGemini } from "@/lib/parseGemini";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET(req: Request) {
  try {
    // 1. Strict Security Check
    const session = await getSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized neural link." }, { status: 401 });
    }

    // 2. Fetch User Context
    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "Twin architecture not found" }, { status: 404 });
    }

    const recentLogs = await Log.find({ userId: user._id })
      .sort({ date: -1 })
      .limit(21) // Last 7 days × 3 domains
      .lean();

    const twinContext = buildTwinContext(recentLogs);
    const confidence = calculateConfidence(twinContext.logCount);

    // 3. The Prompt Engineer (Delegated to lib/prompts)
    const prompt = buildTwinReflectionPrompt(
      twinContext,
      { health: user.scores.health, finance: user.scores.finance, career: user.scores.career },
      user.gamification.currentStreak,
      confidence
    );

    // 4. Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 5. Clean, Parse, and Validate using the new schema
    const parsedData = parseGemini(responseText);
    
    // Failsafe: Ensure Gemini didn't hallucinate a weird structure
    if (!parsedData || !parsedData.twinPrediction) {
      throw new Error("Gemini returned an invalid or malformed structure.");
    }

    // 6. Return the Strict Contract to the Frontend
    return NextResponse.json({ 
      success: true, 
      ai: parsedData 
    }, { status: 200 });

  } catch (error: any) {
    console.error("GEMINI INTEGRATION ERROR:", error);
    
    // 7. Fallback updated strictly to the new Phase 5 JSON Contract
    return NextResponse.json({ 
      success: false,
      ai: {
        twinPrediction: "Your Twin is analyzing your behavioral patterns. Check back shortly.",
        dailyReflection: "Keep your streak going — consistency is your strongest asset right now.",
        explainability: ["Insufficient data points for full analysis."],
        dailyChallenge: "Log all three domains today to unlock your full Twin Reflection.",
        recommendations: {
          health: ["Maintain your current sleep schedule."],
          finance: ["Avoid discretionary spending today."],
          career: ["Complete one focused work session."]
        },
        riskAlerts: [],
        confidence: 0
      }
    }, { status: 200 }); 
  }
}