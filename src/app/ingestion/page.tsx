"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  HeartPulse,
  Wallet,
  Briefcase,
  Upload,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface HealthData {
  sleepHours: string;
  workoutMinutes: string;
  stressLevel: string;
  moodScore: string;
  energyLevel: string;
  caloriesConsumed: string;
  calorieGoal: string;
}

interface FinanceData {
  amountSaved: string;
  discretionarySpent: string;
  spendingCategory: string;
}

interface CareerData {
  hoursStudied: string;
  productivityRating: string;
  sessionsCompleted: string;
  courseName: string;
}

interface CsvData {
  file: File | null;
  domain: string;
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function calcHealthProgress(d: HealthData): number {
  const required = [d.sleepHours, d.workoutMinutes, d.stressLevel];
  const optional = [d.moodScore, d.energyLevel, d.caloriesConsumed, d.calorieGoal];
  const reqFilled = required.filter(Boolean).length;
  const optFilled = optional.filter(Boolean).length;
  return Math.round((reqFilled / 3) * 70 + (optFilled / 4) * 30);
}

function calcFinanceProgress(d: FinanceData): number {
  const filled = [d.amountSaved, d.discretionarySpent].filter(Boolean).length;
  return Math.round((filled / 2) * 100);
}

function calcCareerProgress(d: CareerData): number {
  const required = [d.hoursStudied, d.productivityRating];
  const optional = [d.sessionsCompleted, d.courseName];
  const reqFilled = required.filter(Boolean).length;
  const optFilled = optional.filter(Boolean).length;
  return Math.round((reqFilled / 2) * 70 + (optFilled / 2) * 30);
}

function calcCsvProgress(d: CsvData): number {
  return d.file ? 100 : 0;
}

/* ─────────────────────────────────────────────
   FormField – reusable
───────────────────────────────────────────── */
function FormField({
  label, req, opt, type, value, onChange, placeholder,
}: {
  label: string; req?: boolean; opt?: boolean; type: string;
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="field">
      <label className="form-label">
        {label}
        {req && <span className="req">*</span>}
        {opt && <span className="opt-tag">(optional)</span>}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="form-input"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Progress Bar
───────────────────────────────────────────── */
function ProgressBar({ pct, gradient }: { pct: number; gradient: string }) {
  return (
    <div className="progress-track">
      <div
        className="progress-fill"
        style={{ width: `${pct}%`, background: gradient }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step Dots
───────────────────────────────────────────── */
const STEPS = ["Health", "Finance", "Career", "Batch"];

const STEP_COLORS = [
  "linear-gradient(135deg,#0044DD,#0066FF)",
  "linear-gradient(135deg,#0055EE,#3322EE)",
  "linear-gradient(135deg,#0066FF,#0044DD)",
  "linear-gradient(135deg,#3322EE,#0066FF)",
];

function StepDots({ current, completed }: { current: number; completed: Set<number> }) {
  return (
    <div className="step-dots">
      {STEPS.map((label, i) => (
        <div key={i} className="step-dot-wrapper">
          <div
            className={`step-dot ${i === current ? "dot-active" : ""} ${completed.has(i) ? "dot-done" : ""}`}
            style={
              i === current
                ? { background: STEP_COLORS[i], boxShadow: "0 0 0 3px rgba(0,85,238,0.25)" }
                : completed.has(i)
                ? { background: "#0055EE" }
                : {}
            }
          >
            {completed.has(i) && i !== current ? (
              <CheckCircle2 size={11} color="#fff" />
            ) : (
              <span className="dot-num">{i + 1}</span>
            )}
          </div>
          <span
            className="dot-label"
            style={{ color: i === current ? "#60a5fa" : completed.has(i) ? "#60a5fa" : "#94a3b8" }}
          >
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <div
              className="dot-connector"
              style={{ background: completed.has(i) ? "#0055EE" : "rgba(255,255,255,0.15)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function IngestionPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [animDir, setAnimDir] = useState<"forward" | "backward">("forward");
  const [animating, setAnimating] = useState(false);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const [typedTitle, setTypedTitle] = useState("");
  const fullTitle = "Feed Your AI Twin";

  const [health, setHealth] = useState<HealthData>({
    sleepHours: "", workoutMinutes: "", stressLevel: "",
    moodScore: "", energyLevel: "", caloriesConsumed: "", calorieGoal: "",
  });
  const [finance, setFinance] = useState<FinanceData>({
    amountSaved: "", discretionarySpent: "", spendingCategory: "food",
  });
  const [career, setCareer] = useState<CareerData>({
    hoursStudied: "", productivityRating: "", sessionsCompleted: "", courseName: "",
  });
  const [csv, setCsv] = useState<CsvData>({ file: null, domain: "health" });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let idx = 0, deleting = false;
    let tid: NodeJS.Timeout;
    const tick = () => {
      if (!deleting) {
        setTypedTitle(fullTitle.substring(0, idx + 1));
        idx++;
        if (idx === fullTitle.length) { deleting = true; tid = setTimeout(tick, 3500); }
        else tid = setTimeout(tick, 110);
      } else {
        setTypedTitle(fullTitle.substring(0, idx - 1));
        idx--;
        if (idx === 0) { deleting = false; tid = setTimeout(tick, 600); }
        else tid = setTimeout(tick, 50);
      }
    };
    tid = setTimeout(tick, 200);
    return () => clearTimeout(tid);
  }, []);

  const goTo = useCallback((target: number) => {
    if (animating) return;
    setAnimDir(target > step ? "forward" : "backward");
    setAnimating(true);
    setTimeout(() => {
      setStep(target);
      setMessage("");
      setAnimating(false);
    }, 320);
  }, [animating, step]);

  const progress = [
    calcHealthProgress(health),
    calcFinanceProgress(finance),
    calcCareerProgress(career),
    calcCsvProgress(csv),
  ];

  const canNext = [
    !!(health.sleepHours && health.workoutMinutes && health.stressLevel),
    !!(finance.amountSaved && finance.discretionarySpent),
    !!(career.hoursStudied && career.productivityRating),
    true,
  ][step];

  const handleNext = () => {
    if (!canNext) {
      setMessage("Please fill in all required fields before continuing.");
      return;
    }
    setCompleted(prev => new Set([...prev, step]));
    if (step < 3) goTo(step + 1);
  };

  const handleBack = () => {
    if (step > 0) goTo(step - 1);
  };

  const submitAll = async () => {
    setLoading(true);
    setMessage("");
    try {
      const h = await fetch("/api/log", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ domain: "health", data: {
          sleepHours: Number(health.sleepHours), workoutMinutes: Number(health.workoutMinutes),
          stressLevel: Number(health.stressLevel),
          moodScore: health.moodScore ? Number(health.moodScore) : undefined,
          energyLevel: health.energyLevel ? Number(health.energyLevel) : undefined,
          caloriesConsumed: health.caloriesConsumed ? Number(health.caloriesConsumed) : undefined,
          calorieGoal: health.calorieGoal ? Number(health.calorieGoal) : undefined,
        }}),
      });
      const hd = await h.json();
      if (!hd.success) throw new Error(hd.message || "Health ingestion failed.");

      const f = await fetch("/api/log", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ domain: "finance", data: {
          amountSaved: Number(finance.amountSaved),
          discretionarySpent: Number(finance.discretionarySpent),
          spendingCategory: finance.spendingCategory,
        }}),
      });
      const fd = await f.json();
      if (!fd.success) throw new Error(fd.message || "Finance ingestion failed.");

      const c = await fetch("/api/log", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ domain: "career", data: {
          hoursStudied: Number(career.hoursStudied),
          productivityRating: Number(career.productivityRating),
          sessionsCompleted: career.sessionsCompleted ? Number(career.sessionsCompleted) : undefined,
          courseName: career.courseName || undefined,
        }}),
      });
      const cd = await c.json();
      if (!cd.success) throw new Error(cd.message || "Career ingestion failed.");

      if (csv.file) {
        const formData = new FormData();
        formData.append("file", csv.file);
        formData.append("domain", csv.domain);
        await fetch("/api/upload/csv", { method: "POST", credentials: "include", body: formData });
      }

      window.dispatchEvent(new Event("syntra-refresh"));
      setCompleted(new Set([0, 1, 2, 3]));
      setSubmitted(true);
      setTimeout(() => router.push("/dashboard"), 2800);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Submission failed. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const isError = (msg: string) =>
    msg.toLowerCase().includes("fail") || msg.includes("select") ||
    msg.includes("fill") || msg.includes("complete") || msg.includes("required");

  const gradients = [
    "linear-gradient(90deg,#0044DD,#0066FF)",
    "linear-gradient(90deg,#0055EE,#3322EE)",
    "linear-gradient(90deg,#0066FF,#0044DD)",
    "linear-gradient(90deg,#3322EE,#0066FF)",
  ];
  const btnGradients = [
    "linear-gradient(135deg,#0044DD,#0066FF)",
    "linear-gradient(135deg,#0055EE,#3322EE)",
    "linear-gradient(135deg,#0066FF,#0044DD)",
    "linear-gradient(135deg,#3322EE,#0066FF)",
  ];
  const btnShadows = [
    "0 4px 14px rgba(0,68,221,0.35)",
    "0 4px 14px rgba(0,85,238,0.35)",
    "0 4px 14px rgba(0,102,255,0.3)",
    "0 4px 14px rgba(51,34,238,0.35)",
  ];

  const iconRings = [
    { bg: "#dbeafe", color: "#0044DD" },
    { bg: "#dbeafe", color: "#0055EE" },
    { bg: "#e0e7ff", color: "#0044DD" },
    { bg: "#e0e7ff", color: "#3322EE" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f7f8fc",
      fontFamily: '"Inter","DM Sans",-apple-system,sans-serif',
      display: "flex",
      alignItems: "stretch",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        .page-left { width: 340px; min-height: 100vh; flex-shrink: 0; background: linear-gradient(140deg, #0044DD 0%, #0066FF 55%, #3322EE 100%); display: flex; flex-direction: column; justify-content: center; padding: 48px 44px; position: relative; overflow: hidden; }
        .page-left::before { content: ''; position: absolute; top: -80px; left: -80px; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%); pointer-events: none; }
        .page-left::after { content: ''; position: absolute; bottom: -60px; right: -60px; width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%); pointer-events: none; }
        .page-right { flex: 1; background: #f7f8fc; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 32px; min-height: 100vh; }
        .brand-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 9999px; padding: 6px 14px; font-size: 0.72rem; font-weight: 700; color: #ffffff; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 28px; }
        .left-title { font-family: 'DM Sans', sans-serif; font-size: 2rem; font-weight: 800; color: #ffffff; line-height: 1.2; letter-spacing: -0.04em; margin-bottom: 14px; }
        .left-title span { color: rgba(255,255,255,0.75); font-weight: 300; }
        .left-sub { font-size: 0.83rem; color: rgba(255,255,255,0.72); line-height: 1.7; margin-bottom: 36px; }
        .left-steps { display: flex; flex-direction: column; gap: 14px; }
        .left-step { display: flex; align-items: center; gap: 12px; }
        .left-step-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .left-step-text { font-size: 0.8rem; font-weight: 500; color: rgba(255,255,255,0.45); }
        .left-step-text.active { color: #ffffff; font-weight: 600; }
        .main-wrapper { width: 100%; max-width: 620px; }
        .exit-bar { display: inline-flex; align-items: center; gap: 8px; font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 600; color: #64748b; text-decoration: none; margin-bottom: 28px; padding: 7px 14px; border-radius: 9999px; background: #ffffff; border: 1px solid #e2e8f0; transition: all 0.2s ease; cursor: pointer; width: fit-content; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .exit-bar:hover { color: #0044DD; border-color: #0044DD; background: #eff4ff; transform: translateX(-2px); }
        .title-container { margin-bottom: 24px; }
        .dynamic-title { font-family: 'DM Sans', sans-serif; font-size: clamp(1.6rem, 3.5vw, 2.2rem); font-weight: 800; color: #111111; letter-spacing: -0.04em; margin-bottom: 6px; display: flex; align-items: center; gap: 2px; }
        .title-accent { color: #0044DD; }
        .cursor { display: inline-block; width: 3px; height: 2rem; background-color: #0044DD; margin-left: 4px; animation: blink 0.7s infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        .dynamic-sub { font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #5a5a6a; line-height: 1.6; }
        .step-dots { display: flex; align-items: center; gap: 0; margin-bottom: 20px; background: #0f1520; border-radius: 14px; padding: 12px 20px; }
        .step-dot-wrapper { display: flex; align-items: center; gap: 0; }
        .step-dot { width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; flex-shrink: 0; }
        .dot-active { transform: scale(1.15); }
        .dot-num { font-size: 0.7rem; font-weight: 700; color: #64748b; }
        .dot-label { font-size: 0.7rem; font-weight: 600; margin-left: 6px; white-space: nowrap; transition: color 0.3s; }
        .dot-connector { height: 2px; width: 36px; margin: 0 8px; transition: background 0.4s; flex-shrink: 0; }
        .progress-track { height: 4px; background: #e2e8f0; width: 100%; border-radius: 0; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 0; transition: width 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        .step-card { background: #fff; border-radius: 20px; border: 1px solid #e8ebf4; overflow: hidden; box-shadow: 0 8px 32px rgba(0,68,221,0.08), 0 1px 4px rgba(0,0,0,0.04); }
        .card-header { padding: 20px 24px 16px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 14px; }
        .icon-ring { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .card-label { display: flex; flex-direction: column; gap: 2px; }
        .card-title { font-size: 1rem; font-weight: 700; color: #111111; letter-spacing: -0.01em; }
        .card-sub { font-size: 0.78rem; color: #94a3b8; font-weight: 500; }
        .card-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 13px; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-label { font-family: 'Inter', sans-serif; font-size: 0.78rem; font-weight: 600; color: #475569; letter-spacing: 0.01em; }
        .req { color: #0044DD; margin-left: 2px; }
        .opt-tag { font-size: 0.72rem; color: #94a3b8; font-weight: 400; margin-left: 4px; }
        .form-input { font-family: 'Inter', sans-serif; font-size: 0.88rem; padding: 10px 13px; border-radius: 10px; border: 1px solid #cbd5e1; background: #f7f8fc; color: #111111; transition: all 0.18s; width: 100%; box-sizing: border-box; -moz-appearance: textfield; }
        .form-input::-webkit-outer-spin-button, .form-input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .form-input:focus { outline: none; border-color: #0044DD; background: #fff; box-shadow: 0 0 0 3px rgba(0,68,221,0.1); }
        .form-input::placeholder { color: #b0bac6; font-size: 0.84rem; }
        .section-divider { height: 1px; background: #eef1f8; margin: 2px 0; }
        .card-footer { padding: 16px 24px 22px; display: flex; align-items: center; gap: 12px; border-top: 1px solid #eef1f8; background: #f7f8fc; }
        .nav-btn { display: flex; align-items: center; gap: 7px; padding: 10px 18px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: #fff; font-family: 'Inter', sans-serif; font-size: 0.85rem; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.18s; white-space: nowrap; }
        .nav-btn:hover { border-color: #0044DD; color: #0044DD; background: #eff4ff; }
        .submit-btn { flex: 1; padding: 12px; border-radius: 12px; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 0.88rem; font-weight: 600; color: #fff; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.18s; }
        .submit-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
        .submit-btn:disabled { background: #94a3b8 !important; box-shadow: none !important; cursor: not-allowed; transform: none; filter: none; }
        .progress-label { font-size: 0.73rem; font-weight: 600; color: #94a3b8; text-align: right; padding: 4px 24px 0; }
        .live-status-banner { display: flex; align-items: center; gap: 12px; border-radius: 12px; padding: 12px 16px; font-family: 'Inter', sans-serif; font-size: 0.85rem; font-weight: 500; margin-bottom: 14px; border: 1px solid; }
        @keyframes slideInForward { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInBackward { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideOutForward { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(-40px); } }
        @keyframes slideOutBackward { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(40px); } }
        .slide-enter-forward { animation: slideInForward 0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
        .slide-enter-backward { animation: slideInBackward 0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
        .slide-exit-forward { animation: slideOutForward 0.28s ease forwards; }
        .slide-exit-backward { animation: slideOutBackward 0.28s ease forwards; }
        .success-card { background: #fff; border-radius: 20px; border: 1px solid #c7d7fb; padding: 48px 32px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; box-shadow: 0 8px 32px rgba(0,68,221,0.1); }
        .success-icon { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg,#0044DD,#0066FF); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,68,221,0.3); margin-bottom: 4px; }
        .success-title { font-family: 'DM Sans', sans-serif; font-size: 1.6rem; font-weight: 800; color: #111111; letter-spacing: -0.03em; }
        .success-sub { font-size: 0.9rem; color: #5a5a6a; line-height: 1.6; max-width: 380px; }
        @media (max-width: 860px) { .page-left { display: none; } .page-right { padding: 32px 16px; } }
        @media (max-width: 600px) { .dot-connector { width: 20px; } .dot-label { display: none; } }
      `}</style>

      <div className="page-left">
        <div className="brand-badge"><Sparkles size={11} /> Syntra AI</div>
        <h2 className="left-title">Your <span>digital twin</span> needs your data.</h2>
        <p className="left-sub">Log your vitals, capital, and career progress. Syntra updates your AI model in real time.</p>
        <div className="left-steps">
          {[{ label: "Health Matrix" }, { label: "Finance Ledger" }, { label: "Career Tracker" }, { label: "Batch Upload" }].map((s, i) => (
            <div className="left-step" key={i}>
              <div className="left-step-dot" style={{ background: i === step ? "#ffffff" : "rgba(255,255,255,0.35)", boxShadow: i === step ? "0 0 8px rgba(255,255,255,0.6)" : "none" }} />
              <span className={`left-step-text ${i === step ? "active" : ""}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="page-right">
        <div className="main-wrapper">
          <div className="exit-bar" onClick={() => router.push("/dashboard")}>
            <ArrowLeft size={14} /> <span>Return to Dashboard</span>
          </div>

          <div className="title-container">
            <h1 className="dynamic-title">
              <span className="title-accent">{typedTitle}</span>
              <span className="cursor" />
            </h1>
            <p className="dynamic-sub">Log your health indexes, capital status, and professional milestones.</p>
          </div>

          <StepDots current={step} completed={completed} />

          {message && !submitted && (
            <div className="live-status-banner" style={{ borderColor: "#c7d7fb", background: "#eff4ff", color: "#0044DD" }}>
              {isError(message) ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
              <span style={{ fontWeight: 600 }}>{message}</span>
            </div>
          )}

          {submitted ? (
            <div className="success-card">
              <div className="success-icon"><CheckCircle2 size={30} color="#fff" /></div>
              <h2 className="success-title">All Systems Synced</h2>
              <p className="success-sub">Your health matrix, financial ledger, and career metrics have been ingested. Your AI twin is updating now.</p>
            </div>
          ) : (
            <div className={`step-card ${animating ? (animDir === "forward" ? "slide-exit-forward" : "slide-exit-backward") : (animDir === "forward" ? "slide-enter-forward" : "slide-enter-backward")}`}>
              <ProgressBar pct={progress[step]} gradient={gradients[step]} />
              <div className="progress-label">{progress[step]}% complete</div>

              {step === 0 && (
                <>
                  <div className="card-header">
                    <div className="icon-ring" style={{ background: iconRings[0].bg, color: iconRings[0].color }}><HeartPulse size={20} /></div>
                    <div className="card-label">
                      <span className="card-title">Health Matrix</span>
                      <span className="card-sub">Biometric vital node sync</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="field-row">
                      <FormField label="Sleep Hours" req type="number" value={health.sleepHours} onChange={v => setHealth(p => ({ ...p, sleepHours: v }))} placeholder="7.5" />
                      <FormField label="Workout Mins" req type="number" value={health.workoutMinutes} onChange={v => setHealth(p => ({ ...p, workoutMinutes: v }))} placeholder="45" />
                    </div>
                    <FormField label="Stress Level (1–10)" req type="number" value={health.stressLevel} onChange={v => setHealth(p => ({ ...p, stressLevel: v }))} placeholder="e.g. 3" />
                    <div className="section-divider" />
                    <div className="field-row">
                      <FormField label="Mood Score" opt type="number" value={health.moodScore} onChange={v => setHealth(p => ({ ...p, moodScore: v }))} placeholder="1–10" />
                      <FormField label="Energy Level" opt type="number" value={health.energyLevel} onChange={v => setHealth(p => ({ ...p, energyLevel: v }))} placeholder="1–10" />
                    </div>
                    <div className="field-row">
                      <FormField label="Calories" opt type="number" value={health.caloriesConsumed} onChange={v => setHealth(p => ({ ...p, caloriesConsumed: v }))} placeholder="e.g. 2100" />
                      <FormField label="Cal. Goal" opt type="number" value={health.calorieGoal} onChange={v => setHealth(p => ({ ...p, calorieGoal: v }))} placeholder="e.g. 2400" />
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="card-header">
                    <div className="icon-ring" style={{ background: iconRings[1].bg, color: iconRings[1].color }}><Wallet size={20} /></div>
                    <div className="card-label">
                      <span className="card-title">Finance Ledger</span>
                      <span className="card-sub">Capital trajectory logs</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <FormField label="Amount Saved" req type="number" value={finance.amountSaved} onChange={v => setFinance(p => ({ ...p, amountSaved: v }))} placeholder="e.g. 350" />
                    <FormField label="Discretionary Spending" req type="number" value={finance.discretionarySpent} onChange={v => setFinance(p => ({ ...p, discretionarySpent: v }))} placeholder="e.g. 60" />
                    <div className="field">
                      <label className="form-label">Spending Category</label>
                      <select value={finance.spendingCategory} onChange={e => setFinance(p => ({ ...p, spendingCategory: e.target.value }))} className="form-input" style={{ height: 42 }}>
                        <option value="food">Food & Staples</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="shopping">Shopping</option>
                        <option value="transport">Transport</option>
                        <option value="other">Other Outlays</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="card-header">
                    <div className="icon-ring" style={{ background: iconRings[2].bg, color: iconRings[2].color }}><Briefcase size={20} /></div>
                    <div className="card-label">
                      <span className="card-title">Career Progression</span>
                      <span className="card-sub">Productivity index tracking</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="field-row">
                      <FormField label="Hours Studied" req type="number" value={career.hoursStudied} onChange={v => setCareer(p => ({ ...p, hoursStudied: v }))} placeholder="e.g. 5" />
                      <FormField label="Productivity (1–10)" req type="number" value={career.productivityRating} onChange={v => setCareer(p => ({ ...p, productivityRating: v }))} placeholder="e.g. 8" />
                    </div>
                    <FormField label="Sessions Completed" opt type="number" value={career.sessionsCompleted} onChange={v => setCareer(p => ({ ...p, sessionsCompleted: v }))} placeholder="e.g. 3" />
                    <FormField label="Course Name" opt type="text" value={career.courseName} onChange={v => setCareer(p => ({ ...p, courseName: v }))} placeholder="e.g. ML Fundamentals" />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="card-header">
                    <div className="icon-ring" style={{ background: iconRings[3].bg, color: iconRings[3].color }}><Upload size={20} /></div>
                    <div className="card-label">
                      <span className="card-title">Batch Integration Console</span>
                      <span className="card-sub">Optional — inject dataset updates via file ingestion</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="field">
                      <label className="form-label">Domain Target Channel</label>
                      <select value={csv.domain} onChange={e => setCsv(p => ({ ...p, domain: e.target.value }))} className="form-input" style={{ height: 42 }}>
                        <option value="health">Health Data Matrices</option>
                        <option value="finance">Finance Allocation Indexes</option>
                        <option value="career">Career Metric Columns</option>
                      </select>
                    </div>
                    <div className="field">
                      <label className="form-label">Select Source Document <span className="opt-tag">(optional)</span></label>
                      <input type="file" accept=".csv" onChange={e => setCsv(p => ({ ...p, file: e.target.files?.[0] || null }))} className="form-input" style={{ padding: "9px 12px", height: 42 }} />
                    </div>
                    {csv.file && (
                      <div style={{ fontSize: "0.8rem", color: "#0044DD", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                        <CheckCircle2 size={14} /> {csv.file.name} ready for ingestion
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="card-footer">
                {step > 0 && (
                  <button className="nav-btn" onClick={handleBack} disabled={loading}>
                    <ChevronLeft size={15} /> Back
                  </button>
                )}
                {step < 3 ? (
                  <button className="submit-btn" onClick={handleNext} disabled={loading || !canNext} style={{ background: canNext ? btnGradients[step] : undefined, boxShadow: canNext ? btnShadows[step] : undefined, opacity: canNext ? 1 : 0.5 }}>
                    Next Step <ArrowRight size={15} />
                  </button>
                ) : (
                  <button className="submit-btn" onClick={submitAll} disabled={loading} style={{ background: btnGradients[3], boxShadow: btnShadows[3] }}>
                    <Sparkles size={14} /> {loading ? "Syncing all data..." : "Submit & Sync Twin"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}