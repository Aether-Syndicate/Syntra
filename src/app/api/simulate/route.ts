// src/app/api/simulate/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Log from "@/models/Log";
import { runSimulation } from "@/lib/simulator";
import { buildTwinContext } from "@/lib/aiContextBuilder";
import { calculateConfidence } from "@/lib/confidenceScore";
import { generateSimulatorInsight } from "@/lib/prompts/aisimulatorPrompt";
import { preComputeWealthGoals } from "@/lib/financeMath";
import mongoose from "mongoose";

// GET handler to fetch and compute baseline values for the simulator UI
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

    const recentLogs = await Log.find({
      userId: new mongoose.Types.ObjectId(session.user.id),
    }).sort({ date: -1 }).limit(21).lean();

    const twinContext = buildTwinContext(recentLogs, {
      monthlyIncome: user.profile?.monthlyIncome,
      monthlyBudget: user.profile?.monthlyBudget,
    });

    const careerLogs = recentLogs.filter(l => l.domain === "career");
    const productivityValues = careerLogs
      .map(l => l.domainData?.productivityRating)
      .filter((v): v is number => typeof v === "number");
    const avgProductivity = productivityValues.length
      ? Math.round((productivityValues.reduce((a, b) => a + b, 0) / productivityValues.length) * 10) / 10
      : 7;

    return NextResponse.json({
      success: true,
      scores: {
        health: user.scores.health,
        finance: user.scores.finance,
        career: user.scores.career,
      },
      baselines: {
        sleep_hours: twinContext.weeklyAverages.sleep || 7.5,
        workout_frequency: twinContext.weeklyAverages.workout || 3,
        study_hours: parseFloat((twinContext.weeklyAverages.studyHours / 7).toFixed(1)) || 4,
        focus_rating: avgProductivity,
        savings_rate: twinContext.weeklyAverages.savingsRate || 20,
        monthly_income: user.profile?.monthlyIncome || 50000,
        monthly_budget: user.profile?.monthlyBudget || 40000,
      },
      goals: user.goals || [],
    }, { status: 200 });

  } catch (error: any) {
    console.error("SIMULATOR BASELINES GET ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST handler to execute scenario simulation
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized neural link." }, { status: 401 });
    }

    const body = await req.json();
    const { scenario } = body;

    if (!scenario || !scenario.domain) {
      return NextResponse.json({ error: "Invalid scenario payload. Domain is missing." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "Twin architecture not found." }, { status: 404 });
    }

    let percentageChange = 0;
    let variable = "";
    let currentValue = 0;
    let simulatedValue = 0;

    if (typeof scenario.percentageChange !== "undefined") {
      percentageChange = scenario.percentageChange;
      const variableMap: Record<string, string> = {
        health: "workout_frequency",
        finance: "savings_rate",
        career: "study_hours",
      };
      variable = variableMap[scenario.domain] || "variable";
      currentValue = user.scores[scenario.domain as keyof typeof user.scores] || 50;
      simulatedValue = Math.min(100, Math.round(currentValue * (1 + percentageChange)));
    } else {
      variable = scenario.variable;
      currentValue = Number(scenario.currentValue);
      simulatedValue = Number(scenario.simulatedValue);

      if (typeof variable === "undefined" || isNaN(currentValue) || isNaN(simulatedValue)) {
        return NextResponse.json({ error: "Invalid scenario payload." }, { status: 400 });
      }
      percentageChange = currentValue !== 0 ? (simulatedValue - currentValue) / currentValue : 0;
    }

    const simulationResult = runSimulation(
      user.scores.health,
      user.scores.finance,
      user.scores.career,
      { domain: scenario.domain as any, percentageChange }
    );

    const recentLogs = await Log.find({
      userId: new mongoose.Types.ObjectId(session.user.id),
    }).sort({ date: -1 }).limit(21).lean();

    const twinContext = buildTwinContext(recentLogs, {
      monthlyIncome: user.profile?.monthlyIncome,
      monthlyBudget: user.profile?.monthlyBudget,
    });

    const wealthGoals = preComputeWealthGoals(
      user.goals,
      user.profile?.monthlyIncome || 50000,
      user.profile?.monthlyBudget || 0,
      twinContext.weeklyAverages.savingsRate
    );

    (twinContext as any).finance = {
      wealthGoals,
      requiredMonthlySavings: wealthGoals[0]?.requiredMonthlySavings || 0,
      savingsDeficit: wealthGoals[0]?.deficit || 0,
      savingsDeficitText: wealthGoals[0]?.deficitText || "User is on track",
    };

    const confidence = calculateConfidence(twinContext.logCount);
    
    // Find the specific goal for the current domain to return in the POST response
    const domainGoal = user.goals?.find(
      (g: any) => g.domain?.toLowerCase() === scenario.domain?.toLowerCase()
    );

    let aiAnalysis;
    try {
      aiAnalysis = await generateSimulatorInsight(
        {
          domain: scenario.domain as any,
          variable: variable,
          currentValue: currentValue,
          simulatedValue: simulatedValue,
          percentChange: Math.round(percentageChange * 100),
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
      aiAnalysis = { scenarioTitle: `${scenario.domain} projection`, primaryOutcome: "Projection calculated.", tradeOffs: [], timelineProjection: [], riskLevel: "medium", recommendedPath: "Continue monitoring.", confidence: 0 };
    }

    return NextResponse.json({
      success: true,
      simulation: simulationResult,
      aiAnalysis,
      goal: domainGoal || null,
    }, { status: 200 });

  } catch (error: any) {
    console.error("SIMULATION POST ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}