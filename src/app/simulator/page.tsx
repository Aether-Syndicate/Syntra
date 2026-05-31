"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  HeartPulse,
  Loader2,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  BrainCircuit,
  Zap,
  Cpu,
  ArrowLeft,
  BarChart3,
  FlaskConical,
  SlidersHorizontal,
  Atom,
  Clock,
  ChevronRight,
  TrendingDown,
  BookOpen,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Domain = "health" | "finance" | "career";
type RiskLevel = "low" | "medium" | "high" | "critical";

type TradeOff = {
  domain: Domain;
  impact: "positive" | "negative" | "neutral";
  magnitude: number;
  explanation: string;
};

type TimelinePoint = {
  week: string;
  projection: string;
};

type AIAnalysis = {
  scenarioTitle: string;
  primaryOutcome: string;
  tradeOffs: TradeOff[];
  timelineProjection: TimelinePoint[];
  riskLevel: RiskLevel;
  recommendedPath: string;
  confidence: number;
};

type SimulationResponse = {
  success: boolean;
  simulation: any;
  aiAnalysis: AIAnalysis;
};

const TYPEWRITER_PHRASES = [
  "What-If Simulator",
  "Predictive Engine",
  "Outcome Modeler",
  "Scenario Intelligence",
];

const NAV_LINKS = [
  { href: "/dashboard", label: "Twin OS" },
  { href: "/ingestion", label: "Calibrate Logs" },
  { href: "/goals", label: "Milestones" },
  { href: "/simulator", label: "Predictive Simulator" },
  { href: "/insights", label: "Twin Insights" },
  { href: "/profile", label: "Neural Identity" },
];

/* ─── Animated counter ─── */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 900;
    const step = 16;
    const increment = (end - start) / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.round(start));
    }, step);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}{suffix}</>;
}

