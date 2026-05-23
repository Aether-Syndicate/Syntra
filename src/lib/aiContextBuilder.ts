// src/lib/aiContextBuilder.ts
import type { TwinContext } from "@/types/ai";

export function buildTwinContext(
  logs: any[],
  userProfile?: { monthlyIncome?: number; monthlyBudget?: number }
): TwinContext {
  const healthLogs = logs.filter(l => l.domain === "health");
  const financeLogs = logs.filter(l => l.domain === "finance");
  const careerLogs = logs.filter(l => l.domain === "career");

  // ─── Helpers ────────────────────────────────────────────────────
  const avg = (arr: number[]) =>
    arr.length
      ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
      : 0;

  const getTrend = (values: number[]): "improving" | "declining" | "stable" => {
    if (values.length < 2) return "stable";
    const first = values[0];
    const last = values[values.length - 1];
    if (last > first * 1.1) return "improving";
    if (last < first * 0.9) return "declining";
    return "stable";
  };

  // ─── Health ─────────────────────────────────────────────────────
  const sleepValues = healthLogs
    .map(l => l.domainData?.sleepHours)
    .filter((v): v is number => typeof v === "number");

  const workoutFlags = healthLogs
    .map(l => (l.domainData?.workoutMinutes > 0 ? 1 : 0));

  const stressValues = healthLogs
    .map(l => l.domainData?.stressLevel)
    .filter((v): v is number => typeof v === "number");

  const moodValues = healthLogs
    .map(l => l.domainData?.moodScore)
    .filter((v): v is number => typeof v === "number");

  const energyValues = healthLogs
    .map(l => l.domainData?.energyLevel)
    .filter((v): v is number => typeof v === "number");

  // Calorie adherence — only when both fields present
  const calorieEntries = healthLogs.filter(
    l => l.domainData?.caloriesConsumed && l.domainData?.calorieGoal
  );
  const calorieAdherence = calorieEntries.length > 0
    ? Math.round(
        calorieEntries.filter(l =>
          Math.abs(l.domainData.caloriesConsumed - l.domainData.calorieGoal)
          / l.domainData.calorieGoal < 0.15
        ).length / calorieEntries.length * 100
      )
    : 50; // neutral when no calorie data

  // ─── Finance ────────────────────────────────────────────────────
  const savedValues = financeLogs
    .map(l => l.domainData?.amountSaved)
    .filter((v): v is number => typeof v === "number");

  const spentValues = financeLogs
    .map(l => l.domainData?.discretionarySpent)
    .filter((v): v is number => typeof v === "number");

  const spendingTimes = financeLogs
    .map(l => l.domainData?.spendingTime)
    .filter((v): v is number => typeof v === "number");

  // ─── Career ─────────────────────────────────────────────────────
  const studyValues = careerLogs
    .map(l => l.domainData?.hoursStudied)
    .filter((v): v is number => typeof v === "number");

  const productivityValues = careerLogs
    .map(l => l.domainData?.productivityRating)
    .filter((v): v is number => typeof v === "number");

  // ─── Derived ────────────────────────────────────────────────────
  const avgSleep = avg(sleepValues);
  const avgStress = avg(stressValues);
  const avgSpent = avg(spentValues);
  const avgSaved = avg(savedValues);
  const avgProductivity = avg(productivityValues);
  const avgMood = avg(moodValues);
  const weeklyWorkouts = Math.round(avg(workoutFlags) * 7 * 10) / 10;

  // Use profile for income/budget if available — otherwise derive from logs
  const monthlyIncome = userProfile?.monthlyIncome || 0;
  const monthlyBudget = userProfile?.monthlyBudget || 0;

  const savingsRate = monthlyIncome > 0
    ? Math.round((avgSaved * 30 / monthlyIncome) * 100)
    : 0;

  const spendingVsBudget = monthlyBudget > 0
    ? Math.round(((avgSpent * 30 - monthlyBudget) / monthlyBudget) * 100)
    : 0;

  // ─── Weekend dropoff ────────────────────────────────────────────
  const weekendCount = logs.filter(l => {
    const day = new Date(l.date).getDay();
    return day === 0 || day === 6;
  }).length;
  const weekdayCount = logs.length - weekendCount;
  const weekendDropoff = weekdayCount > 0 &&
    weekendCount < weekdayCount * 0.4;

  // ─── Late night spending ─────────────────────────────────────────
  const lateNightSpending = spendingTimes.length > 0 &&
    spendingTimes.filter(t => t >= 22).length > spendingTimes.length * 0.3;

  // ─── Correlation flags ───────────────────────────────────────────
  const stressSpendingCorrelation = avgStress > 7 && avgSpent > 100;
  const sleepCareerCorrelation = avgSleep < 6 && avgProductivity < 5;
  const workoutMoodCorrelation = weeklyWorkouts < 2 &&
    moodValues.length > 0 && avgMood < 5;

  return {
    weeklyAverages: {
      sleep: avgSleep,
      workout: weeklyWorkouts,
      studyHours: avg(studyValues) * 7,
      savingsRate,
      moodScore: avgMood || 5,
      stressLevel: avgStress,
      calorieAdherence,
      spendingVsBudget,
    },
    trends: {
      sleep: getTrend(sleepValues),
      productivity: getTrend(productivityValues),
      finance: getTrend(savedValues),
      health: getTrend(
        energyValues.length > 0 ? energyValues
        : moodValues.length > 0 ? moodValues
        : sleepValues
      ),
    },
    behaviorFlags: {
      stressSpendingCorrelation,
      sleepCareerCorrelation,
      workoutMoodCorrelation,
      lateNightSpending,
      weekendDropoff,
    },
    logCount: logs.length,
    daysActive: Math.min(Math.floor(logs.length / 3), 14),
  };
}