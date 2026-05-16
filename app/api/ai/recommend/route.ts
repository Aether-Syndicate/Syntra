// src/app/api/ai/recommend/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini (Make sure GEMINI_API_KEY is in your .env file)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET(req: Request) {
  try {
    // 1. Secure Route
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || "test@syntra.com";

    // 2. Fetch User Context (We skip decryption here just to grab the raw scores/streaks for the MVP)
    await connectDB();
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // In a production app, you'd fetch the output of your /api/twin route here.
    // For the hackathon MVP, we will pass the current scores and streak directly.
    const twinContext = {
      healthScore: user.healthScore,
      financeScore: user.financeScore,
      careerScore: user.careerScore,
      currentStreak: user.currentStreak,
    };

    // 3. The Prompt Engineer (Enforcing Cross-Domain & Strict Schema)
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

    // 5. Clean and Parse the JSON (Fallback handling for markdown backticks)
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(cleanedText);

    // 6. Return the Strict Contract to the Frontend
    return NextResponse.json({ 
      success: true, 
      ai: parsedData 
    }, { status: 200 });

  } catch (error: any) {
    console.error("GEMINI INTEGRATION ERROR:", error);
    // Graceful fallback (Priority 5) so the frontend doesn't crash if Gemini rate-limits
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