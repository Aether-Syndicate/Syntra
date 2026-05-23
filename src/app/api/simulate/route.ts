//src/app/api/simulate/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Log from "@/models/Log";
import { runSimulation } from "@/lib/simulator";
import { buildTwinContext } from "@/lib/aiContextBuilder";
import { calculateConfidence } from "@/lib/confidenceScore";
import { generateSimulatorInsight } from "@/lib/prompts/aisimulatorPrompt";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized neural link." }, { status: 401 });
    }

    const body = await req.json();
    const { scenario } = body;

    if (!scenario || !scenario.domain ||
        typeof scenario.percentageChange === "undefined") {
      return NextResponse.json({ error: "Invalid scenario payload." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "Twin architecture not found." }, { status: 404 });
    }

    // Run deterministic math first
    const simulationResult = runSimulation(
      user.scores.health,
      user.scores.finance,
      user.scores.career,
      scenario
    );

    // Fetch context for AI narrative layer
    const recentLogs = await Log.find({
      userId: new mongoose.Types.ObjectId(session.user.id),
    }).sort({ date: -1 }).limit(21).lean();

    const twinContext = buildTwinContext(recentLogs, {
      monthlyIncome: user.profile?.monthlyIncome,
      monthlyBudget: user.profile?.monthlyBudget,
    });

    const confidence = calculateConfidence(twinContext.logCount);

    // Variable label mapping
    const variableMap: Record<string, string> = {
      health: "workout_frequency",
      finance: "savings_rate",
      career: "study_hours",
    };

    let aiAnalysis;
    try {
      aiAnalysis = await generateSimulatorInsight(
        {
          domain: scenario.domain,
          variable: variableMap[scenario.domain],
          currentValue: user.scores[scenario.domain as keyof typeof user.scores],
          simulatedValue: Math.min(100, Math.round(
            user.scores[scenario.domain as keyof typeof user.scores]
            * (1 + scenario.percentageChange)
          )),
          percentChange: Math.round(scenario.percentageChange * 100),
        },
        twinContext,
        {
          health: user.scores.health,
          finance: user.scores.finance,
          career: user.scores.career,
        },
        confidence
      );
    } catch (e) {
      console.error("Simulator AI layer failed, using math fallback:", e);
      aiAnalysis = {
        scenarioTitle: `${scenario.domain} shift projection`,
        primaryOutcome: `Projecting a ${Math.round(scenario.percentageChange * 100)}% shift in ${scenario.domain}.`,
        tradeOffs: [],
        timelineProjection: [],
        riskLevel: simulationResult.riskAssessment.includes("High") ? "high" : "medium",
        recommendedPath: "Monitor all domains as changes take effect.",
        confidence: 0,
      };
    }

    return NextResponse.json({
      success: true,
      simulation: simulationResult,
      aiAnalysis,
    }, { status: 200 });

  } catch (error: any) {
    console.error("SIMULATION ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}