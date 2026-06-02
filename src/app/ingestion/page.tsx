"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  HeartPulse, Wallet, Briefcase, ArrowLeft, Zap,
  Droplets, Moon, Dumbbell, Activity, TrendingUp,
  AlertTriangle, CheckCircle2, Send, Upload, MessageSquare,
  Sparkles, Heart, Star,
} from "lucide-react";

/* ─── TYPES ─────────────────────────────────────────────────────── */
interface HealthData {
  sleepHours: number; workoutMinutes: number; stressLevel: number;
  moodScore: number; energyLevel: number; waterGlasses: number;
  skippedMeals: string[]; caloriesConsumed: string;
  calorieGoal: string; mealsEatenToday: string;
}
interface FinanceData {
  amountSaved: string; discretionarySpent: string; spendingCategory: string;
  biggestExpenseToday: string; impulseSpend: boolean;
}
interface CareerData {
  hoursStudied: string; productivityRating: number; sessionsCompleted: string;
  courseName: string; goalWorkedOn: string; blockerToday: string;
}
interface LatestData {
  health: { data: any; date: string } | null;
  finance: { data: any; date: string } | null;
  career: { data: any; date: string } | null;
  reflection: { data: any; date: string } | null;
}

/* ─── SCORE PREVIEW ──────────────────────────────────────────────── */
function previewHealthScore(h: HealthData) {
  let s = 0;
  if (h.sleepHours >= 7 && h.sleepHours <= 9) s += 40;
  else if (h.sleepHours >= 6) s += 20; else s += 5;
  if (h.workoutMinutes >= 60) s += 40;
  else if (h.workoutMinutes >= 30) s += 25;
  else if (h.workoutMinutes > 0) s += 10;
  s += Math.max(0, 20 - h.stressLevel * 2);
  if (h.waterGlasses >= 8) s += 5; else if (h.waterGlasses <= 2) s -= 3;
  return Math.max(0, Math.min(100, s));
}
function previewFinanceScore(f: FinanceData) {
  let s = 50;
  const saved = Number(f.amountSaved) || 0;
  const spent = Number(f.discretionarySpent) || 0;
  if (saved >= 100) s += 30; else if (saved > 0) s += 15;
  if (spent === 0) s += 20; else if (spent < 50) s += 10; else if (spent > 100) s -= 20;
  if (f.impulseSpend) s -= 5;
  return Math.max(0, Math.min(100, s));
}
function previewCareerScore(c: CareerData) {
  let s = 0;
  const hrs = Number(c.hoursStudied) || 0;
  if (hrs >= 4) s += 50; else if (hrs >= 2) s += 30; else if (hrs > 0) s += 10;
  s += c.productivityRating * 5;
  return Math.max(0, Math.min(100, s));
}

const fmtDate = (d: string) => {
  const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  const dd = Math.floor(h / 24);
  return dd === 1 ? "Yesterday" : `${dd}d ago`;
};

