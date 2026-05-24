// src/app/api/ai/recommend/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Log from "@/models/Log";
import { buildTwinContext } from "@/lib/aiContextBuilder";
import { calculateConfidence } from "@/lib/confidenceScore";
import { generateaitwinReflection } from "@/lib/prompts/aitwinReflection";
import { parseGemini } from "@/lib/parseGemini"; 

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized neural link." }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "Twin architecture not found." }, { status: 404 });
    }

    const recentLogs = await Log.find({ userId: user._id })
      .sort({ date: -1 })
      .limit(42)
      .lean();

    const twinContext = buildTwinContext(recentLogs, {
      monthlyIncome: user.profile?.monthlyIncome,
      monthlyBudget: user.profile?.monthlyBudget,
    });

    const confidence = calculateConfidence(twinContext.logCount);

    const aiResponse = await generateaitwinReflection(
      twinContext,
      {
        health: user.scores.health,
        finance: user.scores.finance,
        career: user.scores.career,
      },
      user.gamification.currentStreak,
      confidence
    );

    if (!aiResponse || !aiResponse.twinPrediction) {
      throw new Error("Gemini returned invalid structure.");
    }

    return NextResponse.json({ success: true, ai: aiResponse }, { status: 200 });

  } catch (error: any) {
    console.error("GEMINI INTEGRATION ERROR:", error);
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
          career: ["Complete one focused work session."],
        },
        riskAlerts: [],
        confidence: 0,
      },
    }, { status: 200 });
  }
}