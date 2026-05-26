// src/lib/snapshotService.ts
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Log from "@/models/Log";
import { buildTwinContext } from "@/lib/aiContextBuilder";
import { calculateConfidence } from "@/lib/confidenceScore";
import { analyzeBehavioralDrift } from "@/lib/driftEngine";
import { callGemini } from "@/lib/gemini";
import { Logger } from "@/lib/logger";

/**
 * Asynchronously generates a fresh AI twin reflection and stores it as a cached snapshot.
 * Destined to run as a background promise to ensure standard log/CSV submissions return immediately.
 */
export async function generateAndStoreSnapshot(userId: string | mongoose.Types.ObjectId): Promise<void> {
  const startTime = performance.now(); // ⏱️ Start stopwatch
  try {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`[Snapshot Service] User not found for ID: ${userId}`);
      return;
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

    // Run the deterministic Drift & Divergence Engine
    const driftReport = analyzeBehavioralDrift(recentLogs, user);

    // 1. The Gateway: Only wake up Gemini if the user is actually drifting!
    if (driftReport.globalDriftIndex < 15 && driftReport.recommendations.length === 1) {
      console.log("User is stable. Saving math, skipping AI generation.");
      const stableReflection = {
        twinPrediction: "Your Digital Twin is operating in optimal synchrony across health, finance, and career matrices.",
        dailyReflection: "Your behavioral biometrics are nominal. Excellent job maintaining daily routine consistency.",
        explainability: [
          `Global Drift Index is ${driftReport.globalDriftIndex}/100, indicating optimal lifestyle trajectory alignment.`,
          "All monitored biometric domains are operating within normal parameters with zero adverse flags detected."
        ],
        dailyChallenge: "Maintain your perfect record by logging all three biometric domains again today.",
        recommendations: {
          health: ["Continue maintaining your current sleep and physical training schedule."],
          finance: ["Maintain your nominal spending rate to keep discretionary runway fully optimized."],
          career: ["Complete one focused skill upskilling session today to sustain study momentum."]
        },
        riskAlerts: [],
        confidence: confidence
      };
      
      user.aiSnapshot = {
        dailyReflection: stableReflection,
        lastGeneratedAt: new Date(),
      };
      await user.save();

      const latency = performance.now() - startTime; // ⏱️ Stop stopwatch
      
      Logger.metric("DRIFT_INTERCEPT", "ai_optimization", {
        latencyMs: Number(latency.toFixed(2)),
        driftIndex: driftReport.globalDriftIndex,
        estimatedTokensSaved: 850
      }, user._id.toString());

      console.log(`[Snapshot Service] Pre-generated and cached STABLE math snapshot for user: ${user.email}`);
      return; 
    }

    // 2. The Super-Prompt: Feed this deterministic math straight to the AI
    const aiPrompt = `
Operator is experiencing a Global Drift Index of ${driftReport.globalDriftIndex}/100.
Primary Divergence: ${driftReport.primaryDivergenceCause}

System generated these mandatory recommendations:
${driftReport.recommendations.join("\n")}

Write a 2-sentence cyberpunk OS notification delivering this exact diagnosis to the Operator. 
Do not invent new metrics.
`;

    const aiResponse = await callGemini<string>(aiPrompt, { temperature: 0.5 });

    // 3. Construct a premium structured reflection matching Zod schemas
    const structuredReflection = {
      twinPrediction: `Your Twin forecasts a trajectory divergence risk due to: ${driftReport.primaryDivergenceCause}.`,
      dailyReflection: aiResponse,
      explainability: [
        `Global Drift Index is currently at ${driftReport.globalDriftIndex}/100, signaling trajectory divergence.`,
        `Divergence is primarily triggered by ${driftReport.primaryDivergenceCause}.`
      ],
      dailyChallenge: driftReport.recommendations[0] 
        ? `Execute the priority target today: ${driftReport.recommendations[0]}`
        : "Log all biometric domains today to recalibrate the twin trajectory model.",
      recommendations: {
        health: [
          driftReport.domains.health.sleep.driftPercentage < 0 
            ? `Standardize a screen-free sleep transition routine (Actual Sleep: ${driftReport.domains.health.sleep.actualAverage}h vs ${driftReport.domains.health.sleep.targetValue}h).`
            : "Maintain your nominal sleep schedule and somatic rest window.",
          driftReport.domains.health.workouts.driftPercentage < 0
            ? `Increase weekly activity towards minimum WHO guidelines (Actual Workouts: ${driftReport.domains.health.workouts.actualAverage} min vs ${driftReport.domains.health.workouts.targetValue} min).`
            : "Continue with your active somatic training split."
        ],
        finance: [
          driftReport.domains.finance.spendingVsBudget.driftPercentage < 0
            ? `Cap discretionary spend to daily budget limit of Rs.${driftReport.domains.finance.spendingVsBudget.targetValue} (Actual Spend: Rs.${driftReport.domains.finance.spendingVsBudget.actualAverage}).`
            : "Discretionary spending continues to trace inside the target baseline budget.",
          driftReport.domains.finance.savingsRate.driftPercentage < 0
            ? `Increase SIP allocations to align with target savings rate of ${driftReport.domains.finance.savingsRate.targetValue}% (Actual Rate: ${driftReport.domains.finance.savingsRate.actualAverage}%).`
            : "Savings velocity is in optimal tracking bounds."
        ],
        career: [
          driftReport.domains.career.studyHours.driftPercentage < 0
            ? `Prioritize weekly skill-acquisition sessions to hit upskilling targets of ${driftReport.domains.career.studyHours.targetValue}h/week (Actual: ${driftReport.domains.career.studyHours.actualAverage}h/week).`
            : "Upskilling study patterns are nominal and active.",
          driftReport.domains.career.productivity.driftPercentage < 0
            ? `Optimize productivity rating to hit target index baseline (Actual: ${driftReport.domains.career.productivity.actualAverage}/10 vs ${driftReport.domains.career.productivity.targetValue}/10).`
            : "Daily productivity rating is stable."
        ]
      },
      riskAlerts: driftReport.recommendations.slice(0, 2),
      confidence: confidence
    };

    user.aiSnapshot = {
      dailyReflection: structuredReflection,
      lastGeneratedAt: new Date(),
    };
    await user.save();

    const latency = performance.now() - startTime; // ⏱️ Stop stopwatch

    Logger.metric("AI_GENERATION", "ai_core", {
      latencyMs: Number(latency.toFixed(2)),
      driftIndex: driftReport.globalDriftIndex,
      divergenceCause: driftReport.primaryDivergenceCause
    }, user._id.toString());

    console.log(`[Snapshot Service] Pre-generated and cached DRIFTING AI snapshot for user: ${user.email}`);

  } catch (error: any) {
    console.error(`[Snapshot Service ERROR] Pre-generating AI reflection failed for user ${userId}:`, error);
  }
}