/* ─── TYPEWRITER ─────────────────────────────────────────────────── */
function TypewriterTitle() {
  const [text, setText] = useState("");
  useEffect(() => {
    const full = "Today's Check-in";
    let i = 0; let del = false; let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (!del) {
        setText(full.slice(0, i + 1)); i++;
        if (i === full.length) { del = true; t = setTimeout(tick, 3500); }
        else t = setTimeout(tick, 95);
      } else {
        setText(full.slice(0, i - 1)); i--;
        if (i === 0) { del = false; t = setTimeout(tick, 600); }
        else t = setTimeout(tick, 42);
      }
    };
    t = setTimeout(tick, 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <h1 className="page-title">
      <span className="title-blue">{text}</span>
      <span className="title-cursor" />
    </h1>
  );
}

/* ─── SLIDER ─────────────────────────────────────────────────────── */
function Slider({ label, value, onChange, min, max, step, icon, unit, color, hint }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number;
  icon: React.ReactNode; unit?: string; color: string; hint?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="slider-box">
      <div className="slider-row-top">
        <div className="slider-label-group">
          <span className="slider-icon-wrap" style={{ color }}>{icon}</span>
          <span className="slider-label">{label}</span>
        </div>
        <span className="slider-badge" style={{ background: `${color}14`, color, border: `1px solid ${color}28` }}>
          {value}{unit}
        </span>
      </div>
      <div className="slider-track-outer">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="range-inp"
          style={{ "--c": color, "--p": `${pct}%` } as React.CSSProperties}
        />
      </div>
      <div className="slider-ends">
        <span>{min}{unit}</span>
        {hint && <span className="slider-hint">{hint}</span>}
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

/* ─── TEXT FIELD ─────────────────────────────────────────────────── */
function Field({ label, req, opt, type = "text", value, onChange, placeholder, textarea, note }: {
  label: string; req?: boolean; opt?: boolean; type?: string;
  value: string; onChange: (v: string) => void; placeholder?: string;
  textarea?: boolean; note?: string;
}) {
  return (
    <div className="field-box">
      <label className="field-label">
        {label}
        {req && <span className="req-dot"> *</span>}
        {opt && <span className="opt-txt"> — optional</span>}
      </label>
      {note && <span className="field-note">{note}</span>}
      {textarea
        ? <textarea className="f-input f-textarea" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
        : <input type={type} className="f-input" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
      }
    </div>
  );
}

/* ─── PROCESSING SCREEN ──────────────────────────────────────────── */
function ProcessingScreen() {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: "🏃", text: "Looking at your health data..." },
    { icon: "💰", text: "Reviewing your spending & savings..." },
    { icon: "📚", text: "Checking your study progress..." },
    { icon: "🧠", text: "Understanding how you felt today..." },
    { icon: "✨", text: "Building your personal insights..." },
    { icon: "🎯", text: "Your dashboard is ready!" },
  ];
  const pct = Math.round((step / (steps.length - 1)) * 100);

  useEffect(() => {
    const iv = setInterval(() => setStep(p => p < steps.length - 1 ? p + 1 : p), 650);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="proc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        .proc-root{
          min-height:100vh;
          background:#f0f2f8;
          font-family:"Inter","DM Sans",sans-serif;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:24px;
        }

        .proc-card{
          background:#fff;
          border:1px solid #e2e8f2;
          border-radius:28px;
          padding:48px 40px;
          max-width:480px;
          width:100%;
          box-shadow:0 12px 48px rgba(0,68,221,0.1),0 2px 8px rgba(0,0,0,0.04);
          display:flex;
          flex-direction:column;
          align-items:center;
          text-align:center;
        }

        .proc-logo{
          font-family:"DM Sans",sans-serif;
          font-size:0.85rem;
          font-weight:700;
          color:#0044DD;
          letter-spacing:0.15em;
          text-transform:uppercase;
          margin-bottom:36px;
          display:flex;
          align-items:center;
          gap:7px;
        }
        .proc-logo-dot{
          width:7px;height:7px;border-radius:50%;
          background:#0044DD;
          box-shadow:0 0 8px rgba(0,68,221,0.6);
          animation:ldot 1.6s ease-in-out infinite;
        }
        @keyframes ldot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.7)}}

        .proc-emoji-wrap{
          width:96px;height:96px;
          background:linear-gradient(135deg,#eff4ff,#e0e7ff);
          border:2px solid #dbeafe;
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          font-size:2.4rem;
          margin-bottom:28px;
          animation:emojiPop 0.4s cubic-bezier(0.16,1,0.3,1);
          position:relative;
        }
        @keyframes emojiPop{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}
        .proc-emoji-ring{
          position:absolute;inset:-6px;border-radius:50%;
          border:2px solid rgba(0,68,221,0.15);
          animation:ringPulse 2s ease-in-out infinite;
        }
        @keyframes ringPulse{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.06);opacity:1}}

        .proc-step-text{
          font-family:"DM Sans",sans-serif;
          font-size:1.4rem;
          font-weight:800;
          color:#0d1117;
          letter-spacing:-0.02em;
          margin-bottom:8px;
          animation:fadeUp 0.35s ease;
          min-height:38px;
        }
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

        .proc-sub{
          font-size:0.85rem;
          color:#64748b;
          line-height:1.6;
          margin-bottom:36px;
        }

        .proc-bar-wrap{
          width:100%;
          background:#f0f2f8;
          border-radius:9999px;
          height:8px;
          overflow:hidden;
          margin-bottom:12px;
        }
        .proc-bar-fill{
          height:100%;
          border-radius:9999px;
          background:linear-gradient(90deg,#0044DD,#0066FF);
          transition:width 0.65s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow:0 0 12px rgba(0,68,221,0.3);
        }
        .proc-pct{
          font-size:0.76rem;
          font-weight:700;
          color:#0044DD;
          margin-bottom:28px;
        }

        .proc-steps-list{
          width:100%;
          display:flex;
          flex-direction:column;
          gap:8px;
        }
        .proc-step-row{
          display:flex;
          align-items:center;
          gap:10px;
          padding:10px 14px;
          border-radius:12px;
          font-size:0.82rem;
          font-weight:500;
          color:#94a3b8;
          transition:all 0.3s;
        }
        .proc-step-row.done{
          background:#f0fdf4;
          border:1px solid #bbf7d0;
          color:#15803d;
          font-weight:600;
        }
        .proc-step-row.active{
          background:#eff4ff;
          border:1px solid #dbeafe;
          color:#0044DD;
          font-weight:700;
        }
        .proc-step-row.pending{
          background:#f8fafc;
          border:1px solid transparent;
          color:#b0bac6;
        }
        .proc-step-icon{font-size:1rem;}
        .proc-check{color:#22c55e;display:flex;}
        .proc-dot-ind{width:7px;height:7px;border-radius:50%;background:#0044DD;animation:ldot 0.9s ease-in-out infinite;}

        .proc-tip{
          margin-top:28px;
          padding:14px 18px;
          background:#f8fafc;
          border:1px solid #e2e8f2;
          border-radius:14px;
          font-size:0.78rem;
          color:#64748b;
          line-height:1.55;
          font-style:italic;
          max-width:360px;
        }
      `}</style>

      <div className="proc-card">
        <div className="proc-logo">
          <div className="proc-logo-dot" />
          Syntra
        </div>

        <div className="proc-emoji-wrap">
          <div className="proc-emoji-ring" />
          <span key={step}>{steps[step].icon}</span>
        </div>

        <div className="proc-step-text" key={`text-${step}`}>{steps[step].text}</div>
        <p className="proc-sub">
          {pct < 100
            ? "Hang tight — we're making sense of your day so you don't have to."
            : "All done! Taking you to your dashboard now."}
        </p>

        <div className="proc-bar-wrap">
          <div className="proc-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="proc-pct">{pct}% complete</div>

        <div className="proc-steps-list">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`proc-step-row ${i < step ? "done" : i === step ? "active" : "pending"}`}
            >
              <span className="proc-step-icon">{s.icon}</span>
              <span style={{ flex: 1 }}>{s.text}</span>
              {i < step && <span className="proc-check"><CheckCircle2 size={14} /></span>}
              {i === step && <span className="proc-dot-ind" />}
            </div>
          ))}
        </div>

        <div className="proc-tip">
          💡 Tip: The more consistently you log, the smarter your insights become over time.
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────── */
export default function IngestionPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [todayLogged, setTodayLogged] = useState(false);
  const [latest, setLatest] = useState<LatestData | null>(null);
  const [currentScores, setCurrentScores] = useState({ health: 50, finance: 50, career: 50 });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDomain, setUploadDomain] = useState<"health" | "finance" | "career">("health");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [dailyNote, setDailyNote] = useState("");

  const [health, setHealth] = useState<HealthData>({
    sleepHours: 0, workoutMinutes: 0, stressLevel: 1, moodScore: 5,
    energyLevel: 5, waterGlasses: 0, skippedMeals: [],
    caloriesConsumed: "", calorieGoal: "", mealsEatenToday: "",
  });
  const [finance, setFinance] = useState<FinanceData>({
    amountSaved: "", discretionarySpent: "", spendingCategory: "food",
    biggestExpenseToday: "", impulseSpend: false,
  });
  const [career, setCareer] = useState<CareerData>({
    hoursStudied: "", productivityRating: 5, sessionsCompleted: "",
    courseName: "", goalWorkedOn: "", blockerToday: "",
  });

  const pH = useMemo(() => previewHealthScore(health), [health]);
  const pF = useMemo(() => previewFinanceScore(finance), [finance]);
  const pC = useMemo(() => previewCareerScore(career), [career]);

  useEffect(() => {
    setMounted(true);
    fetch("/api/log/latest", { credentials: "include" })
      .then(r => r.json()).then(d => {
        if (!d.success) return;
        setLatest(d.latest);
        if (d.scores) setCurrentScores(d.scores);
        const isT = (s: string) => new Date(s).toDateString() === new Date().toDateString();
        if ((d.latest?.health && isT(d.latest.health.date)) ||
          (d.latest?.finance && isT(d.latest.finance.date)) ||
          (d.latest?.career && isT(d.latest.career.date))) setTodayLogged(true);
        if (d.latest?.health && isT(d.latest.health.date)) {
          const h = d.latest.health.data;
          setHealth({ sleepHours: h.sleepHours ?? 0, workoutMinutes: h.workoutMinutes ?? 0, stressLevel: h.stressLevel ?? 1, moodScore: h.moodScore ?? 5, energyLevel: h.energyLevel ?? 5, waterGlasses: h.waterGlasses ?? 0, skippedMeals: h.skippedMeals ?? [], caloriesConsumed: h.caloriesConsumed != null ? String(h.caloriesConsumed) : "", calorieGoal: h.calorieGoal != null ? String(h.calorieGoal) : "", mealsEatenToday: h.mealsEatenToday ?? "" });
        }
        if (d.latest?.finance && isT(d.latest.finance.date)) {
          const f = d.latest.finance.data;
          setFinance({ amountSaved: f.amountSaved != null ? String(f.amountSaved) : "", discretionarySpent: f.discretionarySpent != null ? String(f.discretionarySpent) : "", spendingCategory: f.spendingCategory ?? "food", biggestExpenseToday: f.biggestExpenseToday ?? "", impulseSpend: f.impulseSpend ?? false });
        }
        if (d.latest?.career && isT(d.latest.career.date)) {
          const c = d.latest.career.data;
          setCareer({ hoursStudied: c.hoursStudied != null ? String(c.hoursStudied) : "", productivityRating: c.productivityRating ?? 5, sessionsCompleted: c.sessionsCompleted != null ? String(c.sessionsCompleted) : "", courseName: c.courseName ?? "", goalWorkedOn: c.goalWorkedOn ?? "", blockerToday: c.blockerToday ?? "" });
        }
        if (d.latest?.reflection && isT(d.latest.reflection.date)) setDailyNote(d.latest.reflection.data?.note ?? "");
      }).catch(() => { });
  }, []);

  const toggleMeal = useCallback((m: string) =>
    setHealth(p => ({ ...p, skippedMeals: p.skippedMeals.includes(m) ? p.skippedMeals.filter(x => x !== m) : [...p.skippedMeals, m] })), []);

  const canSubmit = health.sleepHours > 0 && !!finance.amountSaved && !!finance.discretionarySpent && !!career.hoursStudied;

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true); setMessage("");
    try {
      const res = await fetch("/api/log/daily", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({
          health: { sleepHours: health.sleepHours, workoutMinutes: health.workoutMinutes, stressLevel: health.stressLevel, moodScore: health.moodScore || undefined, energyLevel: health.energyLevel || undefined, waterGlasses: health.waterGlasses || undefined, skippedMeals: health.skippedMeals.length ? health.skippedMeals : undefined, caloriesConsumed: health.caloriesConsumed ? Number(health.caloriesConsumed) : undefined, calorieGoal: health.calorieGoal ? Number(health.calorieGoal) : undefined, mealsEatenToday: health.mealsEatenToday.trim() || undefined },
          finance: { amountSaved: Number(finance.amountSaved), discretionarySpent: Number(finance.discretionarySpent), spendingCategory: finance.spendingCategory || undefined, biggestExpenseToday: finance.biggestExpenseToday || undefined, impulseSpend: finance.impulseSpend || undefined },
          career: { hoursStudied: Number(career.hoursStudied), productivityRating: career.productivityRating, sessionsCompleted: career.sessionsCompleted ? Number(career.sessionsCompleted) : undefined, courseName: career.courseName || undefined, goalWorkedOn: career.goalWorkedOn || undefined, blockerToday: career.blockerToday || undefined },
          dailyNote: dailyNote.trim() || undefined,
        }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.message || "Submission failed.");
      window.dispatchEvent(new Event("syntra-refresh"));
      setLoading(false); setProcessing(true);
      setTimeout(() => router.push("/dashboard"), 4200);
    } catch (err: any) { setMessage(err.message || "Submission failed."); setLoading(false); }
  };

  const handleUpload = async () => {
    if (!uploadFile) { setUploadMsg({ text: "Select a file first.", ok: false }); return; }
    setUploadLoading(true); setUploadMsg(null);
    const fd = new FormData(); fd.append("file", uploadFile); fd.append("domain", uploadDomain);
    try {
      const res = await fetch(uploadFile.name.endsWith(".csv") ? "/api/upload/csv" : "/api/upload/excel", { method: "POST", body: fd, credentials: "include" });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.message || "Upload failed.");
      setUploadMsg({ text: d.message || "File uploaded successfully!", ok: true });
      setUploadFile(null);
      const fi = document.getElementById("file-inp") as HTMLInputElement;
      if (fi) fi.value = "";
      window.dispatchEvent(new Event("syntra-refresh"));
    } catch (err: any) { setUploadMsg({ text: err.message || "Upload failed.", ok: false }); }
    finally { setUploadLoading(false); }
  };

  if (!mounted) return null;
  if (processing) return <ProcessingScreen />;

  const PROMPTS = [
    "What was the best part of your day?",
    "What's one thing you'd do differently today?",
    "Describe how you feel right now in one sentence.",
    "What are you grateful for today?",
    "What's on your mind right now?",
  ];
  const prompt = PROMPTS[new Date().getDate() % PROMPTS.length];

  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#f0f2f8;font-family:"Inter","DM Sans",sans-serif;-webkit-font-smoothing:antialiased;}

        .root{min-height:100vh;background:#f0f2f8;padding-bottom:100px;}

        /* ── BACK BTN ── */
        .back-btn{display:inline-flex;align-items:center;gap:7px;font-size:0.82rem;font-weight:600;color:#64748b;cursor:pointer;padding:8px 16px;border-radius:9999px;border:1.5px solid #e2e8f2;background:#fff;transition:all 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.05);text-decoration:none;}
        .back-btn:hover{color:#0044DD;border-color:#c0d0f8;background:#eff4ff;transform:translateX(-2px);}

        /* ── PAGE HEADER ── */
        .page-header{max-width:780px;margin:0 auto;padding:40px 24px 20px;}
        .page-title{font-family:"DM Sans",sans-serif;font-size:clamp(1.9rem,4.5vw,2.5rem);font-weight:800;color:#0d1117;letter-spacing:-0.04em;margin-bottom:8px;display:flex;align-items:center;line-height:1.15;}
        .title-blue{color:#0044DD;}
        .title-cursor{display:inline-block;width:3px;height:2.1rem;background:#0044DD;margin-left:4px;vertical-align:middle;animation:blink 0.85s step-end infinite;}
        @keyframes blink{50%{opacity:0}}
        .page-sub{font-size:0.9rem;color:#64748b;line-height:1.65;font-weight:400;max-width:520px;}

        /* ── BANNER ── */
        .banner-section{max-width:780px;margin:0 auto;padding:0 24px 16px;}
        .today-banner{display:flex;align-items:center;gap:10px;background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:14px;padding:13px 18px;font-size:0.84rem;font-weight:600;color:#15803d;}
        .today-banner-icon{width:30px;height:30px;background:#dcfce7;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#16a34a;}

        /* ── SNAPSHOT ── */
        .snap-section{max-width:780px;margin:0 auto;padding:0 24px 8px;}
        .snap-label{font-size:0.72rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;display:flex;align-items:center;gap:6px;}
        .snap-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
        .snap-card{background:#fff;border:1px solid #e2e8f2;border-radius:14px;padding:14px 16px;box-shadow:0 2px 8px rgba(0,0,0,0.03);transition:all 0.2s;}
        .snap-card:hover{box-shadow:0 4px 16px rgba(0,68,221,0.08);transform:translateY(-1px);}
        .snap-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
        .snap-domain{font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.07em;}
        .snap-time{font-size:0.65rem;color:#94a3b8;font-weight:500;background:#f8fafc;padding:2px 7px;border-radius:6px;}
        .snap-vals{display:flex;flex-direction:column;gap:4px;}
        .snap-val{font-size:0.76rem;color:#64748b;font-weight:500;display:flex;justify-content:space-between;}
        .snap-val strong{color:#111;font-weight:700;}
        .snap-empty{font-size:0.74rem;color:#94a3b8;font-style:italic;}

        /* ── FORM WRAPPER ── */
        .form-wrap{max-width:780px;margin:0 auto;padding:0 24px;display:flex;flex-direction:column;gap:16px;}

        /* ── SECTION CARD ── */
        .sec-card{background:#fff;border:1px solid #e2e8f2;border-radius:22px;overflow:hidden;box-shadow:0 4px 20px rgba(0,68,221,0.06),0 1px 4px rgba(0,0,0,0.04);transition:box-shadow 0.25s;}
        .sec-card:hover{box-shadow:0 8px 32px rgba(0,68,221,0.09),0 2px 8px rgba(0,0,0,0.05);}
        .sec-stripe{height:3px;}
        .sec-head{padding:20px 24px 16px;display:flex;align-items:center;gap:14px;border-bottom:1px solid #f4f6fb;}
        .sec-icon{width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .sec-title{font-family:"DM Sans",sans-serif;font-size:1rem;font-weight:800;color:#0d1117;letter-spacing:-0.01em;}
        .sec-sub{font-size:0.74rem;color:#94a3b8;font-weight:500;margin-top:2px;}
        .sec-body{padding:22px 24px;display:flex;flex-direction:column;gap:20px;}

        /* ── SLIDER ── */
        .slider-box{display:flex;flex-direction:column;gap:9px;}
        .slider-row-top{display:flex;justify-content:space-between;align-items:center;}
        .slider-label-group{display:flex;align-items:center;gap:8px;}
        .slider-icon-wrap{display:flex;align-items:center;}
        .slider-label{font-size:0.82rem;font-weight:600;color:#374151;}
        .slider-badge{font-size:0.82rem;font-weight:800;padding:4px 12px;border-radius:9999px;font-family:"JetBrains Mono",monospace;}
        .slider-track-outer{padding:4px 0;}
        .range-inp{-webkit-appearance:none;appearance:none;width:100%;height:7px;border-radius:9999px;outline:none;cursor:pointer;background:linear-gradient(to right, var(--c) 0%, var(--c) var(--p), #e8edf5 var(--p), #e8edf5 100%);transition:background 0.1s;}
        .range-inp::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#fff;border:2.5px solid var(--c);box-shadow:0 2px 8px rgba(0,0,0,0.14),0 0 0 0 var(--c);cursor:grab;transition:all 0.15s;}
        .range-inp::-webkit-slider-thumb:active{cursor:grabbing;transform:scale(1.18);box-shadow:0 2px 12px rgba(0,0,0,0.18),0 0 0 4px color-mix(in srgb, var(--c) 20%, transparent);}
        .range-inp::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:#fff;border:2.5px solid var(--c);box-shadow:0 2px 8px rgba(0,0,0,0.14);cursor:grab;}
        .slider-ends{display:flex;justify-content:space-between;align-items:center;font-size:0.67rem;color:#b0bac6;font-weight:500;}
        .slider-hint{font-size:0.67rem;color:#94a3b8;font-style:italic;}

        /* ── SLIDER GRIDS ── */
        .sg-2{display:grid;grid-template-columns:1fr 1fr;gap:22px;}
        .sg-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:22px;}

        /* ── INPUT FIELD ── */
        .fg-2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .field-box{display:flex;flex-direction:column;gap:5px;}
        .field-label{font-size:0.8rem;font-weight:600;color:#374151;}
        .req-dot{color:#0044DD;}
        .opt-txt{font-size:0.72rem;font-weight:400;color:#94a3b8;}
        .field-note{font-size:0.72rem;color:#94a3b8;margin-bottom:1px;}
        .f-input{font-family:"Inter",sans-serif;font-size:0.86rem;padding:11px 14px;border-radius:12px;border:1.5px solid #e2e8f2;background:#f8fafc;color:#111;transition:all 0.18s;width:100%;-moz-appearance:textfield;}
        .f-input::-webkit-outer-spin-button,.f-input::-webkit-inner-spin-button{-webkit-appearance:none;}
        .f-input:focus{outline:none;border-color:#0044DD;background:#fff;box-shadow:0 0 0 3px rgba(0,68,221,0.09);}
        .f-input::placeholder{color:#b8c2d0;}
        .f-textarea{min-height:76px;resize:vertical;line-height:1.55;}
        select.f-input{cursor:pointer;height:44px;}

        /* ── DIVIDER ── */
        .s-div{height:1px;background:#f4f6fb;}

        /* ── PILLS ── */
        .pill-wrap{display:flex;flex-direction:column;gap:8px;}
        .pill-lbl{font-size:0.8rem;font-weight:600;color:#374151;}
        .pill-row{display:flex;flex-wrap:wrap;gap:7px;}
        .pill{padding:8px 16px;border-radius:9999px;border:1.5px solid #e2e8f2;background:#f8fafc;color:#64748b;font-size:0.78rem;font-weight:600;cursor:pointer;transition:all 0.18s;font-family:"Inter",sans-serif;}
        .pill:hover{border-color:#c0d0f8;background:#f0f4ff;}
        .pill.on{border-color:transparent;color:#fff;}

        /* ── TOGGLE ── */
        .toggle-row{display:flex;align-items:center;gap:12px;padding:13px 16px;border-radius:13px;background:#f8fafc;border:1.5px solid #e2e8f2;cursor:pointer;transition:all 0.2s;user-select:none;}
        .toggle-row:hover{border-color:#c0d0f8;}
        .toggle-row.tw{background:#fef2f2;border-color:#fca5a5;}
        .tsw{width:40px;height:22px;border-radius:9999px;background:#dde3ef;position:relative;flex-shrink:0;transition:background 0.22s;}
        .tsw.on{background:#ef4444;}
        .tknob{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);transition:left 0.22s;}
        .tsw.on .tknob{left:21px;}
        .ttxt{font-size:0.82rem;font-weight:600;color:#475569;}
        .toggle-row.tw .ttxt{color:#dc2626;}

        /* ── DOMAIN PILLS ── */
        .dp-row{display:flex;gap:8px;flex-wrap:wrap;}
        .dp{padding:8px 18px;border-radius:9999px;border:1.5px solid #e2e8f2;background:#f8fafc;color:#64748b;font-size:0.78rem;font-weight:600;cursor:pointer;transition:all 0.18s;font-family:"Inter",sans-serif;}
        .dp:hover{border-color:#c0d0f8;}
        .dp.on{background:#0044DD;border-color:#0044DD;color:#fff;}

        /* ── DROPZONE ── */
        .dropzone{border:2px dashed #dde3ef;border-radius:14px;padding:26px 16px;text-align:center;cursor:pointer;background:#f8fafc;transition:all 0.2s;display:flex;flex-direction:column;align-items:center;gap:7px;}
        .dropzone:hover{border-color:#0044DD;background:#eff4ff;}
        .dz-text{font-size:0.86rem;color:#64748b;font-weight:500;}
        .dz-sub{font-size:0.72rem;color:#94a3b8;}
        .upload-msg{display:flex;align-items:center;gap:8px;padding:11px 15px;border-radius:11px;font-size:0.8rem;font-weight:600;}
        .upload-msg.ok{background:#f0fdf4;border:1px solid #bbf7d0;color:#15803d;}
        .upload-msg.err{background:#fef2f2;border:1px solid #fca5a5;color:#dc2626;}
        .upload-btn{width:100%;padding:12px;border-radius:12px;border:none;cursor:pointer;font-family:"Inter",sans-serif;font-size:0.86rem;font-weight:700;color:#fff;background:linear-gradient(135deg,#0044DD,#0066FF);display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;}
        .upload-btn:hover:not(:disabled){filter:brightness(1.07);transform:translateY(-1px);}
        .upload-btn:disabled{background:#94a3b8!important;cursor:not-allowed;transform:none;}

        /* ── SCORE PREVIEW ── */
        .score-section{max-width:780px;margin:8px auto 0;padding:0 24px;}
        .score-lbl{font-size:0.72rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;display:flex;align-items:center;gap:6px;}
        .score-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
        .score-card{background:#fff;border:1px solid #e2e8f2;border-radius:16px;padding:16px 18px;display:flex;align-items:center;gap:12px;box-shadow:0 2px 8px rgba(0,0,0,0.03);transition:all 0.2s;}
        .score-card:hover{box-shadow:0 4px 16px rgba(0,68,221,0.08);}
        .score-icon{display:flex;}
        .score-info{display:flex;flex-direction:column;gap:2px;}
        .score-name{font-size:0.68rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;}
        .score-nums{display:flex;align-items:center;gap:6px;}
        .score-old{font-size:0.88rem;font-weight:600;color:#94a3b8;}
        .score-arr{font-size:0.75rem;color:#c8d0dc;}
        .score-new{font-size:1rem;font-weight:800;font-family:"JetBrains Mono",monospace;}
        .score-diff{font-size:0.7rem;font-weight:700;padding:2px 7px;border-radius:6px;font-family:"JetBrains Mono",monospace;}
        .d-up{background:#ecfdf5;color:#10b981;}
        .d-dn{background:#fef2f2;color:#ef4444;}

        /* ── SUBMIT ── */
        .submit-section{max-width:780px;margin:20px auto 0;padding:0 24px;}
        .submit-btn{width:100%;padding:17px;border-radius:16px;border:none;cursor:pointer;font-family:"DM Sans",sans-serif;font-size:1rem;font-weight:800;color:#fff;background:linear-gradient(135deg,#0044DD,#0066FF);box-shadow:0 6px 24px rgba(0,68,221,0.28);display:flex;align-items:center;justify-content:center;gap:10px;transition:all 0.22s;letter-spacing:-0.01em;}
        .submit-btn:hover:not(:disabled){filter:brightness(1.06);transform:translateY(-2px);box-shadow:0 10px 32px rgba(0,68,221,0.35);}
        .submit-btn:disabled{background:#94a3b8!important;box-shadow:none!important;cursor:not-allowed;transform:none;}
        .submit-note{text-align:center;font-size:0.74rem;color:#94a3b8;margin-top:10px;font-weight:500;}
        .err-wrap{max-width:780px;margin:12px auto 0;padding:0 24px;}
        .err-box{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:12px;background:#fef2f2;border:1px solid #fecaca;color:#dc2626;font-size:0.84rem;font-weight:600;}

        /* ── NOTE COUNTER ── */
        .note-counter{text-align:right;font-size:0.68rem;color:#94a3b8;margin-top:4px;}
        .note-prompt-text{font-size:0.8rem;color:#94a3b8;font-style:italic;margin-bottom:8px;}

        @media(max-width:640px){
          .sg-2,.sg-3,.fg-2,.snap-grid,.score-grid{grid-template-columns:1fr;}
          .form-wrap,.page-header,.snap-section,.banner-section,.score-section,.submit-section,.err-wrap{padding-left:16px;padding-right:16px;}
        }
      `}</style>

      {/* ── PAGE HEADER ── */}
      <div className="page-header">
        <button className="back-btn" onClick={() => router.push("/dashboard")}>
          <ArrowLeft size={14} /> Return to Dashboard
        </button>
        <div style={{ height: 20 }} />
        <TypewriterTitle />
        <p className="page-sub">Fill in what happened today — your health, money, and learning. The more you share, the better your insights.</p>
      </div>

      {/* ── TODAY BANNER ── */}
      {todayLogged && (
        <div className="banner-section">
          <div className="today-banner">
            <div className="today-banner-icon"><CheckCircle2 size={16} /></div>
            <div>
              <strong>Already logged today.</strong> Your earlier entries are pre-filled below — update anything and hit Save to overwrite.
            </div>
          </div>
        </div>
      )}

      {/* ── LAST LOG SNAPSHOT ── */}
      {latest && (latest.health || latest.finance || latest.career) && (
        <div className="snap-section">
          <div className="snap-label">
            {todayLogged ? <><CheckCircle2 size={11} /> Today's entries</> : <>📋 Last saved log</>}
            {!todayLogged && <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#b0bac6", fontSize: "0.68rem" }}>— you haven't logged today yet</span>}
          </div>
          <div className="snap-grid">
            {[
              { domain: "Health", color: "#0044DD", data: latest.health, vals: latest.health ? [{ k: "Sleep", v: `${latest.health.data.sleepHours}h` }, { k: "Workout", v: `${latest.health.data.workoutMinutes}m` }, { k: "Stress", v: `${latest.health.data.stressLevel}/10` }] : [] },
              { domain: "Finance", color: "#0055EE", data: latest.finance, vals: latest.finance ? [{ k: "Saved", v: `₹${latest.finance.data.amountSaved}` }, { k: "Spent", v: `₹${latest.finance.data.discretionarySpent}` }] : [] },
              { domain: "Career", color: "#3322EE", data: latest.career, vals: latest.career ? [{ k: "Study", v: `${latest.career.data.hoursStudied}h` }, { k: "Rating", v: `${latest.career.data.productivityRating}/10` }] : [] },
            ].map(s => (
              <div key={s.domain} className="snap-card" style={{ borderLeft: `3px solid ${s.color}` }}>
                <div className="snap-head">
                  <span className="snap-domain" style={{ color: s.color }}>{s.domain}</span>
                  <span className="snap-time">{s.data ? fmtDate(s.data.date) : "—"}</span>
                </div>
                {s.vals.length
                  ? <div className="snap-vals">{s.vals.map(v => <span key={v.k} className="snap-val"><span>{v.k}</span><strong>{v.v}</strong></span>)}</div>
                  : <span className="snap-empty">No data yet</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FORM ── */}
      <div className="form-wrap">

        {/* ─── HEALTH ─── */}
        <div className="sec-card">
          <div className="sec-stripe" style={{ background: "linear-gradient(90deg,#0044DD,#0066FF)" }} />
          <div className="sec-head">
            <div className="sec-icon" style={{ background: "#dbeafe", color: "#0044DD" }}><HeartPulse size={22} /></div>
            <div>
              <div className="sec-title">Health</div>
              <div className="sec-sub">Sleep, activity, stress & hydration</div>
            </div>
          </div>
          <div className="sec-body">

            <div className="sg-2">
              <Slider label="How long did you sleep?" value={health.sleepHours} onChange={v => setHealth(p => ({ ...p, sleepHours: v }))} min={0} max={12} step={0.5} icon={<Moon size={15} />} unit="h" color="#0044DD" hint="Aim for 7–9h" />
              <Slider label="Exercise time today" value={health.workoutMinutes} onChange={v => setHealth(p => ({ ...p, workoutMinutes: v }))} min={0} max={120} step={5} icon={<Dumbbell size={15} />} unit="m" color="#10b981" hint="Even a walk counts" />
            </div>

            <div className="sg-2">
              <Slider label="Stress level today" value={health.stressLevel} onChange={v => setHealth(p => ({ ...p, stressLevel: v }))} min={1} max={10} step={1} icon={<Activity size={15} />} unit="/10" color="#ef4444" hint="1 = very calm" />
              <Slider label="Glasses of water" value={health.waterGlasses} onChange={v => setHealth(p => ({ ...p, waterGlasses: v }))} min={0} max={15} step={1} icon={<Droplets size={15} />} unit=" gl" color="#06b6d4" hint="8 glasses = ideal" />
            </div>

            <div className="sg-2">
              <Slider label="How's your mood?" value={health.moodScore} onChange={v => setHealth(p => ({ ...p, moodScore: v }))} min={1} max={10} step={1} icon={<Star size={15} />} unit="/10" color="#f59e0b" hint="1 = low, 10 = great" />
              <Slider label="Energy level" value={health.energyLevel} onChange={v => setHealth(p => ({ ...p, energyLevel: v }))} min={1} max={10} step={1} icon={<Zap size={15} />} unit="/10" color="#8b5cf6" hint="How alert do you feel?" />
            </div>

            <div className="s-div" />

            <div className="pill-wrap">
              <span className="pill-lbl">Did you skip any meals today?</span>
              <div className="pill-row">
                {[{ v: "breakfast", l: "☕ Breakfast" }, { v: "lunch", l: "🍛 Lunch" }, { v: "dinner", l: "🍽️ Dinner" }].map(m => (
                  <button key={m.v} className={`pill${health.skippedMeals.includes(m.v) ? " on" : ""}`}
                    style={health.skippedMeals.includes(m.v) ? { background: "#ef4444", borderColor: "#ef4444" } : {}}
                    onClick={() => toggleMeal(m.v)}>{m.l}</button>
                ))}
              </div>
            </div>

            <div className="fg-2">
              <Field label="Calories eaten" opt type="number" value={health.caloriesConsumed} onChange={v => setHealth(p => ({ ...p, caloriesConsumed: v }))} placeholder="e.g. 2100" />
              <Field label="Calorie target" opt type="number" value={health.calorieGoal} onChange={v => setHealth(p => ({ ...p, calorieGoal: v }))} placeholder="e.g. 2400" />
            </div>

            <Field label="What did you eat today?" opt value={health.mealsEatenToday} onChange={v => setHealth(p => ({ ...p, mealsEatenToday: v }))} placeholder="e.g. Oats with honey, brown rice with paneer curry and broccoli" textarea note="Helps personalise your nutrition suggestions" />

          </div>
        </div>

        {/* ─── FINANCE ─── */}
        <div className="sec-card">
          <div className="sec-stripe" style={{ background: "linear-gradient(90deg,#0055EE,#3322EE)" }} />
          <div className="sec-head">
            <div className="sec-icon" style={{ background: "#e0e7ff", color: "#0055EE" }}><Wallet size={22} /></div>
            <div>
              <div className="sec-title">Money</div>
              <div className="sec-sub">What you saved and spent today</div>
            </div>
          </div>
          <div className="sec-body">
            <div className="fg-2">
              <Field label="Amount you saved today" req type="number" value={finance.amountSaved} onChange={v => setFinance(p => ({ ...p, amountSaved: v }))} placeholder="₹ e.g. 350" note="Enter 0 if nothing saved today" />
              <Field label="What you spent on extras" req type="number" value={finance.discretionarySpent} onChange={v => setFinance(p => ({ ...p, discretionarySpent: v }))} placeholder="₹ e.g. 60" note="Non-essential spending" />
            </div>
            <div className="fg-2">
              <Field label="Biggest purchase today" opt value={finance.biggestExpenseToday} onChange={v => setFinance(p => ({ ...p, biggestExpenseToday: v }))} placeholder="e.g. Swiggy order, Amazon" />
              <div className="field-box">
                <label className="field-label">What category was it?</label>
                <select className="f-input" value={finance.spendingCategory} onChange={e => setFinance(p => ({ ...p, spendingCategory: e.target.value }))}>
                  <option value="food">Food & Groceries</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="shopping">Shopping</option>
                  <option value="transport">Transport</option>
                  <option value="other">Something else</option>
                </select>
              </div>
            </div>
            <div className={`toggle-row${finance.impulseSpend ? " tw" : ""}`} onClick={() => setFinance(p => ({ ...p, impulseSpend: !p.impulseSpend }))}>
              <div className={`tsw${finance.impulseSpend ? " on" : ""}`}><div className="tknob" /></div>
              <span className="ttxt">{finance.impulseSpend ? "⚠️ Yes, I made an unplanned purchase today" : "Did you buy something on impulse?"}</span>
            </div>
          </div>
        </div>

        {/* ─── CAREER ─── */}
        <div className="sec-card">
          <div className="sec-stripe" style={{ background: "linear-gradient(90deg,#3322EE,#0066FF)" }} />
          <div className="sec-head">
            <div className="sec-icon" style={{ background: "#e0e7ff", color: "#3322EE" }}><Briefcase size={22} /></div>
            <div>
              <div className="sec-title">Learning & Work</div>
              <div className="sec-sub">Study time, focus and what you worked on</div>
            </div>
          </div>
          <div className="sec-body">
            <div className="fg-2">
              <Field label="Hours you studied or worked" req type="number" value={career.hoursStudied} onChange={v => setCareer(p => ({ ...p, hoursStudied: v }))} placeholder="e.g. 3" note="Count deep focus time" />
              <Field label="Study sessions completed" opt type="number" value={career.sessionsCompleted} onChange={v => setCareer(p => ({ ...p, sessionsCompleted: v }))} placeholder="e.g. 3" />
            </div>
            <Slider label="How productive were you today?" value={career.productivityRating} onChange={v => setCareer(p => ({ ...p, productivityRating: v }))} min={1} max={10} step={1} icon={<TrendingUp size={15} />} unit="/10" color="#3322EE" hint="Be honest — it helps!" />
            <Field label="What course or skill did you work on?" opt value={career.courseName} onChange={v => setCareer(p => ({ ...p, courseName: v }))} placeholder="e.g. ML Fundamentals, DSA, System Design" />
            <Field label="What goal did you move forward today?" opt value={career.goalWorkedOn} onChange={v => setCareer(p => ({ ...p, goalWorkedOn: v }))} placeholder="e.g. Solved 5 LeetCode problems for my interview prep" />
            <Field label="What got in your way today?" opt value={career.blockerToday} onChange={v => setCareer(p => ({ ...p, blockerToday: v }))} placeholder="e.g. Felt tired after work, got distracted" />
          </div>
        </div>

        {/* ─── REFLECTION ─── */}
        <div className="sec-card">
          <div className="sec-stripe" style={{ background: "linear-gradient(90deg,#f59e0b,#fbbf24)" }} />
          <div className="sec-head">
            <div className="sec-icon" style={{ background: "#fef3c7", color: "#f59e0b" }}><MessageSquare size={22} /></div>
            <div>
              <div className="sec-title">How are you feeling?</div>
              <div className="sec-sub">A quick reflection helps your insights get personal</div>
            </div>
          </div>
          <div className="sec-body">
            <p className="note-prompt-text">💬 {prompt}</p>
            <textarea className="f-input f-textarea" style={{ minHeight: 92 }} placeholder="Write anything — even a sentence is helpful..." value={dailyNote} onChange={e => setDailyNote(e.target.value)} maxLength={500} />
            <div className="note-counter">{dailyNote.length} / 500</div>
          </div>
        </div>

        {/* ─── FILE UPLOAD ─── */}
        <div className="sec-card">
          <div className="sec-stripe" style={{ background: "linear-gradient(90deg,#0066FF,#0044DD)" }} />
          <div className="sec-head">
            <div className="sec-icon" style={{ background: "#dbeafe", color: "#0044DD" }}><Upload size={22} /></div>
            <div>
              <div className="sec-title">Upload a Spreadsheet</div>
              <div className="sec-sub">Optional — import data from a CSV or Excel file</div>
            </div>
          </div>
          <div className="sec-body">
            <div className="field-box">
              <label className="field-label">Which area is this file for?</label>
              <div className="dp-row">
                {(["health", "finance", "career"] as const).map(d => (
                  <button key={d} className={`dp${uploadDomain === d ? " on" : ""}`} onClick={() => setUploadDomain(d)}>
                    {d === "health" ? "🟢 Health" : d === "finance" ? "🔵 Money" : "🟣 Career"}
                  </button>
                ))}
              </div>
            </div>
            <div className="dropzone" onClick={() => document.getElementById("file-inp")?.click()}>
              <input id="file-inp" type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) setUploadFile(f); }} />
              <Upload size={22} style={{ color: "#0044DD" }} />
              <div className="dz-text">
                {uploadFile
                  ? <strong style={{ color: "#111" }}>{uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)</strong>
                  : <><span style={{ color: "#0044DD", fontWeight: 700 }}>Choose a file</span> or drag it here</>}
              </div>
              <div className="dz-sub">Supports .csv, .xlsx, .xls</div>
            </div>
            {uploadMsg && (
              <div className={`upload-msg${uploadMsg.ok ? " ok" : " err"}`}>
                {uploadMsg.ok ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                {uploadMsg.text}
              </div>
            )}
            <button className="upload-btn" onClick={handleUpload} disabled={!uploadFile || uploadLoading}>
              {uploadLoading ? <><Activity size={15} /> Uploading...</> : <><Send size={14} /> Upload File</>}
            </button>
          </div>
        </div>

      </div>

      {/* ── SCORE PREVIEW ── */}
      <div className="score-section">
        <div className="score-lbl"><Sparkles size={12} style={{ color: "#0044DD" }} /> How today's log affects your scores</div>
        <div className="score-grid">
          {[
            { label: "Health", old: currentScores.health, nw: pH, color: "#0044DD", icon: <HeartPulse size={18} /> },
            { label: "Finance", old: currentScores.finance, nw: pF, color: "#0055EE", icon: <Wallet size={18} /> },
            { label: "Career", old: currentScores.career, nw: pC, color: "#3322EE", icon: <Briefcase size={18} /> },
          ].map(c => {
            const diff = c.nw - c.old;
            return (
              <div key={c.label} className="score-card">
                <span style={{ color: c.color }}>{c.icon}</span>
                <div className="score-info">
                  <span className="score-name">{c.label}</span>
                  <div className="score-nums">
                    <span className="score-old">{c.old}</span>
                    <span className="score-arr">→</span>
                    <span className="score-new" style={{ color: diff < 0 ? "#ef4444" : diff > 0 ? "#10b981" : c.color }}>{c.nw}</span>
                    {diff !== 0 && <span className={`score-diff ${diff > 0 ? "d-up" : "d-dn"}`}>{diff > 0 ? "+" : ""}{diff}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ERROR ── */}
      {message && (
        <div className="err-wrap">
          <div className="err-box"><AlertTriangle size={15} /> {message}</div>
        </div>
      )}

      {/* ── SUBMIT ── */}
      <div className="submit-section">
        <button className="submit-btn" onClick={handleSubmit} disabled={!canSubmit || loading}>
          {loading
            ? <><Activity size={17} /> Saving your day...</>
            : <><Send size={16} /> Save Today's Log</>}
        </button>
        {!canSubmit && (
          <p className="submit-note">Fill in sleep hours, savings, spending, and study hours to save your log.</p>
        )}
      </div>

    </div>
  );
}