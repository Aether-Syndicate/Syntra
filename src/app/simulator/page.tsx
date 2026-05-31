"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
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

const LEFT_STEPS = [
  { label: "Configure Domain", icon: Target },
  { label: "Set Magnitude", icon: SlidersHorizontal },
  { label: "Run Simulation", icon: FlaskConical },
  { label: "Analyse Results", icon: BarChart3 },
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

  const [domain, setDomain] = useState<Domain>("career");
  const [percentageChange, setPercentageChange] = useState(30);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<SimulationResponse | null>(null);

  // Dynamic Real-time "System Impact" HUD computation
  const systemImpactHUD = useMemo(() => {
    const multiplier = percentageChange >= 0 ? -1 : 1;
    const absChange = Math.abs(percentageChange);
    
    // 1% shift results in 0.05 months change (e.g. 30% shift is 1.5 months)
    const monthShift = parseFloat((absChange * 0.05).toFixed(1));
    const isBenefit = multiplier < 0; 
    
    let goalLabel = "Mahindra Thar Downpayment";
    if (domain === "finance") {
      goalLabel = "Mahindra Thar Downpayment";
    } else if (domain === "career") {
      goalLabel = "LeetCode Knight / Career Promotion";
    } else if (domain === "health") {
      goalLabel = "Sleep Consistency & Vitals Baseline";
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

  useEffect(() => { setMounted(true); }, []);

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

  const runSimulation = async () => {
    setActiveStep(2);
    try {
      setLoading(true);
      setMessage("");
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ scenario: { domain, percentageChange: percentageChange / 100 } }),
      });
      const data = await res.json();
      if (data.success) { setResult(data); setActiveStep(3); }
      else setMessage(data.error || "Simulation failed.");
    } catch { setMessage("Twin simulation failed. Please try again."); }
    finally { setLoading(false); }
  };

  const chartData = useMemo(() => {
    const bh = 58, bf = 64, bc = 71, m = percentageChange;
    return [
      { month: "M1", health: domain === "health" ? bh + m * 0.25 : bh - m * 0.08, finance: domain === "finance" ? bf + m * 0.25 : bf - m * 0.04, career: domain === "career" ? bc + m * 0.28 : bc - m * 0.06 },
      { month: "M2", health: domain === "health" ? bh + m * 0.40 : bh - m * 0.12, finance: domain === "finance" ? bf + m * 0.40 : bf - m * 0.08, career: domain === "career" ? bc + m * 0.45 : bc - m * 0.10 },
      { month: "M3", health: domain === "health" ? bh + m * 0.55 : bh - m * 0.14, finance: domain === "finance" ? bf + m * 0.52 : bf - m * 0.10, career: domain === "career" ? bc + m * 0.62 : bc - m * 0.12 },
      { month: "M4", health: domain === "health" ? bh + m * 0.68 : bh - m * 0.16, finance: domain === "finance" ? bf + m * 0.64 : bf - m * 0.12, career: domain === "career" ? bc + m * 0.74 : bc - m * 0.14 },
      { month: "M5", health: domain === "health" ? bh + m * 0.80 : bh - m * 0.18, finance: domain === "finance" ? bf + m * 0.75 : bf - m * 0.14, career: domain === "career" ? bc + m * 0.86 : bc - m * 0.18 },
      { month: "M6", health: domain === "health" ? bh + m * 0.90 : bh - m * 0.20, finance: domain === "finance" ? bf + m * 0.90 : bf - m * 0.16, career: domain === "career" ? bc + m * 1.00 : bc - m * 0.20 },
    ];
  }, [domain, percentageChange]);

  const riskConfig = {
    low:      { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", label: "Low Risk" },
    medium:   { bg: "#fffbeb", color: "#b45309", border: "#fde68a", label: "Medium Risk" },
    high:     { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", label: "High Risk" },
    critical: { bg: "#fef2f2", color: "#7f1d1d", border: "#fca5a5", label: "Critical" },
  } as const;

  const domainConfig = {
    health:  { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: <HeartPulse size={16} />, label: "Health" },
    finance: { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: <Wallet size={16} />,    label: "Finance" },
    career:  { color: "#0044DD", bg: "#eff4ff", border: "#c7d7fb", icon: <Briefcase size={16} />, label: "Career" },
  };

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fc", fontFamily: '"Inter","DM Sans",-apple-system,sans-serif', display: "flex", alignItems: "stretch" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');

        /* ── LEFT PANEL ── */
        .sim-left { width: 340px; min-height: 100vh; flex-shrink: 0; background: linear-gradient(140deg, #0044DD 0%, #0066FF 55%, #3322EE 100%); display: flex; flex-direction: column; justify-content: center; padding: 48px 44px; position: relative; overflow: hidden; }
        .sim-left::before { content: ''; position: absolute; top: -80px; left: -80px; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%); pointer-events: none; }
        .sim-left::after { content: ''; position: absolute; bottom: -60px; right: -60px; width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%); pointer-events: none; }

        /* Orbiting rings decoration */
        .orbit-deco { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; z-index: 0; }
        .orbit-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(255,255,255,0.08); transform: translate(-50%, -50%); }

        .brand-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 9999px; padding: 6px 14px; font-size: 0.72rem; font-weight: 700; color: #ffffff; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 28px; position: relative; z-index: 1; }
        .left-title { font-family: 'DM Sans', sans-serif; font-size: 2rem; font-weight: 800; color: #ffffff; line-height: 1.2; letter-spacing: -0.04em; margin-bottom: 14px; position: relative; z-index: 1; }
        .left-title span { color: rgba(255,255,255,0.7); font-weight: 300; }
        .left-sub { font-size: 0.82rem; color: rgba(255,255,255,0.68); line-height: 1.7; margin-bottom: 36px; position: relative; z-index: 1; }

        .left-steps { display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1; }
        .left-step { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; transition: background 0.2s; }
        .left-step.active { background: rgba(255,255,255,0.12); }
        .step-icon-ring { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
        .left-step.active .step-icon-ring { background: rgba(255,255,255,0.25); }
        .left-step:not(.active) .step-icon-ring { background: rgba(255,255,255,0.08); }
        .left-step-text { font-size: 0.82rem; font-weight: 500; color: rgba(255,255,255,0.45); }
        .left-step.active .left-step-text { color: #ffffff; font-weight: 700; }

        /* Live domain indicator on left */
        .left-domain-badge { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); border-radius: 12px; padding: 12px 16px; margin-top: 28px; position: relative; z-index: 1; }
        .left-domain-icon { width: 34px; height: 34px; border-radius: 9px; background: rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .left-domain-text { font-size: 0.78rem; color: rgba(255,255,255,0.6); }
        .left-domain-val { font-family: 'DM Sans', sans-serif; font-size: 1.1rem; font-weight: 800; color: #fff; }

        /* ── RIGHT PANEL ── */
        .sim-right { flex: 1; background: #f7f8fc; display: flex; flex-direction: column; padding: 40px 40px 60px; min-height: 100vh; overflow-y: auto; }

        .exit-bar { display: inline-flex; align-items: center; gap: 8px; font-size: 0.82rem; font-weight: 600; color: #64748b; margin-bottom: 28px; padding: 7px 14px; border-radius: 9999px; background: #ffffff; border: 1px solid #e2e8f0; transition: all 0.2s ease; cursor: pointer; width: fit-content; box-shadow: 0 1px 3px rgba(0,0,0,0.06); text-decoration: none; }
        .exit-bar:hover { color: #0044DD; border-color: #0044DD; background: #eff4ff; transform: translateX(-2px); }

        .page-title { font-family: 'DM Sans', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.4rem); font-weight: 800; color: #111; letter-spacing: -0.04em; display: flex; align-items: center; gap: 4px; }
        .title-cursor { display: inline-block; width: 3px; height: 2.4rem; background: #0044DD; margin-left: 4px; animation: blink 0.7s infinite; border-radius: 2px; }
        @keyframes blink { 50% { opacity: 0; } }
        .page-sub { font-size: 0.88rem; color: #64748b; line-height: 1.65; margin-top: 8px; margin-bottom: 28px; max-width: 600px; }

        /* ── Main Grid ── */
        .sim-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px; margin-bottom: 20px; }
        @media (max-width: 1100px) { .sim-grid { grid-template-columns: 1fr; } }
        .res-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px; animation: fadeUp 0.4s ease; }
        @media (max-width: 1100px) { .res-grid { grid-template-columns: 1fr; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        /* ── Cards ── */
        .sim-card { background: #ffffff; border-radius: 20px; border: 1px solid #e8ebf4; overflow: hidden; box-shadow: 0 4px 20px rgba(0,68,221,0.06), 0 1px 3px rgba(0,0,0,0.04); transition: box-shadow 0.2s, transform 0.2s; }
        .sim-card:hover { box-shadow: 0 8px 32px rgba(0,68,221,0.10), 0 2px 6px rgba(0,0,0,0.05); transform: translateY(-2px); }
        .card-stripe { height: 4px; width: 100%; }
        .card-inner { padding: 22px 26px; }

        /* ── Card Header ── */
        .ch { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .ch-left { display: flex; align-items: center; gap: 12px; }
        .ch-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: #eff4ff; color: #0044DD; }
        .ch-title { font-size: 0.98rem; font-weight: 700; color: #111; letter-spacing: -0.01em; }
        .ch-sub { font-size: 0.74rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }

        /* ── Form Elements ── */
        .form-label { font-size: 0.78rem; font-weight: 600; color: #475569; display: block; margin-bottom: 6px; letter-spacing: 0.01em; }
        .sim-select { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid #cbd5e1; background: #f7f8fc; color: #111; font-family: 'Inter', sans-serif; font-size: 0.88rem; appearance: none; cursor: pointer; transition: all 0.18s; height: 42px; }
        .sim-select:focus { outline: none; border-color: #0044DD; background: #fff; box-shadow: 0 0 0 3px rgba(0,68,221,0.1); }
        .field-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .field-row-3 { display: grid; grid-template-columns: 2fr 1fr auto; gap: 12px; align-items: end; margin-bottom: 16px; }

        /* ── Domain Quick-pick ── */
        .qp-grid { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .qp-btn { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 12px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 0.84rem; font-weight: 600; border: 1.5px solid; transition: all 0.18s; width: 100%; text-align: left; }
        .qp-btn:hover { transform: translateX(3px); }
        .qp-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

        /* ── Slider ── */
        .slider-wrap { position: relative; }
        .slider-track { height: 6px; background: #e2e8f0; border-radius: 999px; position: relative; overflow: visible; }
        .slider-fill { position: absolute; top: 0; height: 100%; border-radius: 999px; pointer-events: none; transition: width 0.1s; }
        .sim-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 999px; background: transparent; outline: none; cursor: pointer; position: relative; margin: 0; }
        .sim-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #0044DD; cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 0 2px #c7d7fb, 0 2px 8px rgba(0,68,221,0.3); transition: transform 0.15s, box-shadow 0.15s; }
        .sim-slider::-webkit-slider-thumb:hover { transform: scale(1.15); box-shadow: 0 0 0 3px #bfdbfe, 0 4px 12px rgba(0,68,221,0.4); }
        .sim-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #0044DD; cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 0 2px #c7d7fb; }

        .slider-val { font-family: 'DM Sans', sans-serif; font-size: 2rem; font-weight: 800; line-height: 1; }
        .slider-labels { display: flex; justify-content: space-between; font-size: 0.72rem; color: #94a3b8; margin-top: 6px; padding: 0 4px; }

        /* ── Primary Button ── */
        .pri-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 22px; border-radius: 12px; border: none; background: linear-gradient(135deg, #0044DD, #3322EE); color: #fff; font-family: 'Inter', sans-serif; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 14px rgba(0,68,221,0.3); white-space: nowrap; height: 42px; }
        .pri-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,68,221,0.38); }
        .pri-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* ── Risk badge ── */
        .risk-badge { font-size: 0.72rem; font-weight: 700; padding: 6px 14px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.06em; border: 1px solid; }

        /* ── Trade-off cards ── */
        .to-card { border-radius: 14px; padding: 16px; border: 1px solid; transition: transform 0.18s; }
        .to-card:hover { transform: translateY(-2px); }
        .to-num { font-family: 'DM Sans', sans-serif; font-size: 2rem; font-weight: 800; margin: 10px 0 6px; line-height: 1; }
        .to-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 3px 9px; border-radius: 6px; background: rgba(0,0,0,0.05); color: #64748b; display: inline-block; }

        /* ── Timeline ── */
        .tl-item { display: flex; gap: 14px; align-items: flex-start; }
        .tl-num { width: 28px; height: 28px; border-radius: 9999px; flex-shrink: 0; background: linear-gradient(135deg, #0044DD, #3322EE); color: #fff; font-size: 0.72rem; font-weight: 800; display: flex; align-items: center; justify-content: center; }
        .tl-week { font-weight: 700; font-size: 0.88rem; color: #111; margin-bottom: 3px; }
        .tl-proj { color: #64748b; font-size: 0.84rem; line-height: 1.65; }

        /* ── Confidence bar ── */
        .conf-track { height: 8px; background: #f1f5f9; border-radius: 999px; overflow: hidden; }
        .conf-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #0044DD, #3322EE); transition: width 1s cubic-bezier(0.34,1.56,0.64,1); }

        /* ── Await state ── */
        .await-card { background: #fff; border-radius: 20px; border: 1px solid #e8ebf4; padding: 32px; box-shadow: 0 4px 20px rgba(0,68,221,0.06); display: flex; align-items: center; gap: 20px; }
        .await-icon { width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #eff4ff, #e0e7ff); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .await-pulse { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.95); } }

        /* ── Message banner ── */
        .msg-banner { display: flex; align-items: center; gap: 10px; border-radius: 12px; padding: 12px 16px; font-size: 0.86rem; font-weight: 500; margin-bottom: 16px; border: 1px solid; }

        /* ── Chart preview overlay ── */
        .chart-no-result { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; pointer-events: none; }
        .chart-overlay-text { font-size: 0.82rem; color: #94a3b8; font-weight: 500; }

        /* ── Loading shimmer ── */
        @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        .loading-shimmer { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 800px 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 860px) { .sim-left { display: none; } .sim-right { padding: 24px 16px 48px; } }
        @media (max-width: 600px) { .field-row-3 { grid-template-columns: 1fr; } .field-row-2 { grid-template-columns: 1fr; } }
      `}</style>

      {/* ══════════════ LEFT PANEL ══════════════ */}
      <div className="sim-left">
        <div className="orbit-deco" style={{ opacity: 0.4 }}>
          {[180, 260, 340].map((s, i) => (
            <div key={i} className="orbit-ring" style={{ width: s, height: s }} />
          ))}
        </div>

        <div className="brand-badge"><Atom size={12} /> Syntra AI</div>
        <h2 className="left-title">
          Simulate<br />your <span>decision</span><br />outcomes.
        </h2>
        <p className="left-sub">
          Adjust any behavioral vector and Syntra's predictive twin models trade-offs across all three life domains in real time.
        </p>

        {/* Steps */}
        <div className="left-steps">
          {LEFT_STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === activeStep;
            return (
              <div key={i} className={`left-step ${isActive ? "active" : ""}`}>
                <div className="step-icon-ring">
                  <Icon size={15} color={isActive ? "#fff" : "rgba(255,255,255,0.4)"} />
                </div>
                <span className="left-step-text">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Live domain readout */}
        <div className="left-domain-badge">
          <div className="left-domain-icon">
            {domain === "health" ? <HeartPulse size={16} color="#fff" /> : domain === "finance" ? <Wallet size={16} color="#fff" /> : <Briefcase size={16} color="#fff" />}
          </div>
          <div>
            <div className="left-domain-text">Active vector</div>
            <div className="left-domain-val">{domain.charAt(0).toUpperCase() + domain.slice(1)} {percentageChange >= 0 ? "+" : ""}{percentageChange}%</div>
          </div>
        </div>
      </div>

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <div className="sim-right">

        {/* Back */}
        <div className="exit-bar" onClick={() => window?.history?.back()}>
          <ArrowLeft size={14} /> Return to Dashboard
        </div>

        {/* Hero */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#eff4ff", border: "1px solid #c7d7fb", borderRadius: 9999, padding: "5px 14px", marginBottom: 12 }}>
            <BrainCircuit size={13} style={{ color: "#0044DD" }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0044DD", textTransform: "uppercase", letterSpacing: "0.1em" }}>Syntra Predictive Engine</span>
          </div>
          <h1 className="page-title">
            <span style={{ color: "#0044DD" }}>{typedTitle}</span>
            <span className="title-cursor" />
          </h1>
          <p className="page-sub">
            Model behavioral trade-offs across health, finance, and career. Syntra visualizes ripple effects and proposes an execution roadmap aligned to your optimal trajectory.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="msg-banner" style={{ background: message.toLowerCase().includes("fail") ? "#fef2f2" : "#f0fdf4", borderColor: message.toLowerCase().includes("fail") ? "#fecaca" : "#bbf7d0", color: message.toLowerCase().includes("fail") ? "#dc2626" : "#15803d" }}>
            {message.toLowerCase().includes("fail") ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
            <span>{message}</span>
          </div>
        )}

        {/* Main Grid */}
        <div className="sim-grid">

          {/* ── LEFT: Configure ── */}
          <div className="sim-card">
            <div className="card-stripe" style={{ background: "linear-gradient(90deg, #0044DD, #3322EE)" }} />
            <div className="card-inner">
              <div className="ch">
                <div className="ch-left">
                  <div className="ch-icon"><SlidersHorizontal size={18} /></div>
                  <div>
                    <div className="ch-title">Configure Scenario</div>
                    <div className="ch-sub">Domain · Magnitude · Direction</div>
                  </div>
                </div>
              </div>

              {/* Top row: domain select + run button */}
              <div className="field-row-3">
                <div>
                  <label className="form-label">Vector Domain</label>
                  <select
                    className="sim-select"
                    value={domain}
                    onChange={(e) => { setDomain(e.target.value as Domain); setActiveStep(1); }}
                  >
                    <option value="health">Health</option>
                    <option value="finance">Finance</option>
                    <option value="career">Career</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Shift Magnitude (%)</label>
                  <input
                    type="number" min={-50} max={50} step={1}
                    value={percentageChange}
                    onChange={(e) => setPercentageChange(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #cbd5e1", background: "#f7f8fc", fontFamily: "'Inter',sans-serif", fontSize: "0.88rem", height: 42, boxSizing: "border-box" as const, color: "#111" }}
                  />
                </div>
                <button className="pri-btn" onClick={runSimulation} disabled={loading}>
                  {loading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Syncing…</> : <><FlaskConical size={15} /> Simulate</>}
                </button>
              </div>

              {/* Quick-pick scenarios */}
              <div style={{ marginBottom: 20 }}>
                <label className="form-label" style={{ marginBottom: 10 }}>Quick-Pick Scenario</label>
                <div className="qp-grid">
                  {[
                    { d: "health"  as Domain, label: "Increase Workout Frequency", sub: "+30% health activity", color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: <HeartPulse size={14} />, val: 30 },
                    { d: "finance" as Domain, label: "Cut Food Delivery Budget",   sub: "−20% discretionary spend", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: <Wallet size={14} />,    val: -20 },
                    { d: "career"  as Domain, label: "Increase Study Time",        sub: "+40% skill investment", color: "#0044DD", bg: "#eff4ff", border: "#c7d7fb", icon: <Briefcase size={14} />, val: 40 },
                  ].map((item) => {
                    const active = domain === item.d && percentageChange === item.val;
                    return (
                      <button
                        key={item.d}
                        className="qp-btn"
                        onClick={() => { setDomain(item.d); setPercentageChange(item.val); setActiveStep(1); }}
                        style={{
                          background: active ? item.color : item.bg,
                          borderColor: active ? item.color : item.border,
                          color: active ? "#fff" : item.color,
                        }}
                      >
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: active ? "rgba(255,255,255,0.2)" : item.bg, border: `1px solid ${active ? "rgba(255,255,255,0.3)" : item.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {item.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: "0.84rem" }}>{item.label}</div>
                          <div style={{ fontSize: "0.72rem", opacity: 0.7, marginTop: 1 }}>{item.sub}</div>
                        </div>
                        {active && <CheckCircle2 size={14} style={{ flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Fine-Tune Shift</label>
                  <span className="slider-val" style={{ color: percentageChange >= 0 ? "#0044DD" : "#ef4444" }}>
                    {percentageChange >= 0 ? "+" : ""}{percentageChange}%
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "4px 10px", borderRadius: 7, background: "#f1f5f9", color: "#64748b" }}>−50%</span>
                  <div style={{ flex: 1, position: "relative", height: 22, display: "flex", alignItems: "center" }}>
                    <div style={{ position: "absolute", left: 0, right: 0, height: 6, background: "#e2e8f0", borderRadius: 999 }} />
                    <div style={{
                      position: "absolute",
                      height: 6,
                      borderRadius: 999,
                      background: percentageChange >= 0 ? "linear-gradient(90deg,#0044DD,#3322EE)" : "linear-gradient(90deg,#ef4444,#f97316)",
                      left: percentageChange >= 0 ? "50%" : `${50 + percentageChange}%`,
                      width: `${Math.abs(percentageChange)}%`,
                      pointerEvents: "none",
                    }} />
                    <input
                      type="range" min={-50} max={50} step={1}
                      value={percentageChange}
                      onChange={(e) => { setPercentageChange(Number(e.target.value)); setActiveStep(1); }}
                      className="sim-slider"
                      style={{ position: "relative", zIndex: 2, width: "100%", background: "transparent" }}
                    />
                  </div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "4px 10px", borderRadius: 7, background: "#f1f5f9", color: "#64748b" }}>+50%</span>
                </div>
                <div className="slider-labels" style={{ paddingLeft: 52, paddingRight: 52 }}>
                  <span>Reduce</span><span>Neutral</span><span>Increase</span>
                </div>

                {/* Real-time System Impact HUD Widget */}
                <div className="system-impact-hud" style={{
                  marginTop: 18,
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: "#090d16",
                  border: `1px solid ${systemImpactHUD.isBenefit && percentageChange !== 0 ? "rgba(16,185,129,0.3)" : percentageChange === 0 ? "rgba(96,165,250,0.3)" : "rgba(239,68,68,0.3)"}`,
                  boxShadow: `0 4px 12px ${systemImpactHUD.isBenefit && percentageChange !== 0 ? "rgba(16,185,129,0.15)" : percentageChange === 0 ? "rgba(96,165,250,0.15)" : "rgba(239,68,68,0.15)"}`,
                  transition: "all 0.3s ease",
                  textAlign: "left"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>🎯 System Impact HUD Projection</span>
                    <span style={{
                      fontFamily: "'Courier New', Courier, monospace",
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      color: systemImpactHUD.isBenefit && percentageChange !== 0 ? "#10b981" : percentageChange === 0 ? "#60a5fa" : "#ef4444",
                      textShadow: `0 0 4px ${systemImpactHUD.isBenefit && percentageChange !== 0 ? "rgba(16,185,129,0.4)" : percentageChange === 0 ? "rgba(96,165,250,0.4)" : "rgba(239,68,68,0.4)"}`
                    }}>
                      {systemImpactHUD.monthShift} Months
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
                    <Sparkles size={12} style={{ color: systemImpactHUD.isBenefit && percentageChange !== 0 ? "#10b981" : percentageChange === 0 ? "#60a5fa" : "#ef4444" }} />
                    <span>{systemImpactHUD.goalLabel}</span>
                  </div>
                  <p style={{ margin: "4px 0 0 18px", fontSize: "0.74rem", color: "#9ca3af", fontWeight: 500 }}>
                    {percentageChange === 0 ? "No change in trajectory." : systemImpactHUD.text}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Chart ── */}
          <div className="sim-card">
            <div className="card-stripe" style={{ background: "linear-gradient(90deg,#ef4444 0%,#16a34a 50%,#0044DD 100%)" }} />
            <div className="card-inner">
              <div className="ch">
                <div className="ch-left">
                  <div className="ch-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}><TrendingUp size={18} /></div>
                  <div>
                    <div className="ch-title">Predictive Outcome</div>
                    <div className="ch-sub">Six-month projection</div>
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

              {/* Legend */}
              <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
                {[["#ef4444", "Health"], ["#16a34a", "Finance"], ["#0044DD", "Career"]].map(([c, l]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 0 2px ${c}30` }} />
                    <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 500 }}>{l}</span>
                  </div>
                ))}
              </div>

              <div style={{ width: "100%", height: 240, position: "relative" }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      {[["hg", "#ef4444"], ["fg", "#16a34a"], ["cg", "#0044DD"]].map(([id, c]) => (
                        <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={c} stopOpacity={0.15} />
                          <stop offset="95%" stopColor={c} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 2" />
                    <XAxis dataKey="month" stroke="#cbd5e1" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <YAxis domain={[0, 100]} stroke="#cbd5e1" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: "0.82rem", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
                    <Area type="monotone" dataKey="health"  stroke="#ef4444" fill="url(#hg)" strokeWidth={2.5} dot={false} />
                    <Area type="monotone" dataKey="finance" stroke="#16a34a" fill="url(#fg)" strokeWidth={2.5} dot={false} />
                    <Area type="monotone" dataKey="career"  stroke="#0044DD" fill="url(#cg)" strokeWidth={2.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={{ height: 1, background: "#f1f5f9", margin: "16px 0" }} />

              <div style={{ background: "#f8fafc", border: "1px solid #e8ebf4", borderRadius: 14, padding: "14px 16px", fontSize: "0.88rem", color: "#475569", lineHeight: 1.7 }}>
                {result ? (
                  <>
                    <div style={{ fontWeight: 700, color: "#111", marginBottom: 5 }}>{result?.aiAnalysis?.scenarioTitle || "Simulation Output"}</div>
                    {result?.aiAnalysis?.primaryOutcome || "Simulation processed successfully."}
                  </>
                ) : loading ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[80, 60, 90].map((w, i) => (
                      <div key={i} className="loading-shimmer" style={{ height: 14, width: `${w}%` }} />
                    ))}
                  </div>
                ) : (
                  <span style={{ color: "#94a3b8" }}>Run a simulation to generate your personalized outcome narrative.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results or Await */}
        {result ? (
          <div className="res-grid">

            {/* Trade-Off Matrix */}
            <div className="sim-card">
              <div className="card-stripe" style={{ background: "linear-gradient(90deg,#f97316,#ef4444,#0044DD)" }} />
              <div className="card-inner">
                <div className="ch">
                  <div className="ch-left">
                    <div className="ch-icon" style={{ background: "#fff7ed", color: "#ea580c" }}><Activity size={18} /></div>
                    <div>
                      <div className="ch-title">Trade-Off Matrix</div>
                      <div className="ch-sub">Cross-domain ripple effects</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
                  {(result?.aiAnalysis?.tradeOffs || []).map((item, i) => {
                    const pos = item.impact === "positive", neg = item.impact === "negative";
                    return (
                      <div key={i} className="to-card" style={{
                        background: pos ? "#f0fdf4" : neg ? "#fef2f2" : "#f8fafc",
                        borderColor: pos ? "#bbf7d0" : neg ? "#fecaca" : "#e2e8f0",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span className="to-label">{item.domain}</span>
                          {pos ? <ArrowUpRight size={15} style={{ color: "#16a34a" }} /> : neg ? <AlertTriangle size={15} style={{ color: "#ef4444" }} /> : <Sparkles size={15} style={{ color: "#0044DD" }} />}
                        </div>
                        <div className="to-num" style={{ color: pos ? "#15803d" : neg ? "#dc2626" : "#64748b" }}>
                          <AnimatedNumber value={item.magnitude || 0} />
                        </div>
                        <p style={{ color: "#64748b", fontSize: "0.82rem", lineHeight: 1.65, margin: 0 }}>{item.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Execution Roadmap */}
            <div className="sim-card">
              <div className="card-stripe" style={{ background: "linear-gradient(90deg,#0044DD,#3322EE)" }} />
              <div className="card-inner">
                <div className="ch">
                  <div className="ch-left">
                    <div className="ch-icon" style={{ background: "#eff4ff", color: "#0044DD" }}><Zap size={18} /></div>
                    <div>
                      <div className="ch-title">Execution Roadmap</div>
                      <div className="ch-sub">Sequenced weekly initiatives</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {(result?.aiAnalysis?.timelineProjection || []).map((step, i) => (
                    <div key={i} className="tl-item">
                      <div className="tl-num">{i + 1}</div>
                      <div>
                        <div className="tl-week">{step.week}</div>
                        <div className="tl-proj">{step.projection}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #e8ebf4" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748b" }}>Confidence Score</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "#0044DD" }}>
                      <AnimatedNumber value={result?.aiAnalysis?.confidence || 0} suffix="%" />
                    </span>
                  </div>
                  <div className="conf-track">
                    <div className="conf-fill" style={{ width: `${result?.aiAnalysis?.confidence || 0}%` }} />
                  </div>
                  <p style={{ marginTop: 12, color: "#475569", fontSize: "0.86rem", lineHeight: 1.7 }}>{result?.aiAnalysis?.recommendedPath || ""}</p>
                  <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", padding: "12px 14px", borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <CheckCircle2 size={14} style={{ color: "#15803d", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.8rem", color: "#14532d", lineHeight: 1.55 }}>Analysis complete. Twin Intelligence updated with latest behavioral telemetry.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="await-card">
            <div className="await-icon await-pulse"><Cpu size={24} style={{ color: "#0044DD" }} /></div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "#111", marginBottom: 6 }}>Awaiting Simulation Input</div>
              <p style={{ color: "#94a3b8", fontSize: "0.86rem", lineHeight: 1.7, margin: 0 }}>
                Configure your behavioral vector above and press <strong style={{ color: "#0044DD" }}>Simulate</strong> to activate the predictive engine — trade-off matrix, six-month chart, and execution roadmap will populate instantly.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 48, fontSize: "0.76rem", color: "#94a3b8" }}>
          Syntra — your health, money, and career in one view.
        </div>
      </div>
    </div>
  );
}