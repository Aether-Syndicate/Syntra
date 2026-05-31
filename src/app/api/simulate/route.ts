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

    // Fetch context for baseline calculation
    const recentLogs = await Log.find({
      userId: new mongoose.Types.ObjectId(session.user.id),
    }).sort({ date: -1 }).limit(21).lean();

    const twinContext = buildTwinContext(recentLogs, {
      monthlyIncome: user.profile?.monthlyIncome,
      monthlyBudget: user.profile?.monthlyBudget,
    });

    // Extract average focus rating (productivity)
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
      }
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

    // Support both percentageChange (legacy) and dynamic metric sliders (currentValue/simulatedValue)
    let percentageChange = 0;
    let variable = "";
    let currentValue = 0;
    let simulatedValue = 0;

    if (typeof scenario.percentageChange !== "undefined") {
      // Legacy percentage change payload
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
      // Modern absolute value payload
      variable = scenario.variable;
      currentValue = Number(scenario.currentValue);
      simulatedValue = Number(scenario.simulatedValue);

      if (typeof variable === "undefined" || isNaN(currentValue) || isNaN(simulatedValue)) {
        return NextResponse.json({ error: "Invalid scenario payload: variable, currentValue, or simulatedValue is invalid." }, { status: 400 });
      }

      percentageChange = currentValue !== 0 ? (simulatedValue - currentValue) / currentValue : 0;
    }

    // Run deterministic math first
    const simulationResult = runSimulation(
      user.scores.health,
      user.scores.finance,
      user.scores.career,
      { domain: scenario.domain as any, percentageChange }
    );

    // Fetch context for AI narrative layer
    const recentLogs = await Log.find({
      userId: new mongoose.Types.ObjectId(session.user.id),
    }).sort({ date: -1 }).limit(21).lean();

    const twinContext = buildTwinContext(recentLogs, {
      monthlyIncome: user.profile?.monthlyIncome,
      monthlyBudget: user.profile?.monthlyBudget,
    });

    // Parse user's long-term financial targets into strongly-typed wealthGoals for the Simulator Prompt using the pre-computation helper
    const wealthGoals = preComputeWealthGoals(
      user.goals,
      user.profile?.monthlyIncome || 50000,
      user.profile?.monthlyBudget || 0,
      twinContext.weeklyAverages.savingsRate
    );

    // Determine health nutrient and habit gaps based on average sleep or calorie metrics
    const historicalNutrientGaps = ["Vitamin A deficit", "Low protein"];
    if (twinContext.weeklyAverages.sleep < 6.5) {
      historicalNutrientGaps.push("Severe sleep debt (under 6.5h average)");
    }
    if (twinContext.weeklyAverages.calorieAdherence < 45) {
      historicalNutrientGaps.push("Calorie target misalignment");
    }

    // Inject calculations into twinContext weeklyAverages and finance payload
    if (wealthGoals.length > 0) {
      const primaryGoal = wealthGoals[0];
      (twinContext.weeklyAverages as any).requiredMonthlySavings = primaryGoal.requiredMonthlySavings;
      (twinContext.weeklyAverages as any).savingsDeficit = primaryGoal.deficit;
      (twinContext.weeklyAverages as any).savingsDeficitText = primaryGoal.deficitText;
    }
    (twinContext as any).finance = {
      wealthGoals,
      requiredMonthlySavings: wealthGoals[0]?.requiredMonthlySavings || 0,
      savingsDeficit: wealthGoals[0]?.deficit || 0,
      savingsDeficitText: wealthGoals[0]?.deficitText || "User is on track",
    };
    (twinContext as any).health = { historicalNutrientGaps };

    const confidence = calculateConfidence(twinContext.logCount);

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
      console.error("Simulator AI layer failed, using math fallback:", e);
      aiAnalysis = {
        scenarioTitle: `${scenario.domain} shift projection`,
        primaryOutcome: `Projecting a ${Math.round(percentageChange * 100)}% shift in ${scenario.domain}.`,
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
    console.error("SIMULATION POST ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}