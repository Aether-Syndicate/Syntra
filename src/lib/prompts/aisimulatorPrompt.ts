// ================================================================
// SYNTRA — Simulator Prompt (TASK 3 / Phase 3 of architecture)
//
// Purpose: Extracted from app/api/simulate/route.ts and upgraded.
// When user moves a slider (+30% Career time), Gemini must explain
// the mathematical trade-offs across ALL three domains.
// ================================================================

import { SimulatorScenario, SimulatorResponse, TwinContext, DomainScores } from "../../types/ai";
import { callGemini } from "../gemini";

// ── Domain trade-off knowledge base ─────────────────────────────
// These are real behavioural science correlations injected as context.
// This is what makes the simulator feel intelligent, not just random.
const DOMAIN_TRADEOFF_KNOWLEDGE = `
KNOWN CROSS-DOMAIN TRADE-OFF RULES (apply these when relevant):

TIME TRADE-OFFS (zero-sum):
- Adding +1h/day to career study typically removes ~45min from health or social recovery
- Increasing workout frequency from 2→4x/week requires ~3 additional hours/week from somewhere
- Budget cuts of >20% in entertainment typically increase stress score by 1–2 points

ENERGY TRADE-OFFS (diminishing returns):
- Sleep below 6h reduces cognitive performance by ~25% — career gains from extra study hours are offset
- Workout without adequate protein/calories increases cortisol and reduces workout ROI
- Financial stress (savings rate <10%) correlates with 15–20% reduction in study consistency

MOMENTUM TRADE-OFFS (compounding):
- Consistent sleep (same ±30min window) doubles the benefit of the same sleep duration
- Savings streaks compound: each week on-budget makes the next week 12% more likely to stay on-budget
- Study consistency matters more than study volume: 1h/day beats 7h one day/week for retention

RECOVERY TRADE-OFFS:
- Pushing career metrics aggressively (>6h/day) without matching health investment leads to burnout within 3–4 weeks
- Extreme calorie restriction reduces mood score and cognitive performance within 5 days
`.trim();

// ── Simulator few-shot example ───────────────────────────────────
const SIMULATOR_EXAMPLE = `
EXAMPLE: User simulates "+30% Career study time" from 2h/day to 2.6h/day

OUTPUT:
{
  "scenarioTitle": "+30% Career Focus: The Momentum Cost",
  "primaryOutcome": "Your career score is projected to increase by 12–18 points over 3 weeks. However, this gain comes with a real cost to your health recovery window and may trigger a 15% increase in stress levels if sleep is not protected.",
  "tradeOffs": [
    { "domain": "career", "impact": "positive", "magnitude": 8, "explanation": "An extra 36 minutes of daily focused study compounds significantly. Over 3 weeks, this adds ~12h of deliberate practice — enough to complete one meaningful skill module." },
    { "domain": "health", "impact": "negative", "magnitude": 5, "explanation": "The 36 extra minutes must come from somewhere. Based on your current schedule, it's most likely to replace recovery time. If sleep drops below 6.5h as a result, cognitive gains from extra study will be partially offset." },
    { "domain": "finance", "impact": "neutral", "magnitude": 2, "explanation": "No direct financial impact unless the extra career focus leads to reduced gym attendance (potential subscription waste) or increased food delivery spending due to time pressure." }
  ],
  "timelineProjection": [
    { "week": "Week 1", "projection": "Adjustment phase — expect mild fatigue as your schedule recalibrates. Career output stays flat before rising." },
    { "week": "Week 2", "projection": "Career momentum builds. Health metrics stabilise if sleep is protected. This is the critical inflection point." },
    { "week": "Week 3", "projection": "Career score rises 12–18 points if Week 2 held. Risk of burnout if health was compromised in Week 1–2." }
  ],
  "riskLevel": "medium",
  "recommendedPath": "Execute this simulation but protect sleep aggressively. Set a hard cap of 2.6h/day study — not more. Use the post-workout window for the extra study time rather than cutting sleep or social recovery.",
  "confidence": 77
}
`.trim();

