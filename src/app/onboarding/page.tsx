"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HeartPulse,
  Wallet,
  Briefcase,
  CheckCircle2,
  Sparkles,
  Cpu,
  Brain,
  Sliders,
  Scale,
  Dumbbell,
  Clock,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Activity,
  Flame,
  Check,
  Award,
  Zap,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types & Interfaces
───────────────────────────────────────────── */
type OptVector = "health" | "finance" | "career";

interface ArchetypeCard {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  bg: string;
  borderColor: string;
  glowColor: string;
  vector: OptVector;
  description: string;
  icon: React.ReactNode;
}

const MISSION_PRESETS = [
  "Crack Google Internship",
  "Get a 10 LPA job",
  "Save ₹2 Lakhs",
  "Build a Startup",
  "Lose 15kg"
];

/* ─────────────────────────────────────────────
   Archetype Option Cards
───────────────────────────────────────────── */
const ARCHETYPES: ArchetypeCard[] = [
  {
    id: "operator",
    name: "Operator",
    tagline: "Elite Daily Execution",
    accent: "#ef4444",
    bg: "linear-gradient(135deg, #1f0b0b 0%, #3d1414 100%)",
    borderColor: "rgba(239, 68, 68, 0.4)",
    glowColor: "rgba(239, 68, 68, 0.25)",
    vector: "career",
    description: "Designed for high-productivity execution. Optimizes task density, deep work sessions, and consistency indexes to build an unstoppable daily execution engine.",
    icon: <Zap size={22} color="#ef4444" />,
  },
  {
    id: "architect",
    name: "Architect",
    tagline: "Capital Runway & Wealth SIPs",
    accent: "#10b981",
    bg: "linear-gradient(135deg, #091f14 0%, #103c27 100%)",
    borderColor: "rgba(16, 185, 129, 0.4)",
    glowColor: "rgba(16, 185, 129, 0.25)",
    vector: "finance",
    description: "Prioritizes capital allocation, savings rate optimization, and long-term financial runway simulation to guarantee bulletproof wealth stability.",
    icon: <Wallet size={22} color="#10b981" />,
  },
  {
    id: "scholar",
    name: "Scholar",
    tagline: "Rapid Skill Ingestion",
    accent: "#3b82f6",
    bg: "linear-gradient(135deg, #0b162f 0%, #142858 100%)",
    borderColor: "rgba(59, 130, 246, 0.4)",
    glowColor: "rgba(59, 130, 246, 0.25)",
    vector: "career",
    description: "Optimized for structured learning velocity, academic mastery, and DSA competency. Perfect for accelerating technical growth and exam performance.",
    icon: <Briefcase size={22} color="#3b82f6" />,
  },
  {
    id: "titan",
    name: "Titan",
    tagline: "Symmetric Life Optimization",
    accent: "#f59e0b",
    bg: "linear-gradient(135deg, #241807 0%, #442e0d 100%)",
    borderColor: "rgba(245, 158, 11, 0.4)",
    glowColor: "rgba(245, 158, 11, 0.25)",
    vector: "health",
    description: "Synchronizes elite sleep cycles, recovery indexes, and metabolic workout baselines. Focuses on building an indestructible biological engine to support heavy intellectual loads.",
    icon: <HeartPulse size={22} color="#f59e0b" />,
  },
  {
    id: "founder",
    name: "Founder",
    tagline: "High-Stakes Hyper-Focus",
    accent: "#8b5cf6",
    bg: "linear-gradient(135deg, #1b0c2e 0%, #341857 100%)",
    borderColor: "rgba(139, 92, 246, 0.4)",
    glowColor: "rgba(139, 92, 246, 0.25)",
    vector: "career",
    description: "A high-leverage configuration that channels intensive career study hours, disruptive product building velocity, and hyper-focus metrics to power early-stage venture execution.",
    icon: <Activity size={22} color="#8b5cf6" />,
  },
];

/* ─────────────────────────────────────────────
   Syntra Monogram Component
───────────────────────────────────────────── */
function SyntraMonogram() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 28 }}>
      <div style={{ position: "relative", width: 56, height: 56 }}>
        <div style={{
          position: "absolute", inset: -6,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,102,255,0.15) 0%, transparent 70%)",
        }} />
        <svg width="56" height="56" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="mono-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0a1628" />
              <stop offset="100%" stopColor="#050d1a" />
            </radialGradient>
            <radialGradient id="mono-glow1" cx="40%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#0044DD" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0044DD" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="35" fill="url(#mono-bg)" stroke="rgba(0,68,221,0.25)" strokeWidth="1" />
          <circle cx="36" cy="36" r="35" fill="url(#mono-glow1)" />
          <circle cx="28" cy="36" r="14" fill="none" stroke="rgba(0,102,255,0.5)" strokeWidth="1" />
          <circle cx="44" cy="36" r="14" fill="none" stroke="rgba(0,68,221,0.5)" strokeWidth="1" />
          <circle cx="36" cy="36" r="2" fill="#60a5fa" />
        </svg>
      </div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.95rem",
        fontWeight: 800,
        color: "#ffffff",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
      }}>
        SYNTRA
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Twin Observation — completion screen
───────────────────────────────────────────── */
function getTwinFirstObservation(
  sleepHours: number,
  studyHoursPerDay: number,
  optimizationVector: "health" | "finance" | "career",
  daysStudiedLastWeek: number
): string {
  if (sleepHours < 6.5) {
    return "It noticed you're running on less sleep than it needs to model you accurately. That's the first lever.";
  }
  if (daysStudiedLastWeek <= 2 && optimizationVector === "career") {
    return "It sees you're studying fewer than 3 days a week. That's where it'll focus first.";
  }
  if (optimizationVector === "finance") {
    return "It's calibrated to your wealth goals. The first thing it'll track is whether your savings rate matches your targets.";
  }
  if (studyHoursPerDay < 2) {
    return "It noticed your daily study time is under 2 hours. That's the gap between where you are and where you want to be.";
  }
  return "It's calibrated and watching. Your first log will sharpen the picture.";
}