export default function SimulatorPage() {
  const [mounted, setMounted] = useState(false);
  const [typedTitle, setTypedTitle] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const [domain, setDomain] = useState<Domain>("career");
  const [activeVariable, setActiveVariable] = useState<string>("study_hours");

  const [baselines, setBaselines] = useState<any>(null);
  const [userScores, setUserScores] = useState({ health: 60, finance: 60, career: 60 });
  const [baselinesLoading, setBaselinesLoading] = useState(true);

  // Simulation slider states
  const [sleepHoursSim, setSleepHoursSim] = useState(7.5);
  const [workoutFrequencySim, setWorkoutFrequencySim] = useState(3);
  const [studyHoursSim, setStudyHoursSim] = useState(4);
  const [focusRatingSim, setFocusRatingSim] = useState(7);
  const [savingsRateSim, setSavingsRateSim] = useState(20);
  const [spendingIntensitySim, setSpendingIntensitySim] = useState(3);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<SimulationResponse | null>(null);

  // Suggested Upgrade Checklist Actions state
  const [completedActions, setCompletedActions] = useState<string[]>([]);

  // Fetch actual user baselines
  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    fetch("/api/simulate", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.baselines) {
          setBaselines(data.baselines);
          setUserScores(data.scores);

          // Initialize slider states from actual user baselines
          setSleepHoursSim(data.baselines.sleep_hours || 7.5);
          setWorkoutFrequencySim(data.baselines.workout_frequency || 3);
          setStudyHoursSim(data.baselines.study_hours || 4);
          setFocusRatingSim(data.baselines.focus_rating || 7);
          setSavingsRateSim(data.baselines.savings_rate || 20);
          setSpendingIntensitySim(3); // Moderate default
        }
      })
      .catch(err => console.error("Failed to load baselines:", err))
      .finally(() => setBaselinesLoading(false));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute percentageChange dynamically based on sliders
  const percentageChange = useMemo(() => {
    let current = 1;
    let simulated = 1;
    if (domain === "health") {
      if (activeVariable === "sleep_hours") {
        current = baselines?.sleep_hours || 7.5;
        simulated = sleepHoursSim;
      } else {
        current = baselines?.workout_frequency || 3;
        simulated = workoutFrequencySim;
      }
    } else if (domain === "finance") {
      if (activeVariable === "savings_rate") {
        current = baselines?.savings_rate || 20;
        simulated = savingsRateSim;
      } else {
        current = 3;
        simulated = spendingIntensitySim;
      }
    } else if (domain === "career") {
      if (activeVariable === "study_hours") {
        current = baselines?.study_hours || 4;
        simulated = studyHoursSim;
      } else {
        current = baselines?.focus_rating || 7;
        simulated = focusRatingSim;
      }
    }
    return current !== 0 ? Math.round(((simulated - current) / current) * 100) : 0;
  }, [domain, activeVariable, baselines, sleepHoursSim, workoutFrequencySim, savingsRateSim, spendingIntensitySim, studyHoursSim, focusRatingSim]);

  // Dynamic Real-time "System Impact" HUD computation
  const systemImpactHUD = useMemo(() => {
    const multiplier = percentageChange >= 0 ? -1 : 1;
    const absChange = Math.abs(percentageChange);

    // 1% shift results in 0.05 months change (e.g. 30% shift is 1.5 months)
    const monthShift = parseFloat((absChange * 0.05).toFixed(1));
    const isBenefit = multiplier < 0;

    let goalLabel = "Milestone Trajectory Baseline";
    if (domain === "finance") {
      goalLabel = "Mahindra Thar Downpayment Goal";
    } else if (domain === "career") {
      goalLabel = "LeetCode Knight / Career Milestone";
    } else if (domain === "health") {
      goalLabel = "Sleep Consistency & Vitals Recovery";
    }

    return {
      goalLabel,
      monthShift: monthShift === 0 ? "0.0" : `${isBenefit ? "−" : "+"}${monthShift}`,
      text: isBenefit
        ? `Accelerating target milestone by ${monthShift} month${monthShift !== 1 ? "s" : ""}`
        : `Delaying target milestone by ${monthShift} month${monthShift !== 1 ? "s" : ""}`,
      isBenefit
    };
  }, [domain, percentageChange]);

  useEffect(() => {
    if (!mounted) return;
    let idx = 0, isDeleting = false;
    let tid: NodeJS.Timeout;
    const phrase = TYPEWRITER_PHRASES[phraseIndex];
    const tick = () => {
      if (!isDeleting) {
        setTypedTitle(phrase.substring(0, idx + 1));
        idx++;
        if (idx === phrase.length) { isDeleting = true; tid = setTimeout(tick, 2800); }
        else tid = setTimeout(tick, 100);
      } else {
        setTypedTitle(phrase.substring(0, idx - 1));
        idx--;
        if (idx === 0) { isDeleting = false; setPhraseIndex(p => (p + 1) % TYPEWRITER_PHRASES.length); }
        else tid = setTimeout(tick, 45);
      }
    };
    tid = setTimeout(tick, 200);
    return () => clearTimeout(tid);
  }, [mounted, phraseIndex]);

  const handleDomainChange = (newDomain: Domain) => {
    setDomain(newDomain);
    setActiveStep(1);
    if (newDomain === "health") {
      setActiveVariable("sleep_hours");
    } else if (newDomain === "finance") {
      setActiveVariable("savings_rate");
    } else if (newDomain === "career") {
      setActiveVariable("study_hours");
    }
  };

  const runSimulation = async () => {
    setActiveStep(2);
    try {
      setLoading(true);
      setMessage("");

      let currentVal = 1;
      let simulatedVal = 1;

      if (domain === "health") {
        if (activeVariable === "sleep_hours") {
          currentVal = baselines?.sleep_hours || 7.5;
          simulatedVal = sleepHoursSim;
        } else {
          currentVal = baselines?.workout_frequency || 3;
          simulatedVal = workoutFrequencySim;
        }
      } else if (domain === "finance") {
        if (activeVariable === "savings_rate") {
          currentVal = baselines?.savings_rate || 20;
          simulatedVal = savingsRateSim;
        } else {
          currentVal = baselines?.monthly_budget || 40000;
          simulatedVal = Math.round(currentVal * (spendingIntensitySim / 3));
        }
      } else if (domain === "career") {
        if (activeVariable === "study_hours") {
          currentVal = baselines?.study_hours || 4;
          simulatedVal = studyHoursSim;
        } else {
          currentVal = baselines?.focus_rating || 7;
          simulatedVal = focusRatingSim;
        }
      }

      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          scenario: {
            domain,
            variable: activeVariable,
            currentValue: currentVal,
            simulatedValue: simulatedVal
          }
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
        setActiveStep(3);
        // Reset dynamic checklist items
        setCompletedActions([]);
      } else {
        setMessage(data.error || "Simulation failed.");
      }
    } catch {
      setMessage("Twin simulation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    const bh = userScores.health;
    const bf = userScores.finance;
    const bc = userScores.career;
    const m = percentageChange;
    return [
      { month: "Current", health: bh, finance: bf, career: bc },
      { month: "Month 1", health: domain === "health" ? Math.min(100, Math.round(bh + m * 0.15)) : Math.max(0, Math.round(bh - m * 0.04)), finance: domain === "finance" ? Math.min(100, Math.round(bf + m * 0.15)) : Math.max(0, Math.round(bf - m * 0.02)), career: domain === "career" ? Math.min(100, Math.round(bc + m * 0.18)) : Math.max(0, Math.round(bc - m * 0.03)) },
      { month: "Month 2", health: domain === "health" ? Math.min(100, Math.round(bh + m * 0.28)) : Math.max(0, Math.round(bh - Math.round(m * 0.06))), finance: domain === "finance" ? Math.min(100, Math.round(bf + m * 0.28)) : Math.max(0, Math.round(bf - Math.round(m * 0.04))), career: domain === "career" ? Math.min(100, Math.round(bc + m * 0.32)) : Math.max(0, Math.round(bc - Math.round(m * 0.05))) },
      { month: "Month 3", health: domain === "health" ? Math.min(100, Math.round(bh + m * 0.42)) : Math.max(0, Math.round(bh - Math.round(m * 0.08))), finance: domain === "finance" ? Math.min(100, Math.round(bf + m * 0.40)) : Math.max(0, Math.round(bf - Math.round(m * 0.06))), career: domain === "career" ? Math.min(100, Math.round(bc + m * 0.48)) : Math.max(0, Math.round(bc - Math.round(m * 0.07))) },
      { month: "Month 4", health: domain === "health" ? Math.min(100, Math.round(bh + m * 0.55)) : Math.max(0, Math.round(bh - Math.round(m * 0.10))), finance: domain === "finance" ? Math.min(100, Math.round(bf + m * 0.52)) : Math.max(0, Math.round(bf - Math.round(m * 0.07))), career: domain === "career" ? Math.min(100, Math.round(bc + m * 0.62)) : Math.max(0, Math.round(bc - Math.round(m * 0.08))) },
      { month: "Month 5", health: domain === "health" ? Math.min(100, Math.round(bh + m * 0.72)) : Math.max(0, Math.round(bh - Math.round(m * 0.11))), finance: domain === "finance" ? Math.min(100, Math.round(bf + m * 0.68)) : Math.max(0, Math.round(bf - Math.round(m * 0.08))), career: domain === "career" ? Math.min(100, Math.round(bc + m * 0.78)) : Math.max(0, Math.round(bc - Math.round(m * 0.09))) },
      { month: "Month 6", health: domain === "health" ? Math.min(100, Math.round(bh + m * 0.90)) : Math.max(0, Math.round(bh - Math.round(m * 0.12))), finance: domain === "finance" ? Math.min(100, Math.round(bf + m * 0.85)) : Math.max(0, Math.round(bf - Math.round(m * 0.09))), career: domain === "career" ? Math.min(100, Math.round(bc + m * 0.95)) : Math.max(0, Math.round(bc - Math.round(m * 0.10))) },
    ];
  }, [domain, percentageChange, userScores]);

  const riskConfig = {
    low: { bg: "#eef2ff", color: "#2563eb", border: "rgba(37,99,235,0.2)", label: "Low Risk" },
    medium: { bg: "#fffbeb", color: "#b45309", border: "#fde68a", label: "Medium Risk" },
    high: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", label: "High Risk" },
    critical: { bg: "#fef2f2", color: "#7f1d1d", border: "#fca5a5", label: "Critical Risk" },
  } as const;

  const domainStyles = {
    health: { color: "#ef4444", bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.18)" },
    finance: { color: "#10b981", bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.18)" },
    career: { color: "#2563eb", bg: "rgba(37,99,235,0.06)", border: "rgba(37,99,235,0.18)" },
  };

  const dynamicChecklist = useMemo(() => {
    if (!result?.aiAnalysis?.recommendedPath) return [];

    // Generate actionable items dynamically from Gemini recommendation text
    const rec = result.aiAnalysis.recommendedPath;
    const items = [];
    if (rec.toLowerCase().includes("sleep")) {
      items.push("Enforce a strict sleep floor of 6.5h+ daily.");
    }
    if (rec.toLowerCase().includes("meal") || rec.toLowerCase().includes("food") || rec.toLowerCase().includes("zomato")) {
      items.push("Meal-prep over weekends to prevent convenience spend.");
    }
    if (rec.toLowerCase().includes("study") || rec.toLowerCase().includes("focus")) {
      items.push("Schedule early morning hyper-focus sessions.");
    }
    if (rec.toLowerCase().includes("budget") || rec.toLowerCase().includes("savings")) {
      items.push("Reallocate 15% discretionary capital to active SIPs.");
    }
    items.push("Deploy daily accountability checks with digital twin.");
    return items;
  }, [result]);

  const toggleChecklistAction = (item: string) => {
    setCompletedActions(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  if (!mounted) return null;

  return (
    <div className="twin-os-theme">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');

        :root {
          --primary: #2563eb;
          --primary-glow: rgba(37, 99, 235, 0.15);
          --accent: #8b5cf6;
          --accent-glow: rgba(139, 92, 246, 0.12);
          --text-main: #0f172a;
          --text-sub: #475569;
          --bg-light: #f8fafc;
          --card-bg: rgba(255, 255, 255, 0.85);
          --border: rgba(0, 85, 238, 0.08);
          --warning: #ef4444;
          --warning-glow: rgba(239, 68, 68, 0.12);
          --success: #10b981;
          --success-glow: rgba(16, 185, 129, 0.12);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background-color: var(--bg-light);
          color: var(--text-main);
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        .twin-os-theme {
          background: radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 40%),
                      radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.04) 0%, transparent 40%);
          min-height: 100vh;
          padding-bottom: 80px;
        }

        /* ── HEADER ── */
        .nav-wrapper {
          position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }
        .nav-wrapper.scrolled {
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
        }
        .nav-container {
          max-width: 1200px; margin: 0 auto;
          display: flex; justify-content: space-between; align-items: center;
          height: 70px; padding: 0 2rem;
        }
        .logo {
          font-family: 'Sora', sans-serif; font-size: 1.45rem; font-weight: 400;
          color: var(--primary); text-decoration: none;
          letter-spacing: 0.15em; text-transform: uppercase;
        }
        .logo strong {
          font-weight: 800; letter-spacing: 0.05em;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .nav-links-desktop { display: flex; align-items: center; gap: 4px; }
        .nav-link-item {
          font-size: 0.82rem; font-weight: 600; color: var(--text-sub);
          text-decoration: none; padding: 8px 16px; border-radius: 9999px;
          transition: all 0.25s; letter-spacing: 0.01em;
        }
        .nav-link-item:hover { color: var(--primary); background: rgba(37, 99, 235, 0.05); }
        .nav-link-active {
          background: var(--primary) !important; color: #fff !important;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
        }

        /* ── LAYOUT CONTENT ── */
        .sim-content-wrapper {
          max-width: 1200px; margin: 0 auto; padding: 110px 2rem 0;
          display: flex; flex-direction: column; gap: 32px;
        }

        .title-section {
          max-width: 780px;
        }
        .title-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--primary-glow); border: 1.5px solid rgba(37,99,235,0.08);
          border-radius: 999px; padding: 5px 14px; margin-bottom: 14px;
        }
        .page-title {
          font-family: 'Sora', sans-serif; font-size: clamp(1.8rem, 3.8vw, 2.3rem);
          font-weight: 800; color: var(--text-main); letter-spacing: -0.04em;
          display: flex; align-items: center; gap: 4px;
        }
        .title-cursor {
          display: inline-block; width: 3px; height: 1em; background: var(--primary);
          margin-left: 4px; animation: blink 0.7s infinite; border-radius: 2px;
        }
        @keyframes blink { 50% { opacity: 0; } }
        .page-sub { font-size: 0.92rem; color: var(--text-sub); line-height: 1.7; margin-top: 10px; }

        /* ── Grid System ── */
        .sim-grid { display: grid; grid-template-columns: 1.25fr 1fr; gap: 30px; }
        @media (max-width: 1100px) { .sim-grid { grid-template-columns: 1fr; } }

        /* ── Premium Cards ── */
        .sim-card {
          background: var(--card-bg); border-radius: 24px; border: 1.5px solid var(--border);
          overflow: hidden; box-shadow: 0 4px 30px rgba(0, 85, 238, 0.015);
          position: relative; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sim-card:hover {
          transform: translateY(-2px);
          border-color: rgba(37,99,235,0.12);
          box-shadow: 0 12px 40px rgba(37,99,235,0.05);
        }
        .card-inner { padding: 28px; }

        /* ── Card Header ── */
        .ch { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .ch-left { display: flex; align-items: center; gap: 12px; }
        .ch-icon {
          width: 44px; height: 44px; border-radius: 14px; display: flex;
          align-items: center; justify-content: center; flex-shrink: 0;
          background: rgba(37,99,235,0.06); color: var(--primary);
        }
        .ch-title { font-family: 'Sora', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--text-main); }
        .ch-sub { font-size: 0.68rem; color: var(--text-sub); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }

        /* ── Dropdowns ── */
        .sim-select {
          width: 100%; padding: 11px 16px; border-radius: 12px;
          border: 1.5px solid var(--border); background: #fff;
          color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.88rem; appearance: none; cursor: pointer; transition: all 0.2s;
          height: 44px;
        }
        .sim-select:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-glow); }
        .field-row-3 { display: grid; grid-template-columns: 2.2fr 1fr; gap: 14px; align-items: end; margin-bottom: 24px; }

        /* ── Sliders ── */
        .sim-slider {
          -webkit-appearance: none; appearance: none; width: 100%; height: 6px;
          border-radius: 999px; background: rgba(15,23,42,0.06); outline: none;
          cursor: pointer; position: relative; margin: 0;
        }
        .sim-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%;
          background: #ffffff; cursor: pointer; border: 3px solid currentColor;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15); transition: transform 0.15s;
        }
        .sim-slider::-webkit-slider-thumb:hover { transform: scale(1.22); }
        .sim-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #ffffff; cursor: pointer; border: 3px solid currentColor; }

        /* ── Active variable highlight ── */
        .variable-card {
          border-radius: 16px; padding: 16px; transition: all 0.25s ease;
          border: 1.5px solid transparent; background: rgba(15, 23, 42, 0.015);
        }
        .variable-card.active-health { background: rgba(239, 68, 68, 0.025); border-color: rgba(239, 68, 68, 0.1); }
        .variable-card.active-finance { background: rgba(16, 185, 129, 0.025); border-color: rgba(16, 185, 129, 0.1); }
        .variable-card.active-career { background: rgba(37, 99, 235, 0.025); border-color: rgba(37, 99, 235, 0.1); }

        /* ── Quick presets ── */
        .qp-grid { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
        .qp-btn {
          display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 14px;
          cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.86rem; font-weight: 700;
          border: 1.5px solid; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); width: 100%; text-align: left;
        }
        .qp-btn:hover { transform: translateX(4px); }

        /* ── Primary Button ── */
        .pri-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 12px 24px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.88rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 18px rgba(37, 99, 235, 0.3);
          white-space: nowrap; height: 44px; width: 100%;
        }
        .pri-btn:hover:not(:disabled) { filter: brightness(1.06); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4); }
        .pri-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

        /* ── Glassmorphic COMMAND HUD Readout ── */
        .command-hud-card {
          margin-top: 24px; padding: 18px 22px; border-radius: 18px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(8px);
          border: 1.5px solid var(--border);
          box-shadow: 0 8px 24px rgba(31, 38, 135, 0.02);
          transition: all 0.3s ease; text-align: left;
        }
        .hud-neon-value {
          font-family: 'JetBrains Mono', monospace; font-size: 1.4rem; font-weight: 800;
          letter-spacing: -0.02em; transition: all 0.3s;
        }

        /* ── Recharts Tooltip ── */
        .custom-chart-tooltip {
          background: #ffffff; border: 1.5px solid var(--border);
          border-radius: 12px; padding: 12px 14px; font-size: 0.82rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
        }

        /* ── Trade-off Grid ── */
        .to-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-top: 10px; }
        .to-card {
          border-radius: 18px; padding: 20px; border: 1.5px solid;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .to-card:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(0,0,0,0.04); }
        .to-num { font-family: 'Sora', sans-serif; font-size: 2.2rem; font-weight: 800; margin: 10px 0 6px; line-height: 1; }
        .to-label {
          font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;
          padding: 4px 10px; border-radius: 6px; background: rgba(0,0,0,0.04); display: inline-block;
        }

        /* ── Execution Gantt-style Timeline ── */
        .tl-grid { display: flex; flex-direction: column; gap: 14px; position: relative; padding-left: 20px; border-left: 2px dashed rgba(139, 92, 246, 0.2); margin-left: 10px; }
        .tl-item { position: relative; }
        .tl-item::before {
          content: ''; position: absolute; left: -27px; top: 4px;
          width: 12px; height: 12px; border-radius: 50%;
          background: var(--accent); border: 2px solid #ffffff;
          box-shadow: 0 0 8px var(--accent);
        }
        .tl-week { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 0.88rem; color: var(--text-main); margin-bottom: 2px; }
        .tl-proj { color: var(--text-sub); font-size: 0.86rem; line-height: 1.6; }

        /* ── Checklist Actions widget ── */
        .checklist-item {
          display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px;
          border-radius: 12px; background: rgba(139, 92, 246, 0.02);
          border: 1px solid rgba(139, 92, 246, 0.06); cursor: pointer;
          transition: all 0.2s; font-size: 0.82rem; font-weight: 600; color: var(--text-main);
        }
        .checklist-item:hover { background: #fff; border-color: rgba(139, 92, 246, 0.2); }
        .checklist-checkbox {
          width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid rgba(139, 92, 246, 0.4);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;
          transition: all 0.2s; background: #fff;
        }
        .checklist-item.checked .checklist-checkbox {
          background: var(--accent); border-color: var(--accent);
        }
        .checklist-item.checked {
          opacity: 0.65; text-decoration: line-through;
        }

        /* ── Loading and state overlays ── */
        .baseline-loading-overlay {
          position: absolute; inset: 0; background: rgba(255,255,255,0.72);
          display: flex; align-items: center; justify-content: center; z-index: 10;
          border-radius: 24px; backdrop-filter: blur(2px);
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 860px) { .sim-content-wrapper { padding-top: 90px; } }
      `}</style>

      {/* ══════════════ MASTER HEADER ══════════════ */}
      <div className={`nav-wrapper ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <a className="logo" href="/dashboard">
            SYN<strong>TRA</strong>
          </a>
          <div className="nav-links-desktop">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link-item ${link.href === "/simulator" ? "nav-link-active" : ""}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════ CORE LAYOUT CONTENT ══════════════ */}
      <div className="sim-content-wrapper">

        {/* Hero Section */}
        <div className="title-section">
          <div className="title-badge">
            <BrainCircuit size={13} style={{ color: "var(--primary)" }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Predictive Simulation OS</span>
          </div>
          <h1 className="page-title">
            <span>{typedTitle}</span>
            <span className="title-cursor" />
          </h1>
          <p className="page-sub">
            Calibrate biological, capital, and study variables directly against your neural twin logs. Syntra calculates precise cross-domain constraints, projects target goal metrics, and maps Sequenced Roadmaps dynamically.
          </p>
        </div>

        {/* Message Banner */}
        {message && (
          <div className="msg-banner" style={{ background: message.toLowerCase().includes("fail") ? "#fef2f2" : "#f0fdf4", borderColor: message.toLowerCase().includes("fail") ? "#fecaca" : "#bbf7d0", color: message.toLowerCase().includes("fail") ? "#dc2626" : "#15803d" }}>
            {message.toLowerCase().includes("fail") ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
            <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{message}</span>
          </div>
        )}

        {/* Main Interface Grid */}
        <div className="sim-grid">

          {/* ── LEFT CONFIG PANEL ── */}
          <div className="sim-card">
            {baselinesLoading && (
              <div className="baseline-loading-overlay">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <Loader2 size={38} style={{ color: "var(--primary)", animation: "spin 1.2s linear infinite" }} />
                  <span style={{ fontSize: "0.85rem", color: "var(--text-sub)", fontWeight: 700, letterSpacing: "0.02em" }}>SYNERGIZING BIOLOGICAL TWIN BASELINES...</span>
                </div>
              </div>
            )}
            <div className="card-stripe" style={{ background: "linear-gradient(90deg, var(--primary), var(--accent))" }} />
            <div className="card-inner">

              <div className="ch">
                <div className="ch-left">
                  <div className="ch-icon"><SlidersHorizontal size={18} /></div>
                  <div>
                    <div className="ch-title">Configure Scenario</div>
                    <div className="ch-sub">Variable · Custom Baselines</div>
                  </div>
                </div>
              </div>

              {/* Selector Row */}
              <div className="field-row-3">
                <div>
                  <label className="form-label">Vector Domain</label>
                  <select
                    className="sim-select"
                    value={domain}
                    onChange={(e) => handleDomainChange(e.target.value as Domain)}
                  >
                    <option value="career">Career Domain</option>
                    <option value="health">Health Domain</option>
                    <option value="finance">Finance Domain</option>
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ visibility: "hidden" }}>Simulate</label>
                  <button className="pri-btn" onClick={runSimulation} disabled={loading || baselinesLoading}>
                    {loading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Syncing OS…</> : <><FlaskConical size={15} /> Run Projection</>}
                  </button>
                </div>
              </div>

              {/* Quick Picks */}
              <div style={{ marginBottom: 26 }}>
                <label className="form-label" style={{ marginBottom: 12 }}>Scenario presets</label>
                <div className="qp-grid">
                  {[
                    { d: "career" as Domain, label: "Aggressive Career Upskilling", sub: "Slide to 8h daily study + high focus", style: domainStyles.career, icon: <Briefcase size={14} />, activeVar: "study_hours", trigger: () => { setStudyHoursSim(8); setFocusRatingSim(9); } },
                    { d: "health" as Domain, label: "Increase Workout Frequency", sub: "Add +2 workouts/week to logs", style: domainStyles.health, icon: <HeartPulse size={14} />, activeVar: "workout_frequency", trigger: () => setWorkoutFrequencySim(Math.min(7, (baselines?.workout_frequency || 3) + 2)) },
                    { d: "finance" as Domain, label: "Aggressive Cost Cutting (Ultrasafe)", sub: "Set ultrasafe discretionary spend style", style: domainStyles.finance, icon: <Wallet size={14} />, activeVar: "discretionary_spend", trigger: () => { setSpendingIntensitySim(1); setSavingsRateSim(Math.min(100, (baselines?.savings_rate || 20) + 15)); } },
                  ].map((item) => {
                    const active = domain === item.d && activeVariable === item.activeVar;
                    return (
                      <button
                        key={item.label}
                        className="qp-btn"
                        onClick={() => {
                          handleDomainChange(item.d);
                          setActiveVariable(item.activeVar);
                          item.trigger();
                        }}
                        style={{
                          background: active ? item.style.color : item.style.bg,
                          borderColor: active ? item.style.color : item.style.border,
                          color: active ? "#fff" : item.style.color,
                        }}
                      >
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: active ? "rgba(255,255,255,0.2)" : item.style.bg, border: `1px solid ${active ? "rgba(255,255,255,0.3)" : item.style.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {item.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: "0.84rem" }}>{item.label}</div>
                          <div style={{ fontSize: "0.72rem", opacity: 0.75, marginTop: 1, fontWeight: 500 }}>{item.sub}</div>
                        </div>
                        {active && <CheckCircle2 size={14} style={{ flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specific Metric Sliders */}
              <div style={{ borderTop: "1.5px solid var(--border)", paddingTop: 24 }}>
                <label className="form-label" style={{ marginBottom: 16 }}>Tune absolute {domain.toUpperCase()} parameters</label>

                {domain === "health" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Sleep Hours Slider */}
                    <div className={`variable-card ${activeVariable === "sleep_hours" ? "active-health" : ""}`}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-sub)" }}>Daily Sleep Hours</span>
                        <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--warning)" }}>
                          {sleepHoursSim}h <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 500 }}>(Baseline: {baselines?.sleep_hours || 7.5}h)</span>
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8" }}>4h</span>
                        <input
                          type="range" min={4} max={10} step={0.5}
                          value={sleepHoursSim}
                          onChange={(e) => {
                            setSleepHoursSim(Number(e.target.value));
                            setActiveVariable("sleep_hours");
                            setActiveStep(1);
                          }}
                          className="sim-slider"
                          style={{
                            flex: 1,
                            color: "var(--warning)",
                            background: `linear-gradient(to right, var(--warning) 0%, var(--warning) ${((sleepHoursSim - 4) / 6) * 100}%, rgba(15,23,42,0.06) ${((sleepHoursSim - 4) / 6) * 100}%, rgba(15,23,42,0.06) 100%)`
                          }}
                        />
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8" }}>10h</span>
                      </div>
                    </div>

                    {/* Workout Frequency Slider */}
                    <div className={`variable-card ${activeVariable === "workout_frequency" ? "active-health" : ""}`}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-sub)" }}>Workouts Per Week</span>
                        <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--warning)" }}>
                          {workoutFrequencySim}x <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 500 }}>(Baseline: {baselines?.workout_frequency || 3}x)</span>
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8" }}>0x</span>
                        <input
                          type="range" min={0} max={7} step={1}
                          value={workoutFrequencySim}
                          onChange={(e) => {
                            setWorkoutFrequencySim(Number(e.target.value));
                            setActiveVariable("workout_frequency");
                            setActiveStep(1);
                          }}
                          className="sim-slider"
                          style={{
                            flex: 1,
                            color: "var(--warning)",
                            background: `linear-gradient(to right, var(--warning) 0%, var(--warning) ${(workoutFrequencySim / 7) * 100}%, rgba(15,23,42,0.06) ${(workoutFrequencySim / 7) * 100}%, rgba(15,23,42,0.06) 100%)`
                          }}
                        />
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8" }}>7x</span>
                      </div>
                    </div>
                  </div>
                )}

                {domain === "finance" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Savings Rate Slider */}
                    <div className={`variable-card ${activeVariable === "savings_rate" ? "active-finance" : ""}`}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-sub)" }}>Monthly Savings Rate</span>
                        <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--success)" }}>
                          {savingsRateSim}% <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 500 }}>(Baseline: {baselines?.savings_rate || 20}%)</span>
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8" }}>0%</span>
                        <input
                          type="range" min={0} max={100} step={5}
                          value={savingsRateSim}
                          onChange={(e) => {
                            setSavingsRateSim(Number(e.target.value));
                            setActiveVariable("savings_rate");
                            setActiveStep(1);
                          }}
                          className="sim-slider"
                          style={{
                            flex: 1,
                            color: "var(--success)",
                            background: `linear-gradient(to right, var(--success) 0%, var(--success) ${savingsRateSim}%, rgba(15,23,42,0.06) ${savingsRateSim}%, rgba(15,23,42,0.06) 100%)`
                          }}
                        />
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8" }}>100%</span>
                      </div>
                    </div>

                    {/* Spending Style Intensity Slider */}
                    <div className={`variable-card ${activeVariable === "discretionary_spend" ? "active-finance" : ""}`}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-sub)" }}>Discretionary Spend Style</span>
                        <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--success)", textTransform: "uppercase" }}>
                          {spendingIntensitySim === 1 ? "Ultrasafe" : spendingIntensitySim === 2 ? "Frugal" : spendingIntensitySim === 3 ? "Moderate" : spendingIntensitySim === 4 ? "Impassive" : "Aggressive"}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8" }}>Ultrasafe</span>
                        <input
                          type="range" min={1} max={5} step={1}
                          value={spendingIntensitySim}
                          onChange={(e) => {
                            setSpendingIntensitySim(Number(e.target.value));
                            setActiveVariable("discretionary_spend");
                            setActiveStep(1);
                          }}
                          className="sim-slider"
                          style={{
                            flex: 1,
                            color: "var(--success)",
                            background: `linear-gradient(to right, var(--success) 0%, var(--success) ${((spendingIntensitySim - 1) / 4) * 100}%, rgba(15,23,42,0.06) ${((spendingIntensitySim - 1) / 4) * 100}%, rgba(15,23,42,0.06) 100%)`
                          }}
                        />
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8" }}>Aggressive</span>
                      </div>
                    </div>
                  </div>
                )}

                {domain === "career" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Study Hours Slider */}
                    <div className={`variable-card ${activeVariable === "study_hours" ? "active-career" : ""}`}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-sub)" }}>Daily Study/Work Hours</span>
                        <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--primary)" }}>
                          {studyHoursSim}h <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 500 }}>(Baseline: {baselines?.study_hours || 4}h)</span>
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8" }}>0h</span>
                        <input
                          type="range" min={0} max={12} step={0.5}
                          value={studyHoursSim}
                          onChange={(e) => {
                            setStudyHoursSim(Number(e.target.value));
                            setActiveVariable("study_hours");
                            setActiveStep(1);
                          }}
                          className="sim-slider"
                          style={{
                            flex: 1,
                            color: "var(--primary)",
                            background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(studyHoursSim / 12) * 100}%, rgba(15,23,42,0.06) ${(studyHoursSim / 12) * 100}%, rgba(15,23,42,0.06) 100%)`
                          }}
                        />
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8" }}>12h</span>
                      </div>
                    </div>

                    {/* Focus Quality Slider */}
                    <div className={`variable-card ${activeVariable === "focus_rating" ? "active-career" : ""}`}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-sub)" }}>Typical Focus Quality</span>
                        <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--primary)" }}>
                          {focusRatingSim}/10 <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 500 }}>(Baseline: {baselines?.focus_rating || 7}/10)</span>
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8" }}>1</span>
                        <input
                          type="range" min={1} max={10} step={1}
                          value={focusRatingSim}
                          onChange={(e) => {
                            setFocusRatingSim(Number(e.target.value));
                            setActiveVariable("focus_rating");
                            setActiveStep(1);
                          }}
                          className="sim-slider"
                          style={{
                            flex: 1,
                            color: "var(--primary)",
                            background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((focusRatingSim - 1) / 9) * 100}%, rgba(15,23,42,0.06) ${((focusRatingSim - 1) / 9) * 100}%, rgba(15,23,42,0.06) 100%)`
                          }}
                        />
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8" }}>10</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="command-hud-card" style={{
                background: systemImpactHUD.isBenefit && percentageChange !== 0 ? "rgba(16, 185, 129, 0.03)" : percentageChange === 0 ? "rgba(37, 99, 235, 0.03)" : "rgba(239, 68, 68, 0.03)",
                borderColor: systemImpactHUD.isBenefit && percentageChange !== 0 ? "rgba(16,185,129,0.22)" : percentageChange === 0 ? "rgba(37,99,235,0.22)" : "rgba(239,68,68,0.22)",
                boxShadow: `0 8px 24px ${systemImpactHUD.isBenefit && percentageChange !== 0 ? "rgba(16,185,129,0.05)" : percentageChange === 0 ? "rgba(37,99,235,0.05)" : "rgba(239,68,68,0.05)"}`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--text-sub)", textTransform: "uppercase", letterSpacing: "0.08em" }}>🎯 TARGET GOAL METRIC</span>
                  <span className="hud-neon-value" style={{
                    color: systemImpactHUD.isBenefit && percentageChange !== 0 ? "var(--success)" : percentageChange === 0 ? "var(--primary)" : "var(--warning)",
                    textShadow: `0 2px 10px ${systemImpactHUD.isBenefit && percentageChange !== 0 ? "rgba(16,185,129,0.15)" : percentageChange === 0 ? "rgba(37,99,235,0.15)" : "rgba(239,68,68,0.15)"}`
                  }}>
                    {systemImpactHUD.monthShift} Months
                  </span>
                </div>
                <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "var(--text-main)", display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                  <Sparkles size={13} style={{ color: systemImpactHUD.isBenefit && percentageChange !== 0 ? "var(--success)" : percentageChange === 0 ? "var(--primary)" : "var(--warning)" }} />
                  <span>{systemImpactHUD.goalLabel}</span>
                </div>
                <p style={{ margin: "4px 0 0 20px", fontSize: "0.78rem", color: "var(--text-sub)", fontWeight: 600 }}>
                  {percentageChange === 0 ? "No change in trajectory." : systemImpactHUD.text}
                </p>
              </div>

            </div>
          </div>

          {/* ── RIGHT PREDICTIVE CHART ── */}
          <div className="sim-card">
            <div className="card-stripe" style={{ background: "linear-gradient(90deg, var(--warning) 0%, var(--success) 50%, var(--primary) 100%)" }} />
            <div className="card-inner">

              <div className="ch">
                <div className="ch-left">
                  <div className="ch-icon" style={{ background: "rgba(16,185,129,0.06)", color: "var(--success)" }}><TrendingUp size={18} /></div>
                  <div>
                    <div className="ch-title">Predictive Outcome</div>
                    <div className="ch-sub">6-Month neural projection</div>
                  </div>
                </div>
                {result && (() => {
                  const rLevel = (result?.aiAnalysis?.riskLevel || "medium").toLowerCase() as keyof typeof riskConfig;
                  const rConf = riskConfig[rLevel] || riskConfig.medium;
                  return (
                    <span className="risk-badge" style={{
                      background: rConf.bg,
                      color: rConf.color,
                      borderColor: rConf.border,
                    }}>
                      {rConf.label}
                    </span>
                  );
                })()}
              </div>

              {/* Chart Legends */}
              <div style={{ display: "flex", gap: 18, marginBottom: 16, flexWrap: "wrap" }}>
                {[["var(--warning)", "Health Score"], ["var(--success)", "Finance Score"], ["var(--primary)", "Career Score"]].map(([c, l]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 0 2px ${c}25` }} />
                    <span style={{ fontSize: "0.8rem", color: "var(--text-sub)", fontWeight: 700 }}>{l}</span>
                  </div>
                ))}
              </div>

              {/* Graphic Chart wrapper */}
              <div style={{ width: "100%", height: 240, position: "relative", marginBottom: 20 }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                    <defs>
                      {[["hg", "var(--warning)"], ["fg", "var(--success)"], ["cg", "var(--primary)"]].map(([id, c]) => (
                        <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={c} stopOpacity={0.16} />
                          <stop offset="95%" stopColor={c} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid stroke="rgba(0,0,0,0.03)" strokeDasharray="4 2" />
                    <XAxis dataKey="month" stroke="rgba(0,0,0,0.08)" tick={{ fontSize: 11, fill: "var(--text-sub)", fontWeight: 600 }} />
                    <YAxis domain={[0, 100]} stroke="rgba(0,0,0,0.08)" tick={{ fontSize: 11, fill: "var(--text-sub)", fontWeight: 600 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="health" stroke="var(--warning)" fill="url(#hg)" strokeWidth={2.8} dot={false} />
                    <Area type="monotone" dataKey="finance" stroke="var(--success)" fill="url(#fg)" strokeWidth={2.8} dot={false} />
                    <Area type="monotone" dataKey="career" stroke="var(--primary)" fill="url(#cg)" strokeWidth={2.8} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* AI Insight Advisory Bubble */}
              <div style={{ background: "rgba(15, 23, 42, 0.02)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "18px 22px", fontSize: "0.9rem", color: "var(--text-sub)", lineHeight: 1.65 }}>
                {result ? (
                  <>
                    <div style={{ fontStyle: "normal", fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8, display: "flex", alignItems: "center", gap: 7 }}>
                      <Zap size={15} style={{ color: "var(--primary)" }} />
                      <span>{result?.aiAnalysis?.scenarioTitle || "Simulation Completed"}</span>
                    </div>
                    <p style={{ margin: 0, fontStyle: "italic" }}>
                      &ldquo;{result?.aiAnalysis?.primaryOutcome || "Simulation executed successfully."}&rdquo;
                    </p>
                  </>
                ) : loading ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[90, 75, 85].map((w, i) => (
                      <div key={i} className="loading-shimmer" style={{ height: 14, width: `${w}%` }} />
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-sub)" }}>
                    <Cpu size={16} style={{ color: "var(--primary)" }} />
                    <span style={{ fontWeight: 600 }}>Configure absolute behavioral sliders on the left and click **Run Simulation** to generate predictive outputs.</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ── LOWER SECTION: RESULTS MATRIX ── */}
        {result ? (
          <div className="res-grid">

            {/* Trade-Off Matrix */}
            <div className="sim-card">
              <div className="card-stripe" style={{ background: "linear-gradient(90deg, var(--warning), var(--primary))" }} />
              <div className="card-inner">

                <div className="ch">
                  <div className="ch-left">
                    <div className="ch-icon" style={{ background: "rgba(139,92,246,0.06)", color: "var(--accent)" }}><Activity size={18} /></div>
                    <div>
                      <div className="ch-title">Trade-Off Matrix</div>
                      <div className="ch-sub">Cross-domain secondary impacts</div>
                    </div>
                  </div>
                </div>

                <div className="to-grid">
                  {(result?.aiAnalysis?.tradeOffs || []).map((item, i) => {
                    const pos = item.impact === "positive", neg = item.impact === "negative";
                    const isHealth = item.domain === "health";
                    const isFinance = item.domain === "finance";
                    const accentColor = isHealth ? "var(--warning)" : isFinance ? "var(--success)" : "var(--primary)";
                    const cardBg = isHealth ? "rgba(239,68,68,0.02)" : isFinance ? "rgba(16,185,129,0.02)" : "rgba(37,99,235,0.02)";
                    const cardBorder = isHealth ? "rgba(239,68,68,0.12)" : isFinance ? "rgba(16,185,129,0.12)" : "rgba(37,99,235,0.12)";

                    return (
                      <div key={i} className="to-card" style={{ background: cardBg, borderColor: cardBorder }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span className="to-label" style={{ color: accentColor, background: `rgba(0,0,0,0.03)` }}>{item.domain}</span>
                          {pos ? <ArrowUpRight size={16} style={{ color: "var(--success)" }} /> : neg ? <AlertTriangle size={16} style={{ color: "var(--warning)" }} /> : <Sparkles size={16} style={{ color: "var(--primary)" }} />}
                        </div>
                        <div className="to-num" style={{ color: accentColor }}>
                          <AnimatedNumber value={item.magnitude || 0} />
                        </div>
                        <p style={{ color: "var(--text-sub)", fontSize: "0.82rem", lineHeight: 1.6, fontWeight: 500, margin: 0 }}>{item.explanation}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Sequenced Roadmap Timeline */}
                <div style={{ marginTop: 32, borderTop: "1.5px solid var(--border)", paddingTop: 28 }}>
                  <div className="ch" style={{ marginBottom: 18 }}>
                    <div className="ch-left">
                      <div className="ch-icon" style={{ background: "rgba(37,99,235,0.06)", color: "var(--primary)" }}><Zap size={16} /></div>
                      <div>
                        <div className="ch-title">Execution Roadmap</div>
                        <div className="ch-sub">Sequenced weekly initiatives</div>
                      </div>
                    </div>
                  </div>
                  <div className="tl-grid">
                    {(result?.aiAnalysis?.timelineProjection || []).map((step, i) => (
                      <div key={i} className="tl-item">
                        <div className="tl-week">{step.week}</div>
                        <div className="tl-proj">{step.projection}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Neural Twin Advisory Council */}
            <div className="sim-card">
              <div className="card-stripe" style={{ background: "linear-gradient(90deg, var(--accent), var(--primary))" }} />
              <div className="card-inner">

                <div className="ch">
                  <div className="ch-left">
                    <div className="ch-icon" style={{ background: "rgba(139,92,246,0.06)", color: "var(--accent)" }}><BrainCircuit size={18} /></div>
                    <div>
                      <div className="ch-title">Advisory Council</div>
                      <div className="ch-sub">Neural recommendation and mitigation</div>
                    </div>
                  </div>
                </div>

                {/* Confidence Meter */}
                <div style={{ marginBottom: 26, background: "rgba(15,23,42,0.015)", padding: "16px 18px", borderRadius: 16, border: "1.5px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-sub)" }}>Confidence Index</span>
                    <span style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "var(--primary)" }}>
                      <AnimatedNumber value={result?.aiAnalysis?.confidence || 0} suffix="%" />
                    </span>
                  </div>
                  <div className="conf-track">
                    <div className="conf-fill" style={{ width: `${result?.aiAnalysis?.confidence || 0}%`, background: "linear-gradient(90deg, var(--primary), var(--accent))" }} />
                  </div>
                  <p style={{ marginTop: 12, color: "var(--text-sub)", fontSize: "0.85rem", lineHeight: 1.65, fontStyle: "italic", margin: 0 }}>
                    &ldquo;{result?.aiAnalysis?.recommendedPath || ""}&rdquo;
                  </p>
                </div>

                {/* Dynamic advisory checklist block (upgrade) */}
                {dynamicChecklist.length > 0 && (
                  <div>
                    <label className="form-label" style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                      <CheckCircle2 size={13} style={{ color: "var(--accent)" }} />
                      <span>RECOMMENDED ADVISORY STEPS</span>
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {dynamicChecklist.map((item, idx) => {
                        const isChecked = completedActions.includes(item);
                        return (
                          <div
                            key={idx}
                            className={`checklist-item ${isChecked ? "checked" : ""}`}
                            onClick={() => toggleChecklistAction(item)}
                          >
                            <div className="checklist-checkbox">
                              {isChecked && <CheckCircle2 size={10} style={{ color: "#fff" }} />}
                            </div>
                            <div style={{ flex: 1 }}>{item}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 24, display: "flex", gap: 10, alignItems: "center", padding: "12px 14px", borderRadius: 14, background: "var(--success-glow)", border: "1px solid rgba(16,185,129,0.18)" }}>
                  <CheckCircle2 size={14} style={{ color: "var(--success)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.78rem", color: "var(--success)", fontWeight: 700, lineHeight: 1.5 }}>Simulation output fully calibrated with standalone MongoDB neural trajectory metrics.</span>
                </div>

              </div>
            </div>

          </div>
        ) : (
          /* Awaiting Inputs Card */
          <div className="await-card">
            <div className="await-icon await-pulse"><Cpu size={24} style={{ color: "var(--primary)" }} /></div>
            <div>
              <div style={{ fontWeight: 800, fontFamily: "'Sora', sans-serif", fontSize: "1rem", color: "var(--text-main)", marginBottom: 6 }}>Awaiting Simulation Metrics</div>
              <p style={{ color: "var(--text-sub)", fontSize: "0.88rem", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                Adjust absolute physical sliders representing sleep, workouts, study, focus, or savings. Hit <strong style={{ color: "var(--primary)" }}>Run Projection</strong> to let Syntra compile the predictive charts, cross-domain trade-offs, and sequencing roadmaps instantly.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 48, borderTop: "1.5px solid var(--border)", paddingTop: 20, textAlign: "center", color: "#94a3b8", fontSize: "0.78rem", fontWeight: 600 }}>
          SYNTRA DIGITAL TWIN SYSTEM &copy; 2026. Standalone Node Telemetry is Active.
        </div>

      </div>
    </div>
  );
}

/* ─── Custom Tooltip Component ─── */
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip">
        <div style={{ fontWeight: 800, color: "var(--text-main)", marginBottom: 6, fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {payload[0].payload.month}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {payload.map((item: any) => (
            <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.stroke }} />
              <span style={{ color: "var(--text-sub)", fontSize: "0.76rem", fontWeight: 600 }}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}:
              </span>
              <span style={{ fontWeight: 800, color: "var(--text-main)", fontSize: "0.8rem", fontFamily: "'JetBrains Mono', monospace" }}>
                {item.value}/100
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}