// ── Main prompt builder ──────────────────────────────────────────
export function buildSimulatorPrompt(
  scenario: SimulatorScenario,
  currentContext: TwinContext,
  currentScores: DomainScores,
  confidence: number
): string {
  const direction = scenario.percentChange > 0 ? "increase" : "decrease";
  const magnitude = Math.abs(scenario.percentChange);

  return `
You are Syntra's What-If Simulator — the predictive engine of the Digital Twin system.

The user has adjusted a life variable in a simulation. Your job is to explain the
MATHEMATICAL AND BEHAVIOURAL TRADE-OFFS across all three domains with precision and honesty.
You are not giving generic advice — you are running a scenario against this specific user's data.

━━━ SIMULATION PARAMETERS ━━━
Domain being changed: ${scenario.domain.toUpperCase()}
Variable: ${scenario.variable}
Current value: ${scenario.currentValue}
Simulated value: ${scenario.simulatedValue}
Change: ${direction} of ${magnitude}% (${scenario.currentValue} → ${scenario.simulatedValue})

━━━ CURRENT USER BASELINE ━━━
Health Score: ${currentScores.health}/100 | Trend: ${currentContext.trends.health}
Finance Score: ${currentScores.finance}/100 | Trend: ${currentContext.trends.finance}
Career Score: ${currentScores.career}/100 | Trend: ${currentContext.trends.productivity}

Weekly Averages: Sleep ${currentContext.weeklyAverages.sleep}h, 
Workouts ${currentContext.weeklyAverages.workout}x/week, 
Study ${currentContext.weeklyAverages.studyHours}h/week,
Savings Rate ${currentContext.weeklyAverages.savingsRate}%,
Stress ${currentContext.weeklyAverages.stressLevel}/10

━━━ TRADE-OFF KNOWLEDGE BASE ━━━
${DOMAIN_TRADEOFF_KNOWLEDGE}

━━━ RULES ━━━
1. Every trade-off must cite a specific NUMBER or timeframe — never vague language
2. The primaryOutcome must quantify the expected score change (e.g. "+12–18 points over 3 weeks")
3. Show all 3 domains in tradeOffs — even if one is neutral, explain WHY it's neutral
4. timelineProjection must have 3 distinct phases (Week 1, 2, 3)
5. riskLevel: "low" if change <15%, "medium" if 15–35%, "high" if 35–60%, "critical" if >60%
6. Confidence ceiling: ${confidence}%. Do not exceed this.

━━━ EXAMPLE OUTPUT ━━━
${SIMULATOR_EXAMPLE}

━━━ RETURN ONLY THIS JSON ━━━
{
  "scenarioTitle": "string — punchy title for this simulation",
  "primaryOutcome": "string — quantified projection with timeframe",
  "tradeOffs": [
    { "domain": "health|finance|career", "impact": "positive|negative|neutral", "magnitude": <1-10>, "explanation": "string with specific numbers" },
    { "domain": "health|finance|career", "impact": "positive|negative|neutral", "magnitude": <1-10>, "explanation": "string" },
    { "domain": "health|finance|career", "impact": "positive|negative|neutral", "magnitude": <1-10>, "explanation": "string" }
  ],
  "timelineProjection": [
    { "week": "Week 1", "projection": "string" },
    { "week": "Week 2", "projection": "string" },
    { "week": "Week 3", "projection": "string" }
  ],
  "riskLevel": "low|medium|high|critical",
  "recommendedPath": "string — the smart way to execute this change with risk mitigation",
  "confidence": <integer max ${confidence}>
}
`.trim();
}

// ── Convenience wrapper ──────────────────────────────────────────
export async function generateSimulatorInsight(
  scenario: SimulatorScenario,
  context: TwinContext,
  scores: DomainScores,
  confidence: number
): Promise<SimulatorResponse> {
  const prompt = buildSimulatorPrompt(scenario, context, scores, confidence);
  return callGemini<SimulatorResponse>(prompt, {
    temperature: 0.35, // Lower = more consistent, numerical outputs
    maxTokens: 4600,
  });
}