/* ─────────────────────────────────────────────
   Main Onboarding Page
───────────────────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0); // Steps: 0 to 7
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Layer 1: Anatomical State ───
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [averageSleep, setAverageSleep] = useState("0");
  const [workoutFrequency, setWorkoutFrequency] = useState("0");
  const [activityLevel, setActivityLevel] = useState("moderately_active");
  const [healthConstraints, setHealthConstraints] = useState("none");
  const [customHealthConstraint, setCustomHealthConstraint] = useState("");

  // ─── Layer 2: Financial State ───
  const [monthlyIncomeRange, setMonthlyIncomeRange] = useState("custom");
  const [customIncome, setCustomIncome] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [spendingStyle, setSpendingStyle] = useState("3"); // 1 to 5
  const [biggestGoal, setBiggestGoal] = useState("emergency_fund");
  const [customGoalTitle, setCustomGoalTitle] = useState("");

  // ─── Layer 3: Behavioral State ───
  const [hoursStudied, setHoursStudied] = useState("0");
  const [focusRating, setFocusRating] = useState("0");
  const [daysStudiedLastWeek, setDaysStudiedLastWeek] = useState(0);
  const [sessionsPerWeek, setSessionsPerWeek] = useState("5");
  const [learningProfile, setLearningProfile] = useState("professional");
  const [goalHorizon, setGoalHorizon] = useState("1_year");

  // ─── Layer 4: Identity State ───
  const [archetype, setArchetype] = useState("titan");

  // ─── Personal Mission State ───
  const [personalMission, setPersonalMission] = useState("");
  const [customMissionText, setCustomMissionText] = useState("");
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(null);

  // ─── Twin Construction Telemetry logs ───
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  // Fullscreen cinematic wow transition states after onboarding completion
  const [showConstructionWow, setShowConstructionWow] = useState(false);
  const [currentWowStep, setCurrentWowStep] = useState(0);

  // ─── Computed Potential Scores ───
  const [potentials, setPotentials] = useState({
    healthPotential: 78,
    financePotential: 62,
    careerPotential: 85,
    syncPercentage: 74,
  });

  useEffect(() => { setMounted(true); }, []);

  // Wow cinematic progression control
  useEffect(() => {
    if (!showConstructionWow) return;
    
    const intervals = [1100, 1100, 1100, 1100, 1300, 1300, 1600];
    let stepIndex = 0;
    
    const runNext = () => {
      if (stepIndex < 6) {
        stepIndex++;
        setCurrentWowStep(stepIndex);
        setTimeout(runNext, intervals[stepIndex]);
      } else {
        router.push("/dashboard");
      }
    };
    
    setTimeout(runNext, intervals[0]);
  }, [showConstructionWow]);

  // ─── Real-Time Mathematical Estimators ───

  // 1. Anatomical calculations (gracefully handles empty/zero states)
  const wVal = parseFloat(weight) || 0;
  const hVal = (parseFloat(height) || 0) / 100;
  const computedBMI = hVal > 0 ? parseFloat((wVal / (hVal * hVal)).toFixed(1)) : 0;
  
  const genderFactor = gender === "male" ? 5 : gender === "female" ? -161 : -80;
  const computedBMR = wVal > 0 && parseFloat(height) > 0 && parseFloat(age) > 0
    ? Math.round(10 * wVal + 6.25 * parseFloat(height) - 5 * parseFloat(age) + genderFactor)
    : 0;
  
  const actMultiplier = 
    activityLevel === "sedentary" ? 1.2 :
    activityLevel === "lightly_active" ? 1.375 :
    activityLevel === "moderately_active" ? 1.55 :
    activityLevel === "very_active" ? 1.725 : 1.9;
  const computedMaintenance = computedBMR > 0 ? Math.round(computedBMR * actMultiplier) : 0;
  
  const sleepValueParsed = parseFloat(averageSleep) || 0;
  const workoutsValueParsed = parseFloat(workoutFrequency) || 0;
  
  const computedRecovery = sleepValueParsed > 0 ? Math.min(99, Math.round(sleepValueParsed * 10 + 15)) : 0;
  const computedHealthBaseline = sleepValueParsed > 0 || workoutsValueParsed > 0
    ? Math.min(99, Math.round((sleepValueParsed / 8 * 40) + (workoutsValueParsed / 5 * 30) + 20))
    : 0;

  // 2. Financial calculations
  const incomeVal =
    monthlyIncomeRange === "student" ? 0 :
    monthlyIncomeRange === "0-20k" ? 10000 :
    monthlyIncomeRange === "20-50k" ? 35000 :
    monthlyIncomeRange === "50-100k" ? 75000 :
    monthlyIncomeRange === "100k+" ? 125000 : parseFloat(customIncome) || 0;
  
  const savingsVal = parseFloat(currentSavings) || 0;
  const discretionaryMult = (parseFloat(spendingStyle) || 3) / 5; // 0.2 to 1.0
  const monthlyDiscretionary = Math.round(incomeVal * 0.4 * discretionaryMult);
  const monthlySavingsRate = Math.max(0, incomeVal - monthlyDiscretionary - Math.round(incomeVal * 0.4));
  
  const computedRunway = monthlyDiscretionary > 0 ? parseFloat((savingsVal / monthlyDiscretionary).toFixed(1)) : 0;
  const computedSavingsRatePct = incomeVal > 0 ? Math.round((monthlySavingsRate / incomeVal) * 100) : 0;
  const computedFinancialStability = incomeVal > 0 || savingsVal > 0
    ? Math.min(99, Math.round(computedSavingsRatePct * 1.3 + Math.min(6, computedRunway) * 3.5 + 40))
    : 0;
  const computedProjectedSavings = Math.round(savingsVal + monthlySavingsRate * 12);

  // 3. Behavioral calculations
  const studyHoursVal = parseFloat(hoursStudied) || 0;
  const focusVal = parseFloat(focusRating) || 0;
  const consistencyVal = Math.round((daysStudiedLastWeek / 7) * 10);

  const computedCareerVelocity = parseFloat((studyHoursVal * focusVal / 10).toFixed(1)) || 0;
  const computedConsistencyIdx = consistencyVal * 10;
  const computedExecutionPotential = studyHoursVal > 0 || focusVal > 0 || daysStudiedLastWeek > 0
    ? Math.min(99, Math.round(computedCareerVelocity * 4.5 + computedConsistencyIdx * 0.4 + 30))
    : 0;

  // ─── Step 5: Construction Terminal Loop ───
  useEffect(() => {
    if (step === 5) {
      const logs = [
        "syn@syntra-core:~# boot --neural-twin",
        "[SYSTEM] Activating digital avatar template core...",
        "Building Anatomical Model based on lifestyle matrix... ✓",
        "Mapping Financial Vectors and discretionary spending curves... ✓",
        "Syncing Behavioral Patterns and weekly study velocity... ✓",
        "Computing 12-Month Trajectory future-state projection... ✓",
        "Twin calibration handshake complete. Initializing reports...",
      ];
      setTerminalLines([]);
      logs.forEach((line, index) => {
        setTimeout(() => {
          setTerminalLines(prev => [...prev, line]);
          if (index === logs.length - 1) {
            setTimeout(() => {
              // Calculate final potential outcomes
              const sleep = parseFloat(averageSleep) || 7.0;
              const workouts = parseFloat(workoutFrequency) || 3;
              const hasConstraints = healthConstraints !== "none";
              const healthScore = Math.round(Math.max(30, Math.min(98, 40 + (sleep / 8) * 30 + (workouts / 5) * 20 + (hasConstraints ? -10 : 8))));

              const targetSavingsRate = incomeVal > 0 ? Math.round((monthlySavingsRate / incomeVal) * 100) : 20;
              const runwayMonths = monthlyDiscretionary > 0 ? savingsVal / monthlyDiscretionary : 6;
              const financeScore = Math.round(Math.max(30, Math.min(98, 35 + targetSavingsRate * 1.3 + Math.min(6, runwayMonths) * 3.5)));

              const study = parseFloat(hoursStudied) || 3;
              const focus = parseFloat(focusRating) || 7;
              const consistency = Math.round((daysStudiedLastWeek / 7) * 10) || 5;
              const careerScore = Math.round(Math.max(30, Math.min(98, 35 + study * 3.5 + focus * 2.5 + consistency * 2.5)));

              const sync = Math.round((healthScore + financeScore + careerScore) / 3);

              setPotentials({
                healthPotential: healthScore,
                financePotential: financeScore,
                careerPotential: careerScore,
                syncPercentage: sync,
              });
              setStep(6);
            }, 850);
          }
        }, (index + 1) * 450);
      });
    }
  }, [step]);

  // ─── Save Onboarding Details API Call ───
  const finalizeOnboarding = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age,
          gender,
          height,
          weight,
          bodyFat,
          averageSleep,
          workoutFrequency,
          activityLevel,
          healthConstraints: healthConstraints === "custom" ? (customHealthConstraint || "none") : healthConstraints,
          monthlyIncomeRange,
          customIncome,
          currentSavings,
          spendingStyle,
          biggestGoal,
          customGoalTitle,
          hoursStudied,
          focusRating,
          daysStudiedLastWeek,
          sessionsPerWeek,
          learningProfile,
          goalHorizon,
          archetype,
          personalMission,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to finalize onboarding twin.");
      }

      window.dispatchEvent(new Event("syntra-refresh"));
      setShowConstructionWow(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#020812 0%,#030e1e 55%,#040a14 100%)",
      fontFamily: '"Inter","DM Sans",-apple-system,sans-serif',
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        
        @keyframes networkPulse {
          0% { transform: scale(1); box-shadow: 0 0 12px rgba(59, 130, 246, 0.25); }
          50% { transform: scale(1.06); box-shadow: 0 0 24px rgba(59, 130, 246, 0.55); }
          100% { transform: scale(1); box-shadow: 0 0 12px rgba(59, 130, 246, 0.25); }
        }

        * { box-sizing: border-box; }
        
        /* Ambient grid overlays */
        .ob-bg-mesh {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 70% 50% at 10% 10%, rgba(0,68,221,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 90% 90%, rgba(139,92,246,0.04) 0%, transparent 60%);
        }
        
        .ob-grid-overlay {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(0,68,221,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,68,221,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        /* Card Container styling */
        .ob-container {
          position: relative; z-index: 1;
          width: 100%; max-width: 820px;
          background: rgba(8, 17, 36, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(0, 102, 255, 0.15);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        /* Form Controls */
        .form-label {
          font-size: 0.78rem; font-weight: 600; color: #94a3b8;
          display: block; margin-bottom: 8px; letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .form-select, .form-input {
          width: 100%; padding: 12px 16px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(4,10,22,0.8);
          color: #fff; font-family: 'Inter', sans-serif; font-size: 0.88rem;
          outline: none; transition: all 0.2s;
          height: 46px;
        }
        
        .form-select:focus, .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
        }

        /* Steps progress bar */
        .step-pill {
          height: 3px; flex: 1; border-radius: 9999px;
          background: rgba(255,255,255,0.06); transition: all 0.3s;
        }
        .step-pill.active {
          background: #3b82f6; box-shadow: 0 0 8px rgba(59,130,246,0.5);
        }

        /* Button styles */
        .ob-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px 28px; border-radius: 12px; border: none;
          font-family: 'Inter', sans-serif; font-size: 0.88rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
        }
        
        .ob-btn-primary {
          background: linear-gradient(135deg, #3b82f6, #6366f1); color: #fff;
          box-shadow: 0 4px 18px rgba(59,130,246,0.3);
        }
        
        .ob-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(59,130,246,0.45);
        }
        
        .ob-btn-primary:disabled {
          opacity: 0.4; cursor: not-allowed; transform: none;
        }

        .ob-btn-secondary {
          background: rgba(255,255,255,0.05); color: #94a3b8;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .ob-btn-secondary:hover {
          background: rgba(255,255,255,0.08); color: #fff;
        }

        /* HUD readout panels */
        .hud-panel {
          background: rgba(4,10,22,0.95);
          border: 1px dashed rgba(59,130,246,0.25);
          border-radius: 16px;
          padding: 20px;
          display: flex; flex-direction: column; gap: 14px;
        }

        .hud-title {
          font-size: 0.65rem; font-weight: 700; color: #60a5fa;
          letter-spacing: 0.12em; text-transform: uppercase;
          display: flex; align-items: center; gap: 6px;
          margin-bottom: 4px;
        }

        .hud-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
        }

        .hud-value {
          font-family: 'DM Sans', sans-serif; font-size: 1.6rem;
          font-weight: 800; color: #fff; line-height: 1.1;
        }

        .hud-label {
          font-size: 0.72rem; color: rgba(255,255,255,0.4);
          margin-top: 3px; font-weight: 500;
        }

        /* Slider Custom Styling */
        .range-slider {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 5px; border-radius: 999px;
          background: rgba(255,255,255,0.1); outline: none;
          cursor: pointer;
        }
        
        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 18px; height: 18px;
          border-radius: 50%; background: #3b82f6;
          border: 2px solid #fff; box-shadow: 0 0 8px rgba(59,130,246,0.4);
          transition: transform 0.1s;
        }
        .range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }

        /* Card Selector Grid */
        .select-card {
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(4,10,22,0.6);
          border-radius: 16px; padding: 20px; cursor: pointer;
          transition: all 0.22s ease-in-out;
          text-align: left;
        }
        .select-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.18);
          background: rgba(4,10,22,0.85);
        }
        .select-card.selected {
          background: var(--card-bg);
          border-color: var(--card-border);
          box-shadow: 0 8px 32px var(--card-glow);
        }

        /* Terminal effect */
        .terminal-box {
          font-family: 'Courier New', Courier, monospace;
          background: #030810; border-radius: 12px;
          border: 1px solid rgba(59,130,246,0.15);
          padding: 20px; font-size: 0.78rem; line-height: 1.6;
          color: #94a3b8; height: 200px; overflow-y: auto;
          text-align: left;
        }

        /* Potential Meter Gagues */
        .circle-meter {
          position: relative; width: 90px; height: 90px;
          display: flex; items-center: center; justify-content: center;
        }

        @keyframes fillProgress {
          from { stroke-dashoffset: 251; }
          to { stroke-dashoffset: var(--dashoffset); }
        }

        .meter-svg {
          transform: rotate(-90deg); width: 90px; height: 90px;
        }

        .meter-bg {
          fill: none; stroke: rgba(255,255,255,0.05); stroke-width: 6;
        }

        .meter-fill {
          fill: none; stroke-width: 6; stroke-linecap: round;
          stroke-dasharray: 251.2;
          animation: fillProgress 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @media (max-width: 768px) {
          .ob-grid { grid-template-columns: 1fr !important; }
          .hud-panel { margin-top: 10px; }
          .ob-container { border-radius: 16px; }
        }
      `}</style>

      {/* Grid Backdrops */}
      <div className="ob-bg-mesh" />
      <div className="ob-grid-overlay" />

      {/* Welcome Step 0 */}
      {step === 0 && (
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 540 }}>
          <SyntraMonogram />
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "2.3rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", margin: "0 0 16px", lineHeight: 1.15 }}>
            Let's build your <span style={{ background: "linear-gradient(90deg, #60a5fa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>digital twin</span>
          </h1>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 32 }}>
            Calibrate your personal AI twin in 2 minutes. By synchronizing your physical health, spending patterns, and focus habits, Syntra models your daily limits to optimize your energy, runway, and goals as a unified engine.
          </p>
          <button className="ob-btn ob-btn-primary" onClick={() => setStep(1)} style={{ padding: "16px 36px", borderRadius: "14px" }}>
            Let's build your twin <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Active Form Wizard */}
      {step > 0 && step < 5 && (
        <div className="ob-container">
          {/* Header Progress strip */}
          <div style={{ display: "flex", gap: 6, padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className={`step-pill ${step >= idx ? "active" : ""}`} />
            ))}
          </div>

          <div style={{ padding: 32 }}>
            
            {/* LAYER 1: ANATOMICAL TWIN */}
            {step === 1 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <HeartPulse size={20} color="#ef4444" />
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.1em" }}>Step 1 of 4</span>
                </div>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.65rem", fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Let&apos;s start with your body. Your twin uses this to set its first baseline.</h2>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginBottom: 28, lineHeight: 1.5 }}>
                  Map your baseline physical metrics. Be accurate — your twin calibrates recovery and energy models from this.
                </p>

                <div className="ob-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32 }}>
                  {/* Left: Fields */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div>
                        <label className="form-label">Age</label>
                        <input type="number" min="13" max="110" className="form-input" value={age} onChange={(e) => setAge(e.target.value)} />
                      </div>
                      <div>
                        <label className="form-label">Gender</label>
                        <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-Binary</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div>
                        <label className="form-label">Height (cm)</label>
                        <input type="number" min="100" max="250" className="form-input" value={height} onChange={(e) => setHeight(e.target.value)} />
                      </div>
                      <div>
                        <label className="form-label">Weight (kg)</label>
                        <input type="number" min="30" max="200" className="form-input" value={weight} onChange={(e) => setWeight(e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Activity Level</label>
                      <select className="form-select" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                        <option value="sedentary">Sedentary</option>
                        <option value="lightly_active">Lightly Active</option>
                        <option value="moderately_active">Moderately Active</option>
                        <option value="very_active">Highly Active</option>
                        <option value="athlete">Athlete</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Average Sleep (Hours/Night)</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <input type="range" min="4" max="10" step="0.1" className="range-slider" value={averageSleep} onChange={(e) => setAverageSleep(e.target.value)} />
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", width: 44, textAlign: "right" }}>{averageSleep}h</span>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Workouts Per Week</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <input type="range" min="0" max="7" step="1" className="range-slider" value={workoutFrequency} onChange={(e) => setWorkoutFrequency(e.target.value)} />
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", width: 44, textAlign: "right" }}>{workoutFrequency}x</span>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Health Constraints</label>
                      <select className="form-select" value={healthConstraints} onChange={(e) => setHealthConstraints(e.target.value)}>
                        <option value="none">None</option>
                        <option value="diabetes">Diabetes</option>
                        <option value="hypertension">Hypertension</option>
                        <option value="asthma">Asthma</option>
                        <option value="custom">Other / Custom Constraint</option>
                      </select>
                    </div>

                    {healthConstraints === "custom" && (
                      <div style={{ marginTop: 12 }}>
                        <label className="form-label">Specify Constraint</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Thyroid, Migraine, none"
                          value={customHealthConstraint}
                          onChange={(e) => setCustomHealthConstraint(e.target.value)}
                          style={{ height: "42px" }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Right: Dynamic HUD */}
                  <div>
                    <div className="hud-panel">
                      <div className="hud-title"><Scale size={13} /> Body Stats Overview</div>
                      
                      <div className="hud-grid">
                        <div>
                          <div className="hud-value">{computedBMI}</div>
                          <div className="hud-label">Computed BMI</div>
                        </div>
                        <div>
                          <div className="hud-value">{computedBMR}</div>
                          <div className="hud-label">Daily BMR (kcal)</div>
                        </div>
                      </div>
 
                      <div className="hud-grid" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14 }}>
                        <div>
                          <div className="hud-value">{computedMaintenance}</div>
                          <div className="hud-label">Maintenance (kcal)</div>
                        </div>
                        <div>
                          <div className="hud-value">{computedRecovery}%</div>
                          <div className="hud-label">Recovery Index</div>
                        </div>
                      </div>
 
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14, textAlign: "left" }}>
                        <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Body Health Score</span>
                          <span style={{ color: "#ef4444", fontWeight: 700, fontSize: "0.9rem" }}>{computedHealthBaseline}</span>
                        </div>
                        <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${computedHealthBaseline}%`, background: "#ef4444" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LAYER 2: FINANCIAL TWIN */}
            {step === 2 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <Wallet size={20} color="#10b981" />
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.1em" }}>Step 2 of 4</span>
                </div>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.65rem", fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Now your finances. Be specific — your twin will track this against your goals.</h2>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginBottom: 28, lineHeight: 1.5 }}>
                  Monthly income, savings, and spending patterns. Your twin uses this to model your financial runway.
                </p>

                <div className="ob-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32 }}>
                  {/* Left Fields */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                      <label className="form-label">Monthly take-home income (₹, after tax)</label>
                      <select className="form-select" value={monthlyIncomeRange} onChange={(e) => setMonthlyIncomeRange(e.target.value)}>
                        <option value="student">Student (₹0/month)</option>
                        <option value="0-20k">Up to ₹20,000/month</option>
                        <option value="20-50k">₹20,000 – ₹50,000/month</option>
                        <option value="50-100k">₹50,000 – ₹1,00,000/month</option>
                        <option value="100k+">More than ₹1,00,000/month</option>
                        <option value="custom">Custom amount</option>
                      </select>
                    </div>

                    {monthlyIncomeRange === "custom" && (
                      <div>
                        <label className="form-label">Exact Income (₹/Month)</label>
                        <input type="number" className="form-input" value={customIncome} onChange={(e) => setCustomIncome(e.target.value)} />
                      </div>
                    )}

                    <div>
                      <label className="form-label">Current Savings (₹)</label>
                      <input type="number" className="form-input" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} />
                    </div>

                    <div>
                      <label className="form-label">Spending Style</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <input type="range" min="1" max="5" step="1" className="range-slider" value={spendingStyle} onChange={(e) => setSpendingStyle(e.target.value)} />
                        <span style={{ color: "#10b981", fontWeight: 700, fontSize: "0.76rem", width: 90, textAlign: "right", textTransform: "uppercase" }}>
                          {spendingStyle === "1" ? "Ultrasafe" : spendingStyle === "2" ? "Frugal" : spendingStyle === "3" ? "Moderate" : spendingStyle === "4" ? "Impassive" : "Aggressive"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Primary Objective Goal</label>
                      <select className="form-select" value={biggestGoal} onChange={(e) => setBiggestGoal(e.target.value)}>
                        <option value="emergency_fund">6-Month Emergency Fund</option>
                        <option value="laptop">Next-Gen Workspace Laptop</option>
                        <option value="vehicle">Personal Downpayment Vehicle</option>
                        <option value="house">Real Estate Asset Capital</option>
                        <option value="business">Personal Business Seed Fund</option>
                        <option value="retirement">Early Retirement Fund Basis</option>
                        <option value="custom">Custom Objective</option>
                      </select>
                    </div>

                    {biggestGoal === "custom" && (
                      <div>
                        <label className="form-label">Goal Title (e.g. "Buy Mahindra Thar")</label>
                        <input type="text" className="form-input" placeholder="Goal name" value={customGoalTitle} onChange={(e) => setCustomGoalTitle(e.target.value)} />
                      </div>
                    )}
                  </div>

                  {/* Right HUD */}
                  <div>
                    <div className="hud-panel" style={{ borderColor: "rgba(16, 185, 129, 0.25)" }}>
                      <div className="hud-title" style={{ color: "#10b981" }}><TrendingUp size={13} /> Savings & Spending</div>
 
                      <div className="hud-grid">
                        <div>
                          <div className="hud-value">{computedRunway}m</div>
                          <div className="hud-label">Months of Financial Buffer</div>
                        </div>
                        <div>
                          <div className="hud-value">{computedSavingsRatePct}%</div>
                          <div className="hud-label">Savings Rate</div>
                        </div>
                      </div>
 
                      <div className="hud-grid" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14 }}>
                        <div>
                          <div className="hud-value">₹{(computedProjectedSavings / 1000).toFixed(1)}k</div>
                          <div className="hud-label">Projected 12M Savings</div>
                        </div>
                        <div>
                          <div className="hud-value">₹{Math.round(monthlySavingsRate / 30)}/d</div>
                          <div className="hud-label">Est. Save Velocity</div>
                        </div>
                      </div>
 
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14, textAlign: "left" }}>
                        <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Financial Stability Score</span>
                          <span style={{ color: "#10b981", fontWeight: 700, fontSize: "0.9rem" }}>{computedFinancialStability}</span>
                        </div>
                        <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${computedFinancialStability}%`, background: "#10b981" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LAYER 3: BEHAVIORAL TWIN */}
            {step === 3 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <Briefcase size={20} color="#3b82f6" />
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.1em" }}>Step 3 of 4</span>
                </div>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.65rem", fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em" }}>How you actually spend your time. Not how you intend to — how you do.</h2>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginBottom: 28, lineHeight: 1.5 }}>
                  Study hours, focus quality, and real consistency. Your twin needs actual behavior, not aspirations.
                </p>

                <div className="ob-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32 }}>
                  {/* Left Fields */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Personal Mission Narrative Input */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: 18 }}>
                      <label className="form-label" style={{ color: "#3b82f6", fontWeight: 700, fontSize: "0.75rem", marginBottom: 12 }}>
                        🎯 Personal Mission
                      </label>
                      <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", marginBottom: 14 }}>
                        What is the most important thing you want to achieve in the next 12 months?
                      </div>
                      
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                        {MISSION_PRESETS.map((preset, idx) => {
                          const isSelected = selectedPresetIndex === idx;
                          return (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => {
                                setSelectedPresetIndex(idx);
                                setPersonalMission(preset);
                              }}
                              style={{
                                padding: "8px 14px",
                                borderRadius: "999px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                background: isSelected ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.03)",
                                border: `1px solid ${isSelected ? "rgba(59, 130, 246, 0.5)" : "rgba(255,255,255,0.06)"}`,
                                color: isSelected ? "#60a5fa" : "rgba(255,255,255,0.6)",
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                            >
                              {preset}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPresetIndex(-1);
                            setPersonalMission(customMissionText);
                          }}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "999px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            background: selectedPresetIndex === -1 ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.03)",
                            border: `1px solid ${selectedPresetIndex === -1 ? "rgba(59, 130, 246, 0.5)" : "rgba(255,255,255,0.06)"}`,
                            color: selectedPresetIndex === -1 ? "#60a5fa" : "rgba(255,255,255,0.6)",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          ✍️ Custom Mission
                        </button>
                      </div>

                      {(selectedPresetIndex === -1 || (personalMission && !MISSION_PRESETS.includes(personalMission))) && (
                        <div>
                          <input
                            type="text"
                            placeholder="Enter your custom 12-month goal..."
                            className="form-input"
                            value={customMissionText}
                            onChange={(e) => {
                              setCustomMissionText(e.target.value);
                              setPersonalMission(e.target.value);
                            }}
                            style={{
                              borderColor: "rgba(59, 130, 246, 0.35)",
                              boxShadow: "0 0 10px rgba(59,130,246,0.1)",
                              height: "42px"
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="form-label">Study / Work Hours Per Day</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <input type="range" min="1" max="12" step="0.5" className="range-slider" value={hoursStudied} onChange={(e) => setHoursStudied(e.target.value)} />
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", width: 44, textAlign: "right" }}>{hoursStudied}h</span>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Typical Focus Quality Rating</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <input type="range" min="1" max="10" step="1" className="range-slider" value={focusRating} onChange={(e) => setFocusRating(e.target.value)} />
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", width: 44, textAlign: "right" }}>{focusRating}/10</span>
                      </div>
                    </div>

                    <div>
                      <label className="form-label" style={{ display: "block", marginBottom: 8 }}>Study days last week</label>
                      <div role="group" aria-label="Days studied last week" style={{ display: "flex", gap: 6 }}>
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => setDaysStudiedLastWeek(day)}
                            aria-pressed={daysStudiedLastWeek === day}
                            aria-label={`${day} day${day !== 1 ? "s" : ""}`}
                            style={{
                              flex: 1,
                              minWidth: 0,
                              padding: "10px 0",
                              borderRadius: 8,
                              border: `1px solid ${daysStudiedLastWeek === day ? "rgba(59,130,246,0.8)" : "rgba(255,255,255,0.08)"}`,
                              background: daysStudiedLastWeek === day ? "rgba(59,130,246,0.2)" : "rgba(4,10,22,0.6)",
                              color: daysStudiedLastWeek === day ? "#60a5fa" : "rgba(255,255,255,0.5)",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              transition: "all 0.15s",
                            }}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: 6 }}>days in the last week</p>
                    </div>

                    <div>
                      <label className="form-label">Goal Execution Horizon</label>
                      <select className="form-select" value={goalHorizon} onChange={(e) => setGoalHorizon(e.target.value)}>
                        <option value="3_months">3 Months (Short Sprint)</option>
                        <option value="6_months">6 Months (Tactical Phase)</option>
                        <option value="1_year">1 Year (Structured Pivot)</option>
                        <option value="3_years">3 Years (Strategic Shift)</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Learning Domain Category</label>
                      <select className="form-select" value={learningProfile} onChange={(e) => setLearningProfile(e.target.value)}>
                        <option value="student">Student (DSA/Campus Prep)</option>
                        <option value="professional">Working Professional (Growth)</option>
                        <option value="founder">Founder / Builder (Product Launch)</option>
                        <option value="freelancer">Freelancer (Client Outflow)</option>
                        <option value="job_seeker">Job Seeker (Active Search)</option>
                      </select>
                    </div>
                  </div>

                  {/* Right HUD */}
                  <div>
                    <div className="hud-panel" style={{ borderColor: "rgba(59, 130, 246, 0.25)" }}>
                      <div className="hud-title" style={{ color: "#3b82f6" }}><Clock size={13} /> Focus & Study Habits</div>
 
                      <div className="hud-grid">
                        <div>
                          <div className="hud-value">{computedCareerVelocity}</div>
                          <div className="hud-label">Career Velocity Rating</div>
                        </div>
                        <div>
                          <div className="hud-value">{computedConsistencyIdx}%</div>
                          <div className="hud-label">Consistency Index</div>
                        </div>
                      </div>
 
                      <div className="hud-grid" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14 }}>
                        <div>
                          <div className="hud-value">{Math.round(studyHoursVal * 7)}h</div>
                          <div className="hud-label">Target Study / Week</div>
                        </div>
                        <div>
                          <div className="hud-value">High</div>
                          <div className="hud-label">Recruiter Signal</div>
                        </div>
                      </div>
 
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14, textAlign: "left" }}>
                        <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Focus & Consistency Score</span>
                          <span style={{ color: "#3b82f6", fontWeight: 700, fontSize: "0.9rem" }}>{computedExecutionPotential}</span>
                        </div>
                        <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${computedExecutionPotential}%`, background: "#3b82f6" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LAYER 4: IDENTITY ARCHETYPE */}
            {step === 4 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <Brain size={20} color="#8b5cf6" />
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.1em" }}>Step 4 of 4</span>
                </div>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.65rem", fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Finally — what you&apos;re building toward.</h2>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginBottom: 28, lineHeight: 1.5 }}>
                  Choose the archetype that matches your direction. This shapes your twin&apos;s daily prioritization.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {ARCHETYPES.map((arch) => {
                    const isSelected = archetype === arch.id;
                    return (
                      <div
                        key={arch.id}
                        className={`select-card${isSelected ? " selected" : ""}`}
                        style={{
                          ["--card-bg" as any]: arch.bg,
                          ["--card-border" as any]: arch.borderColor,
                          ["--card-glow" as any]: arch.glowColor,
                          display: "flex",
                          gap: 16,
                          alignItems: "flex-start",
                        }}
                        onClick={() => setArchetype(arch.id)}
                      >
                        <div style={{
                          width: 44, height: 44, borderRadius: 10,
                          background: isSelected ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${isSelected ? arch.borderColor : "rgba(255,255,255,0.06)"}`,
                          display: "flex", alignItems: "center", justifyItems: "center",
                          justifyContent: "center", flexShrink: 0
                        }}>
                          {arch.icon}
                        </div>
                        <div>
                          <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ fontSize: "0.92rem", fontWeight: 800, color: "#fff", margin: 0 }}>{arch.name}</h3>
                            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: arch.accent, textTransform: "uppercase", letterSpacing: "0.05em" }}>{arch.tagline}</span>
                          </div>
                          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", margin: "6px 0 0 0", lineHeight: 1.6 }}>{arch.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24 }}>
              <button className="ob-btn ob-btn-secondary" onClick={() => setStep(step - 1)}>
                Back
              </button>
              <button
                className="ob-btn ob-btn-primary"
                onClick={() => {
                  if (step < 4) setStep(step + 1);
                  else setStep(5); // Go to loading construction
                }}
              >
                {step === 4 ? "Construct My Twin →" : "Next Calibration Step"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Construction Loader Step 5 */}
      {step === 5 && (
        <div style={{ width: "100%", maxWidth: 600, position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Custom pulsating core */}
          <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 36px" }}>
            <div style={{
              position: "absolute", inset: -20, borderRadius: "50%",
              border: "1px solid rgba(59, 130, 246, 0.4)",
              animation: "ringPulse2 2s ease-in-out infinite"
            }} />
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #3b82f6 0%, #050e1e 80%)",
              border: "1.5px solid rgba(59, 130, 246, 0.6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 40px rgba(59, 130, 246, 0.5)"
            }}>
              <Brain size={42} className="spin" color="#fff" style={{ animationDuration: "10s" }} />
            </div>
          </div>

          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 12 }}>
            SYNTRA INITIALIZING
          </h2>
          <p style={{ fontSize: "0.86rem", color: "rgba(255,255,255,0.4)", marginBottom: 28 }}>
            Configuring behavioral layers and computing timeline projections...
          </p>

          <div className="terminal-box">
            {terminalLines.map((line, i) => (
              <div key={i} style={{ color: line.startsWith("syn") ? "#60a5fa" : line.includes("✓") ? "#10b981" : "#94a3b8", marginBottom: 6 }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Twin Activation Report Step 6 */}
      {step === 6 && (() => {
        // Dynamic Model Completion percentages based on inputs
        const sleepVal = parseFloat(averageSleep) || 7.0;
        const workoutsVal = parseFloat(workoutFrequency) || 3;
        const anatomicalCompletion = Math.min(98, Math.round(80 + (sleepVal >= 7.5 ? 10 : sleepVal >= 6.5 ? 5 : 0) + (workoutsVal >= 4 ? 8 : workoutsVal >= 2 ? 4 : 0)));

        const savingsVal = parseFloat(currentSavings) || 0;
        const financialCompletion = Math.min(98, Math.round(75 + (incomeVal > 0 ? 10 : 0) + (savingsVal >= 25000 ? 10 : savingsVal > 5000 ? 5 : 0)));

        const studyVal = parseFloat(hoursStudied) || 3;
        const focusVal = parseFloat(focusRating) || 7;
        const behavioralCompletion = Math.min(98, Math.round(78 + (studyVal >= 5 ? 12 : studyVal >= 3 ? 6 : 0) + (focusVal >= 8 ? 8 : focusVal >= 6 ? 4 : 0)));

        const twinSyncCompletion = Math.round((anatomicalCompletion + financialCompletion + behavioralCompletion) / 3);

        // Dynamic Diagnosis Calculations
        let primaryBottleneck = "Multi-domain Synergy";
        let bottleneckExplanation = "Balanced individual vectors; optimization requires tight cross-domain correlation.";
        if (sleepVal < 7.0) {
          primaryBottleneck = "Sleep Consistency";
          bottleneckExplanation = "Your sleep average is bottlenecking daily cognitive durability and neural focus depth.";
        } else if (workoutsVal < 3) {
          primaryBottleneck = "Physical Activity Base";
          bottleneckExplanation = "Low workout cycles restrict vascular recovery and active energy baseline.";
        } else if (computedSavingsRatePct < 15) {
          primaryBottleneck = "Capital Runway Buffer";
          bottleneckExplanation = "Discretionary spend patterns are compressing long-term wealth cushion.";
        } else if (studyVal < 4) {
          primaryBottleneck = "Focused Learning Inputs";
          bottleneckExplanation = "Daily skill acquisition hours are below the speed of career breakthrough.";
        } else if (focusVal < 7) {
          primaryBottleneck = "Cognitive Focus Depth";
          bottleneckExplanation = "High distraction rate degrades focus, causing longer project build cycles.";
        }

        let growthLever = "Asymmetric Focus Blocks";
        let leverExplanation = "Deploy early-morning hyper-focus sessions for deep learning.";
        if (studyVal < 5) {
          growthLever = "Focused Learning Hours";
          leverExplanation = "Upgrading daily dedicated blocks to 5h+ creates high career velocity.";
        } else if (sleepVal < 7.6) {
          growthLever = "Sleep & Recovery Cycles";
          leverExplanation = "Extending average sleep to 7.8 hours will boost daily focus index by 15%.";
        } else if (computedSavingsRatePct < 25) {
          growthLever = "Savings Rate Optimization";
          leverExplanation = "Reallocating 15% of discretionary spend to active SIPs builds stable cushion.";
        }

        let projectedOutcome = "Stable career and life progression with structured multi-domain velocity.";
        if (archetype === "founder") {
          projectedOutcome = "High-stakes venture launch velocity with intensive output within 3-5 months.";
        } else if (archetype === "scholar") {
          projectedOutcome = "Significant skill acquisition & premium internship/job readiness in 4-6 months.";
        } else if (archetype === "architect") {
          projectedOutcome = "Absolute financial cushion with over 12-month savings runway by month 9.";
        } else if (archetype === "operator") {
          projectedOutcome = "Hyper-consistent execution velocity and daily habit tracking mastery in 60 days.";
        } else if (archetype === "titan") {
          projectedOutcome = "Symmetric energy peaks and optimized cognitive durability across all vectors.";
        }

        return (
          <div className="ob-container" style={{ maxWidth: 640 }}>
            <div style={{ padding: 36, textAlign: "center" }}>
              
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 9999, padding: "5px 14px", marginBottom: 24 }}>
                <Sparkles size={12} color="#10b981" />
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.1em" }}>Avatar Fully Synchronized</span>
              </div>

              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "2rem", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.03em" }}>Twin Activation Report</h2>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginBottom: 36, maxWidth: 440, marginInline: "auto" }}>
                Syntra has calibrated your baseline potentials across all active domains.
              </p>

              {/* Dynamic Progress Bars */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36, textAlign: "left" }}>
                {[
                  { label: "ANATOMICAL MODEL", value: anatomicalCompletion, color: "#ef4444" },
                  { label: "FINANCIAL MODEL", value: financialCompletion, color: "#10b981" },
                  { label: "BEHAVIORAL MODEL", value: behavioralCompletion, color: "#3b82f6" },
                  { label: "DIGITAL TWIN SYNCHRONIZATION", value: twinSyncCompletion, color: "#8b5cf6" },
                ].map((model) => (
                  <div key={model.label} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>{model.label}</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 800, color: model.color }}>{model.value}% Complete</span>
                    </div>
                    <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden", position: "relative" }}>
                      <div style={{
                        height: "100%",
                        width: `${model.value}%`,
                        background: model.color,
                        borderRadius: 999,
                        boxShadow: `0 0 10px ${model.color}`,
                        transition: "width 1s ease-out"
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Telemetry Diagnostic Console */}
              <div style={{
                background: "rgba(4, 10, 22, 0.9)",
                border: "1px dashed rgba(59, 130, 246, 0.25)",
                borderRadius: 16,
                padding: 24,
                textAlign: "left",
                marginBottom: 36,
                display: "flex",
                flexDirection: "column",
                gap: 18
              }}>
                <div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                    ⚠️ Primary Bottleneck
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#fff", marginBottom: 2 }}>
                    {primaryBottleneck}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>
                    {bottleneckExplanation}
                  </div>
                </div>
                
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14 }}>
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                    📈 Highest Growth Lever
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#fff", marginBottom: 2 }}>
                    {growthLever}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>
                    {leverExplanation}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14 }}>
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                    🔮 Projected Outcome
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#e2e8f0", fontWeight: 600, lineHeight: 1.4 }}>
                    {projectedOutcome}
                  </div>
                </div>
              </div>

              {/* Twin's first observation — no decimal sync number */}
              <div role="status" style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: "18px 20px",
                marginBottom: 24,
                textAlign: "left",
              }}>
                <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                  Your twin&apos;s first observation
                </div>
                <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>
                  {getTwinFirstObservation(
                    parseFloat(averageSleep) || 7,
                    parseFloat(hoursStudied) || 0,
                    archetype === "architect" ? "finance" : archetype === "titan" ? "health" : "career",
                    daysStudiedLastWeek
                  )}
                </p>
                <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)", marginTop: 8, marginBottom: 0 }}>
                  Your score will sharpen as you log. Don&apos;t anchor on today&apos;s number.
                </p>
              </div>

              <button className="ob-btn ob-btn-primary" onClick={() => setStep(7)} style={{ width: "100%", padding: "16px 28px", borderRadius: 12 }}>
                Project 12-Month Twin Simulation →
              </button>

            </div>
          </div>
        );
      })()}

      {/* Step 7: Current Self vs Predicted 12-Month Self Comparative Card */}
      {step === 7 && (
        <div className="ob-container" style={{ maxWidth: 680 }}>
          <div style={{ padding: 36 }}>
            
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Brain size={18} color="#8b5cf6" />
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.1em" }}>Predictive Trajectory Model</span>
            </div>

            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.03em" }}>
              Current Self vs Predicted Self
            </h2>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginBottom: 32, lineHeight: 1.5 }}>
              Compare your current state side-by-side with your simulated 12-Month trajectory powered by Syntra’s neural focus algorithms.
            </p>

            {/* Error banner */}
            {error && (
              <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)", color: "#fca5a5", borderRadius: 12, padding: "12px 16px", fontSize: "0.82rem", marginBottom: 20 }}>
                {error}
              </div>
            )}

            {/* Comparative grid layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 36 }}>
              {/* Current Self */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 18, padding: 24 }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 18 }}>
                  Current Profile
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>{averageSleep}h</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Daily Sleep Average</div>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14 }}>
                    <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>₹{(savingsVal / 1000).toFixed(1)}k</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Starting Net Cushion</div>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14 }}>
                    <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>{hoursStudied}h/day</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Dedicated Study Hours</div>
                  </div>
                </div>
              </div>

              {/* Predicted Self */}
              <div style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 18, padding: 24, boxShadow: "0 8px 36px rgba(59, 130, 246, 0.15)" }}>
                <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Predicted (12 Months)
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 4, padding: "2px 6px", fontSize: "0.62rem", color: "#10b981", fontWeight: 700 }}>
                    <TrendingUp size={10} /> Shifted
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#60a5fa", lineHeight: 1.1 }}>7.4h</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Target Sleep Average</div>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
                    <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#10b981", lineHeight: 1.1 }}>
                      ₹{(Math.max(savingsVal * 2.5, computedProjectedSavings) / 1000).toFixed(1)}k
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Projected Savings Runway</div>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
                    <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#8b5cf6", lineHeight: 1.1 }}>
                      {(parseFloat(hoursStudied) * 1.5).toFixed(1)}h/day
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Projected Focus Target</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom rating metadata info */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Award size={14} color="#8b5cf6" />
                <span style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>Predictive Twin Confidence Rating</span>
              </div>
              <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#8b5cf6" }}>82%</span>
            </div>

            <button className="ob-btn ob-btn-primary" onClick={() => setStep(8)} style={{ width: "100%", padding: "16px 28px" }}>
              <ArrowRight size={16} /> Project 12-Month Synthesis & Calibrate Constraint Engine
            </button>

          </div>
        </div>
      )}

      {/* Step 8: Cross-Domain constraint Synthesis ("Why Syntra Exists") */}
      {step === 8 && (() => {
        const sleepValue = parseFloat(averageSleep) || 7.0;
        const studyValue = parseFloat(hoursStudied) || 3;
        
        // Dynamic cross-domain detection bullets
        const careerTrajectoryBullet = studyValue >= 6 ? "Strong career trajectory" : studyValue >= 3 ? "Moderate career velocity" : "Restricted career momentum";
        const recoveryBullet = sleepValue >= 7.5 ? "Optimal recovery patterns" : sleepValue >= 6.0 ? "Vulnerable recovery patterns" : "Weak recovery patterns";
        const financeBullet = computedSavingsRatePct >= 30 ? "High-surplus financial behavior" : computedSavingsRatePct >= 15 ? "Stable financial behavior" : "Fragile financial runway";

        let mainConstraint = "health recovery";
        if (sleepValue < 7.0 || parseFloat(workoutFrequency) < 2) {
          mainConstraint = "health recovery";
        } else if (computedSavingsRatePct < 15) {
          mainConstraint = "financial runway and savings growth";
        } else {
          mainConstraint = "execution volume and focus consistency";
        }

        return (
          <div className="ob-container" style={{ maxWidth: 660 }}>
            <div style={{ padding: 36, textAlign: "center" }}>
              
              {/* Pulsing Neural Graphic */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 32, marginBottom: 32, position: "relative" }}>
                <div style={{
                  position: "absolute",
                  width: 140,
                  height: 1,
                  borderTop: "2px dashed rgba(59, 130, 246, 0.3)",
                  zIndex: 0
                }} />
                
                {/* Health Node */}
                <div className="network-circle" style={{
                  width: 60, height: 60, borderRadius: "50%",
                  background: "linear-gradient(135deg, #1f0b0b 0%, #3d1414 100%)",
                  border: "2px solid #ef4444",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: 1,
                  animation: "networkPulse 3s ease-in-out infinite"
                }}>
                  <HeartPulse size={24} color="#ef4444" />
                </div>

                {/* Career Node */}
                <div className="network-circle" style={{
                  width: 76, height: 76, borderRadius: "50%",
                  background: "linear-gradient(135deg, #0b162f 0%, #142858 100%)",
                  border: "2px solid #3b82f6",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: 1,
                  animation: "networkPulse 3s ease-in-out infinite 1s"
                }}>
                  <Brain size={32} color="#60a5fa" />
                </div>

                {/* Finance Node */}
                <div className="network-circle" style={{
                  width: 60, height: 60, borderRadius: "50%",
                  background: "linear-gradient(135deg, #091f14 0%, #103c27 100%)",
                  border: "2px solid #10b981",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: 1,
                  animation: "networkPulse 3s ease-in-out infinite 2s"
                }}>
                  <Wallet size={24} color="#10b981" />
                </div>
              </div>

              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 9999, padding: "5px 14px", marginBottom: 16 }}>
                <Cpu size={12} color="#60a5fa" />
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em" }}>Constraint Model Calibrated</span>
              </div>

              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.9rem", fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.03em" }}>
                Why Syntra Exists
              </h2>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginBottom: 28, maxWidth: 460, marginInline: "auto", lineHeight: 1.5 }}>
                Your digital twin has analyzed the cross-domain pathways connecting your lifestyle, capital runway, and focus metrics.
              </p>

              {/* Neural Detections Box */}
              <div style={{
                background: "rgba(4, 10, 22, 0.8)",
                border: "1px solid rgba(59, 130, 246, 0.15)",
                borderRadius: 18,
                padding: 24,
                textAlign: "left",
                marginBottom: 32,
                display: "flex",
                flexDirection: "column",
                gap: 14
              }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>
                  SYNERGISTIC CORRELATIONS DETECTED:
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#e2e8f0", fontSize: "0.86rem" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />
                  <span>• {careerTrajectoryBullet}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#e2e8f0", fontSize: "0.86rem" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} />
                  <span>• {recoveryBullet}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#e2e8f0", fontSize: "0.86rem" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                  <span>• {financeBullet}</span>
                </div>

                <div style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  paddingTop: 16,
                  marginTop: 6,
                  fontSize: "1.02rem",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.4
                }}>
                  The next 12 months are primarily constrained by <span style={{ color: "#f59e0b", borderBottom: "1.5px solid rgba(245, 158, 11, 0.4)", paddingBottom: 1 }}>{mainConstraint}</span>.
                </div>
              </div>

              {/* Core Philosophy Callout */}
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, maxWidth: 500, marginInline: "auto", marginBottom: 36, fontStyle: "italic" }}>
                "Syntra does not look at your life in silos. Your financial capacity limits your stress threshold, your sleep governs your learning velocity, and your career velocity funds your runway. Your twin synthesizes these inputs into a single, unified daily directive."
              </p>

              {/* Final Action Button */}
              {error && (
                <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)", color: "#fca5a5", borderRadius: 12, padding: "12px 16px", fontSize: "0.82rem", marginBottom: 20 }}>
                  {error}
                </div>
              )}

              <button className="ob-btn ob-btn-primary" onClick={finalizeOnboarding} disabled={loading} style={{ width: "100%", padding: "16px 28px", borderRadius: 14 }}>
                {loading ? (
                  <>
                    <Cpu size={16} className="spin" />
                    Activating Synergistic Core Engine...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} /> Activate Synergistic Control Engine & Enter Dashboard
                  </>
                )}
              </button>

            </div>
          </div>
        );
      })()}

      {/* Immersive Futuristic Fullscreen Neural Core Construction WOW Transition */}
      {showConstructionWow && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "radial-gradient(circle at center, #020813 0%, #01040a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}>
          {/* Grid scanning effect */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(0,102,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.02) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none"
          }} />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 60%)",
            pointerEvents: "none"
          }} />

          {/* Central Core Sphere */}
          <div style={{ position: "relative", width: 140, height: 140, marginBottom: 48 }}>
            <div className="wow-pulse-ring" style={{
              position: "absolute",
              inset: -15,
              borderRadius: "50%",
              border: "2.5px solid rgba(59, 130, 246, 0.35)",
              animation: "wowPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite"
            }} />
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 50px rgba(139, 92, 246, 0.5)",
              animation: "wowSpin 12s linear infinite"
            }}>
              <Cpu size={56} style={{ color: "#fff" }} />
            </div>
          </div>

          {/* Title */}
          <div style={{ textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.22em", color: "#60a5fa", fontWeight: 800, marginBottom: 12 }}>
            Neural Construction Mode
          </div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "2.1rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 36, textAlign: "center" }}>
            Synthesizing Digital Twin...
          </h2>

          {/* Sequential Interactive Stage Checklist */}
          <div style={{
            background: "rgba(8, 17, 36, 0.8)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            borderRadius: "20px",
            padding: "30px 40px",
            width: "100%",
            maxWidth: "520px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            textAlign: "left",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)"
          }}>
            {[
              { label: "Initializing Digital Twin Core Sync", stepIdx: 0 },
              { label: "Building Anatomical Model & Metabolic Core", stepIdx: 1 },
              { label: "Building Behavioral Model & Consistency Matrix", stepIdx: 2 },
              { label: "Building Financial Model & Capital Runway", stepIdx: 3 },
              { label: "Calibrating 12-Month Trajectory Projection", stepIdx: 4 },
              { label: `Final Handshake: Core Sync ${potentials.syncPercentage}% [${
                (parseFloat(averageSleep) || 7) < 6.5 ? "RECOVERY MODE" : (parseFloat(workoutFrequency) || 3) >= 4 && (parseFloat(focusRating) || 7) >= 7 && daysStudiedLastWeek >= 5 ? "ACCELERATING" : "STABLE"
              }]`, stepIdx: 5 },
              { label: "Digital Twin Activated", stepIdx: 6 }
            ].map((wow, index) => {
              const isDone = currentWowStep > wow.stepIdx;
              const isActive = currentWowStep === wow.stepIdx;
              const isPending = currentWowStep < wow.stepIdx;
              
              let statusText = "Pending";
              let statusColor = "rgba(255,255,255,0.2)";
              if (isDone) {
                statusText = "✓ Done";
                statusColor = "#10b981";
              } else if (isActive) {
                statusText = "Syncing...";
                statusColor = "#3b82f6";
              }

              return (
                <div key={index} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  opacity: isPending ? 0.35 : 1,
                  transition: "all 0.3s ease"
                }}>
                  <span style={{
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: isDone ? "#fff" : isActive ? "#60a5fa" : "rgba(255,255,255,0.6)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: isDone ? "#10b981" : isActive ? "#3b82f6" : "rgba(255,255,255,0.3)",
                      boxShadow: isActive ? "0 0 10px #3b82f6" : "none"
                    }} />
                    {wow.label}
                  </span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: statusColor,
                    textTransform: "uppercase"
                  }}>
                    {wow.stepIdx === 6 && isActive ? "Activating..." : statusText}
                  </span>
                </div>
              );
            })}
          </div>

          <style>{`
            @keyframes wowPing {
              75%, 100% { transform: scale(1.5); opacity: 0; }
            }
            @keyframes wowSpin {
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}