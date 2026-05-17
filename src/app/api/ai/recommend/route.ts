import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { GoogleGenerativeAI } from "@google/generative-ai"; 

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

    // FIXED: Upgraded to use your new nested MongoDB schema paths
    const twinContext = {
      healthScore: user.scores.health,
      financeScore: user.scores.finance,
      careerScore: user.scores.career,
      currentStreak: user.gamification.currentStreak,
    };

    // 3. The Prompt Engineer
    const prompt = `
      You are the Syntra Digital Twin AI. You analyze a user's life metrics and provide highly actionable, cross-domain insights.
      
      USER CONTEXT:
      Health Score: ${twinContext.healthScore}/100
      Finance Score: ${twinContext.financeScore}/100
      Career Score: ${twinContext.careerScore}/100
      Current Activity Streak: ${twinContext.currentStreak} days

      YOUR DIRECTIVES:
      1. Analyze the cross-domain impacts (e.g., how their health score might be dragging down their career score).
      2. Provide actionable recommendations.
      3. Project their future state.
      4. Suggest SMART goals.
      
      CRITICAL: You MUST respond in pure, valid JSON matching the exact schema below. Do not include markdown formatting like \`\`\`json. 
      
      SCHEMA:
      {
        "insights": ["string"],
        "recommendations": ["string"],
        "futureProjection": { "health": "string", "finance": "string", "career": "string" },
        "smartGoals": ["string"],
        "confidence": number
      }
    `;

    // 4. Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 5. Clean and Parse the JSON 
    const cleanedText = responseText.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();
    const parsedData = JSON.parse(cleanedText);

    // 6. Return the Strict Contract to the Frontend
    return NextResponse.json({ 
      success: true, 
      ai: parsedData 
    }, { status: 200 });

  } catch (error: any) {
    console.error("GEMINI INTEGRATION ERROR:", error);
    // Fallback so frontend UI doesn't crash if Gemini rate-limits
    return NextResponse.json({ 
      success: false,
      ai: {
        insights: ["Our AI is currently analyzing your deep metrics. Please check back later."],
        recommendations: ["Maintain your current streak across all domains."],
        futureProjection: { health: "Stable", finance: "Stable", career: "Stable" },
        smartGoals: ["Log your data for 3 consecutive days."],
        confidence: 0
      }
    }, { status: 200 }); 
  }
}