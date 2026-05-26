// src/app/api/ai/domain/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Log from "@/models/Log";
import { buildTwinContext } from "@/lib/aiContextBuilder";
import { calculateConfidence } from "@/lib/confidenceScore";
import {
  generateHealthAnalysis,
  generateFinanceAnalysis,
  generateCareerAnalysis,
} from "@/lib/prompts/domainPrompts";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain")?.toLowerCase();

    if (!domain || !["health", "finance", "career"].includes(domain)) {
      return NextResponse.json(
        { error: "Invalid domain. Use health, finance, or career." },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const allLogs = await Log.find({
      userId: new mongoose.Types.ObjectId(session.user.id),
    }).sort({ date: -1 }).limit(42).lean();

    const domainLogs = allLogs.filter(l => l.domain === domain);
    const twinContext = buildTwinContext(allLogs, {
      monthlyIncome: user.profile?.monthlyIncome,
      monthlyBudget: user.profile?.monthlyBudget,
    });
    const confidence = calculateConfidence(allLogs.length);
    const userGoals = user.goals
      .filter((g: any) => g.domain === domain)
      .map((g: any) => g.title);

    let analysis;

    if (domain === "health") {
      // Real consistency calculation using actual log variance
      const sleepHours = domainLogs
        .map(l => l.domainData?.sleepHours)
        .filter((v): v is number => typeof v === "number");

      let sleepConsistency: "consistent" | "irregular" | "very_irregular" = "consistent";
      if (sleepHours.length >= 3) {
        const diff = Math.max(...sleepHours) - Math.min(...sleepHours);
        if (diff > 1.5) sleepConsistency = "irregular";
      }

      analysis = await generateHealthAnalysis({
        avgSleepHours: twinContext.weeklyAverages.sleep,
        sleepConsistency,
        weeklyWorkouts: Math.round(twinContext.weeklyAverages.workout),
        workoutTypes: ["general"],
        avgStressLevel: twinContext.weeklyAverages.stressLevel,
        avgMoodScore: twinContext.weeklyAverages.moodScore,
        nutritionAdherence: twinContext.weeklyAverages.calorieAdherence,
        currentGoals: userGoals.length > 0
          ? userGoals
          : ["Improve overall fitness"],
        logCount: domainLogs.length,
        confidence,
      });

    } else if (domain === "finance") {
      // Flip trend direction — improving savings = decreasing spending
      let spendingTrend: "stable" | "increasing" | "decreasing" = "stable";
      if (twinContext.trends.finance === "improving") spendingTrend = "decreasing";
      if (twinContext.trends.finance === "declining") spendingTrend = "increasing";

      analysis = await generateFinanceAnalysis({
        monthlyIncome: user.profile?.monthlyIncome || 50000,
        monthlyExpenses: {
          discretionary: Math.round(
            (user.profile?.monthlyBudget || 0) *
              (1 + (twinContext.weeklyAverages.spendingVsBudget || 0) / 100)
          ),
        },
        currentSavingsRate: twinContext.weeklyAverages.savingsRate,
        totalSavings: 0,
        totalDebt: 0,
        financialGoals: userGoals.length > 0
          ? userGoals
          : ["Build an emergency fund"],
        spendingTrend,
        logCount: domainLogs.length,
        confidence,
      });

    } else {
      // Real consistency calculation using study hour variance
      const studyHours = domainLogs
        .map(l => l.domainData?.hoursStudied)
        .filter((v): v is number => typeof v === "number");

      let studyConsistency: "consistent" | "irregular" | "very_irregular" = "consistent";
      if (studyHours.length >= 3) {
        const diff = Math.max(...studyHours) - Math.min(...studyHours);
        if (diff > 1.5) studyConsistency = "irregular";
      }

      analysis = await generateCareerAnalysis({
        currentRole: "Professional",
        yearsOfExperience: 2,
        technicalSkills: [],
        weeklyStudyHours: twinContext.weeklyAverages.studyHours,
        studyConsistency,
        currentCourses: [],
        careerGoals: userGoals.length > 0
          ? userGoals
          : ["Advance technical skills"],
        targetSkills: [],
        projectsCompleted: 0,
        portfolioStrength: "weak",
        logCount: domainLogs.length,
        confidence,
      });
    }

    return NextResponse.json(
      { success: true, domain, analysis },
      { 
        status: 200,
        headers: {
          // Tell CDN to cache for 5 minutes (300s), but serve stale data for 10 minutes (600s) while refetching in background
          "Cache-Control": "private, s-maxage=300, stale-while-revalidate=600",
        }
      }
    );

  } catch (error: any) {
    console.error("[DOMAIN ANALYSIS ERROR]", error);
    return NextResponse.json({
      success: false,
      error: "Domain analysis temporarily unavailable.",
    }, { status: 500 });
  }
}