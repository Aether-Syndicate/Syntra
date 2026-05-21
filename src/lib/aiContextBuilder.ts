// src/lib/aiContextBuilder.ts
export function buildTwinContext(logs: any[]) {
  const healthLogs = logs.filter(l => l.domain === "health");
  const financeLogs = logs.filter(l => l.domain === "finance");
  const careerLogs = logs.filter(l => l.domain === "career");

  const avg = (arr: number[]) => 
    arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

  const getTrend = (values: number[]) => {
    if (values.length < 2) return "insufficient_data";
    const first = values[0], last = values[values.length - 1];
    if (last > first * 1.1) return "rising";
    if (last < first * 0.9) return "declining";
    return "stable";
  };

  const sleepValues = healthLogs.map(l => l.domainData?.sleepHours).filter(Boolean);
  const stressValues = healthLogs.map(l => l.domainData?.stressLevel).filter(Boolean);
  const spendValues = financeLogs.map(l => l.domainData?.discretionarySpent).filter(Boolean);
  const studyValues = careerLogs.map(l => l.domainData?.hoursStudied).filter(Boolean);

  const behaviorFlags: string[] = [];
  if (avg(sleepValues) < 6) behaviorFlags.push("chronic_sleep_deprivation");
  if (avg(stressValues) > 7) behaviorFlags.push("high_stress_risk");
  if (avg(spendValues) > 150) behaviorFlags.push("overspending_pattern");
  if (getTrend(studyValues) === "declining") behaviorFlags.push("learning_plateau");
  
  if (avg(sleepValues) < 6 && avg(spendValues) > 150) {
    behaviorFlags.push("stress_linked_spending"); 
  }

  return {
    weeklyAverages: {
      sleep: avg(sleepValues),
      stress: avg(stressValues),
      spending: avg(spendValues),
      studyHours: avg(studyValues),
    },
    trends: {
      sleep: getTrend(sleepValues),
      stress: getTrend(stressValues),
      spending: getTrend(spendValues),
      study: getTrend(studyValues),
    },
    behaviorFlags,
    logCount: logs.length,
  };
}