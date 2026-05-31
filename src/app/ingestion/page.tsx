"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  HeartPulse, Wallet, Briefcase, Sparkles, ArrowLeft,
  Brain, Zap, Droplets, Moon, Dumbbell, Activity,
  TrendingUp, AlertTriangle, CheckCircle2, Send,
  Upload, Flame, Clock, MessageSquare,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface HealthData {
  sleepHours: number;
  workoutMinutes: number;
  stressLevel: number;
  moodScore: number;
  energyLevel: number;
  waterGlasses: number;
  skippedMeals: string[];
  caloriesConsumed: string;
  calorieGoal: string;
  mealsEatenToday: string;
}

interface FinanceData {
  amountSaved: string;
  discretionarySpent: string;
  spendingCategory: string;
  biggestExpenseToday: string;
  impulseSpend: boolean;
}

interface CareerData {
  hoursStudied: string;
  productivityRating: number;
  sessionsCompleted: string;
  courseName: string;
  goalWorkedOn: string;
  blockerToday: string;
}

interface LatestData {
  health: { data: any; date: string } | null;
  finance: { data: any; date: string } | null;
  career: { data: any; date: string } | null;
  reflection: { data: any; date: string } | null;
}

/* ─────────────────────────────────────────────
   Scoring — client-side preview (mirrors server)
───────────────────────────────────────────── */
function previewHealthScore(h: HealthData): number {
  let s = 0;
  if (h.sleepHours >= 7 && h.sleepHours <= 9) s += 40;
  else if (h.sleepHours >= 6 || h.sleepHours === 10) s += 20;
  else s += 5;
  if (h.workoutMinutes >= 60) s += 40;
  else if (h.workoutMinutes >= 30) s += 25;
  else if (h.workoutMinutes > 0) s += 10;
  s += Math.max(0, 20 - h.stressLevel * 2);
  if (h.waterGlasses >= 8) s += 5;
  else if (h.waterGlasses <= 2) s -= 3;
  return Math.max(0, Math.min(100, s));
}

function previewFinanceScore(f: FinanceData): number {
  let s = 50;
  const saved = Number(f.amountSaved) || 0;
  const spent = Number(f.discretionarySpent) || 0;
  if (saved >= 100) s += 30;
  else if (saved > 0) s += 15;
  if (spent === 0) s += 20;
  else if (spent < 50) s += 10;
  else if (spent > 100) s -= 20;
  if (f.impulseSpend) s -= 5;
  return Math.max(0, Math.min(100, s));
}

function previewCareerScore(c: CareerData): number {
  let s = 0;
  const hrs = Number(c.hoursStudied) || 0;
  if (hrs >= 4) s += 50;
  else if (hrs >= 2) s += 30;
  else if (hrs > 0) s += 10;
  s += c.productivityRating * 5;
  return Math.max(0, Math.min(100, s));
}

/* ─────────────────────────────────────────────
   Slider Component
───────────────────────────────────────────── */
function SyncSlider({
  label, value, onChange, min, max, step, icon, unit, color,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number;
  icon: React.ReactNode; unit?: string; color: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="sync-slider">
      <div className="slider-header">
        <div className="slider-label-group">
          <span className="slider-icon" style={{ color }}>{icon}</span>
          <span className="slider-label">{label}</span>
        </div>
        <span className="slider-value" style={{ color }}>
          {value}{unit || ""}
        </span>
      </div>
      <div className="slider-track-wrap">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-input"
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Pill Selector
───────────────────────────────────────────── */
function PillSelect({
  label, options, selected, onToggle, color,
}: {
  label: string; options: { value: string; label: string }[];
  selected: string[]; onToggle: (v: string) => void; color: string;
}) {
  return (
    <div className="pill-group">
      <span className="pill-label">{label}</span>
      <div className="pill-row">
        {options.map((opt) => {
          const active = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              className={`pill ${active ? "pill-active" : ""}`}
              onClick={() => onToggle(opt.value)}
              style={active ? { background: color, borderColor: color, color: "#fff" } : {}}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Score Impact Card
───────────────────────────────────────────── */
function ImpactPreview({
  label, oldScore, newScore, color, icon
}: {
  label: string; oldScore: number; newScore: number; color: string; icon: React.ReactNode;
}) {
  const diff = newScore - oldScore;
  const isUp = diff > 0;
  const isDown = diff < 0;
  return (
    <div className="impact-card">
      <div className="impact-icon" style={{ color }}>{icon}</div>
      <div className="impact-info">
        <span className="impact-label">{label}</span>
        <div className="impact-scores">
          <span className="impact-old">{oldScore}</span>
          <span className="impact-arrow">→</span>
          <span className="impact-new" style={{ color: isDown ? "#ef4444" : isUp ? "#10b981" : color }}>
            {newScore}
          </span>
          {diff !== 0 && (
            <span className={`impact-diff ${isDown ? "diff-neg" : "diff-pos"}`}>
              {isUp ? "+" : ""}{diff}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Calibrating Screen (preserved)
───────────────────────────────────────────── */
function CalibratingScreen() {
  const [phase, setPhase] = useState(0);
  const phases = [
    "Initializing twin core...",
    "Ingesting health matrix...",
    "Mapping finance vectors...",
    "Syncing career trajectory...",
    "Calibrating AI reflection...",
    "Twin sync complete.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < phases.length - 1 ? p + 1 : p));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="calibrating-overlay">
      <style>{`
        @keyframes brainPulse {
          0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(59,130,246,0.6), 0 0 40px rgba(59,130,246,0.4); }
          50% { transform: scale(1.08); opacity: 0.9; box-shadow: 0 0 0 24px rgba(59,130,246,0), 0 0 80px rgba(99,102,241,0.8); }
        }
        @keyframes ringExpand {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotBlink {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
        .calibrating-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: linear-gradient(135deg, #000510 0%, #000d2e 50%, #00082a 100%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          font-family: 'Plus Jakarta Sans','Inter',sans-serif;
        }
        .calib-brain { position: relative; width: 160px; height: 160px; display: flex; align-items: center; justify-content: center; margin-bottom: 40px; }
        .calib-core { width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #6366f1); display: flex; align-items: center; justify-content: center; animation: brainPulse 1.8s ease-in-out infinite; position: relative; z-index: 2; }
        .calib-ring { position: absolute; border-radius: 50%; border: 2px solid rgba(59,130,246,0.5); animation: ringExpand 2.4s ease-out infinite; width: 100px; height: 100px; }
        .calib-ring:nth-child(2) { animation-delay: 0.8s; }
        .calib-ring:nth-child(3) { animation-delay: 1.6s; }
        .calib-title { font-size: 1.8rem; font-weight: 800; color: #ffffff; letter-spacing: -0.04em; margin-bottom: 8px; }
        .calib-sub { font-size: 0.85rem; color: rgba(255,255,255,0.45); margin-bottom: 32px; }
        .calib-phase { font-size: 0.88rem; font-weight: 600; color: #60a5fa; animation: fadeInUp 0.4s ease; min-height: 22px; margin-bottom: 28px; }
        .calib-dots { display: flex; gap: 8px; margin-bottom: 40px; }
        .calib-dot { width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; animation: dotBlink 1.4s ease-in-out infinite; }
        .calib-dot:nth-child(2) { animation-delay: 0.2s; }
        .calib-dot:nth-child(3) { animation-delay: 0.4s; }
        .calib-track { width: 280px; height: 3px; background: rgba(255,255,255,0.1); border-radius: 9999px; overflow: hidden; }
        .calib-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #6366f1); border-radius: 9999px; transition: width 0.6s ease; }
        .calib-badge { position: fixed; top: 24px; left: 24px; display: flex; align-items: center; gap: 8px; font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.4); letter-spacing: 0.1em; text-transform: uppercase; }
      `}</style>
      <div className="calib-badge"><Sparkles size={11} /> Syntra AI</div>
      <div className="calib-brain">
        <div className="calib-ring" />
        <div className="calib-ring" />
        <div className="calib-ring" />
        <div className="calib-core"><Brain size={40} color="#ffffff" /></div>
      </div>
      <h2 className="calib-title">Syntra Core Calibrating...</h2>
      <p className="calib-sub">Your AI twin is syncing with your data</p>
      <div className="calib-phase" key={phase}>{phases[phase]}</div>
      <div className="calib-dots"><div className="calib-dot" /><div className="calib-dot" /><div className="calib-dot" /></div>
      <div className="calib-track">
        <div className="calib-fill" style={{ width: `${Math.round((phase / (phases.length - 1)) * 100)}%` }} />
      </div>
    </div>
  );
}

const formatDate = (d: string) => {
  const date = new Date(d);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return diffD === 1 ? "Yesterday" : `${diffD} days ago`;
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function IngestionPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [todayLogged, setTodayLogged] = useState(false);

  // Latest data for snapshot
  const [latest, setLatest] = useState<LatestData | null>(null);
  const [currentScores, setCurrentScores] = useState({ health: 50, finance: 50, career: 50 });
  const [streak, setStreak] = useState(0);
  const [lastSync, setLastSync] = useState<string | null>(null);

  // File upload states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDomain, setUploadDomain] = useState<"health" | "finance" | "career">("health");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Domain states — initialised to zero; pre-filled with today's log if one exists
  const [health, setHealth] = useState<HealthData>({
    sleepHours: 0, workoutMinutes: 0, stressLevel: 1,
    moodScore: 1, energyLevel: 1, waterGlasses: 0,
    skippedMeals: [], caloriesConsumed: "", calorieGoal: "",
    mealsEatenToday: "",
  });
  const [finance, setFinance] = useState<FinanceData>({
    amountSaved: "", discretionarySpent: "",
    spendingCategory: "food", biggestExpenseToday: "", impulseSpend: false,
  });
  const [career, setCareer] = useState<CareerData>({
    hoursStudied: "", productivityRating: 1,
    sessionsCompleted: "", courseName: "", goalWorkedOn: "", blockerToday: "",
  });
  const [dailyNote, setDailyNote] = useState("");

  // Computed preview scores
  const previewH = useMemo(() => previewHealthScore(health), [health]);
  const previewF = useMemo(() => previewFinanceScore(finance), [finance]);
  const previewC = useMemo(() => previewCareerScore(career), [career]);

  const lastSyncText = useMemo(() => {
    if (!lastSync) return "Never synced";
    return formatDate(lastSync);
  }, [lastSync, latest]);

  // Fetch latest data; pre-fill form if a log already exists for today
  useEffect(() => {
    setMounted(true);
    fetch("/api/log/latest", { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setLatest(d.latest);
          if (d.scores) setCurrentScores(d.scores);
          if (typeof d.streak === "number") setStreak(d.streak);
          if (d.lastLogDate) setLastSync(d.lastLogDate);

          const isToday = (dateStr: string) =>
            new Date(dateStr).toDateString() === new Date().toDateString();

          const loggedToday =
            (d.latest?.health && isToday(d.latest.health.date)) ||
            (d.latest?.finance && isToday(d.latest.finance.date)) ||
            (d.latest?.career && isToday(d.latest.career.date));
          if (loggedToday) setTodayLogged(true);

          if (d.latest?.health && isToday(d.latest.health.date)) {
            const h = d.latest.health.data;
            setHealth({
              sleepHours: h.sleepHours ?? 0,
              workoutMinutes: h.workoutMinutes ?? 0,
              stressLevel: h.stressLevel ?? 1,
              moodScore: h.moodScore ?? 1,
              energyLevel: h.energyLevel ?? 1,
              waterGlasses: h.waterGlasses ?? 0,
              skippedMeals: h.skippedMeals ?? [],
              caloriesConsumed: h.caloriesConsumed != null ? String(h.caloriesConsumed) : "",
              calorieGoal: h.calorieGoal != null ? String(h.calorieGoal) : "",
              mealsEatenToday: h.mealsEatenToday ?? "",
            });
          }

          if (d.latest?.finance && isToday(d.latest.finance.date)) {
            const f = d.latest.finance.data;
            setFinance({
              amountSaved: f.amountSaved != null ? String(f.amountSaved) : "",
              discretionarySpent: f.discretionarySpent != null ? String(f.discretionarySpent) : "",
              spendingCategory: f.spendingCategory ?? "food",
              biggestExpenseToday: f.biggestExpenseToday ?? "",
              impulseSpend: f.impulseSpend ?? false,
            });
          }

          if (d.latest?.career && isToday(d.latest.career.date)) {
            const c = d.latest.career.data;
            setCareer({
              hoursStudied: c.hoursStudied != null ? String(c.hoursStudied) : "",
              productivityRating: c.productivityRating ?? 1,
              sessionsCompleted: c.sessionsCompleted != null ? String(c.sessionsCompleted) : "",
              courseName: c.courseName ?? "",
              goalWorkedOn: c.goalWorkedOn ?? "",
              blockerToday: c.blockerToday ?? "",
            });
          }

          if (d.latest?.reflection && isToday(d.latest.reflection.date)) {
            setDailyNote(d.latest.reflection.data?.note ?? "");
          }
        }
      })
      .catch(() => {});
  }, []);

  const toggleMeal = useCallback((meal: string) => {
    setHealth(p => ({
      ...p,
      skippedMeals: p.skippedMeals.includes(meal)
        ? p.skippedMeals.filter(m => m !== meal)
        : [...p.skippedMeals, meal],
    }));
  }, []);

  const canSubmit = !!(
    health.sleepHours > 0 &&
    finance.amountSaved !== "" &&
    finance.discretionarySpent !== "" &&
    career.hoursStudied !== ""
  );

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/log/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          health: {
            sleepHours: health.sleepHours,
            workoutMinutes: health.workoutMinutes,
            stressLevel: health.stressLevel,
            moodScore: health.moodScore || undefined,
            energyLevel: health.energyLevel || undefined,
            waterGlasses: health.waterGlasses || undefined,
            skippedMeals: health.skippedMeals.length > 0 ? health.skippedMeals : undefined,
            caloriesConsumed: health.caloriesConsumed ? Number(health.caloriesConsumed) : undefined,
             calorieGoal: health.calorieGoal ? Number(health.calorieGoal) : undefined,
             mealsEatenToday: health.mealsEatenToday.trim() || undefined,
           },
          finance: {
            amountSaved: Number(finance.amountSaved),
            discretionarySpent: Number(finance.discretionarySpent),
            spendingCategory: finance.spendingCategory || undefined,
            biggestExpenseToday: finance.biggestExpenseToday || undefined,
            impulseSpend: finance.impulseSpend || undefined,
          },
          career: {
            hoursStudied: Number(career.hoursStudied),
            productivityRating: career.productivityRating,
            sessionsCompleted: career.sessionsCompleted ? Number(career.sessionsCompleted) : undefined,
            courseName: career.courseName || undefined,
            goalWorkedOn: career.goalWorkedOn || undefined,
            blockerToday: career.blockerToday || undefined,
          },
          dailyNote: dailyNote.trim() || undefined,
        }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.message || "Submission failed.");
      window.dispatchEvent(new Event("syntra-refresh"));
      setLoading(false);
      setCalibrating(true);
      setTimeout(() => router.push("/dashboard"), 4200);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Submission failed.");
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadMessage({ text: "Please select a CSV or Excel file first.", type: "error" });
      return;
    }

    setUploadLoading(true);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("domain", uploadDomain);

    const isCsv = uploadFile.name.endsWith(".csv");
    const endpoint = isCsv ? "/api/upload/csv" : "/api/upload/excel";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const d = await res.json();
      if (!res.ok || !d.success) {
        throw new Error(d.message || "Failed to upload file.");
      }

      setUploadMessage({ text: d.message || "Spreadsheet ingested successfully!", type: "success" });
      setUploadFile(null);
      
      const fileInput = document.getElementById("csv-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
      setTimeout(() => {
        fetch("/api/log/latest", { credentials: "include" })
          .then(r => r.json())
          .then(latestData => {
            if (latestData.success) {
              setLatest(latestData.latest);
              if (latestData.scores) setCurrentScores(latestData.scores);
              if (typeof latestData.streak === "number") setStreak(latestData.streak);
              if (latestData.lastLogDate) setLastSync(latestData.lastLogDate);
            }
          })
          .catch(() => {});
      }, 1500);

      window.dispatchEvent(new Event("syntra-refresh"));
    } catch (err: any) {
      setUploadMessage({ text: err.message || "File import failed.", type: "error" });
    } finally {
      setUploadLoading(false);
    }
  };

  if (!mounted) return null;
  if (calibrating) return <CalibratingScreen />;


  const DAILY_PROMPTS = [
    "What was the highlight of your day?",
    "What's one thing you'd change about today?",
    "How do you feel right now in one sentence?",
    "What are you grateful for today?",
    "What's on your mind?",
  ];
  const todayPrompt = DAILY_PROMPTS[new Date().getDate() % DAILY_PROMPTS.length];

  return (
    <div className="ingestion-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        .ingestion-root {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Plus Jakarta Sans','Inter',-apple-system,sans-serif;
          padding-bottom: 80px;
        }
        /* ── NAV BAR ── */
        .ing-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(226,232,240,0.8);
          padding: 14px 32px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .ing-back {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.84rem; font-weight: 600; color: #64748b;
          cursor: pointer; border: none; background: none; padding: 6px 12px;
          border-radius: 8px; transition: all 0.2s;
        }
        .ing-back:hover { color: #3b82f6; background: #eff6ff; }
        .ing-brand { display: flex; align-items: center; gap: 6px; font-size: 0.72rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.08em; text-transform: uppercase; }

        /* ── HERO ── */
        .ing-hero {
          max-width: 960px; margin: 0 auto; padding: 32px 24px 0;
        }
        .hero-streak {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; border-radius: 999px;
          background: linear-gradient(135deg, #eff6ff, #eef2ff);
          border: 1px solid #dbeafe;
          font-size: 0.78rem; font-weight: 700; color: #3b82f6;
          margin-bottom: 16px;
        }
        .hero-title {
          font-size: 1.75rem; font-weight: 800; color: #0f172a;
          letter-spacing: -0.03em; margin-bottom: 6px;
        }
        .hero-sub {
          font-size: 0.88rem; color: #64748b; line-height: 1.6;
          margin-bottom: 24px;
        }

        /* ── YESTERDAY SNAPSHOT ── */
        .snapshot-row {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
          margin-bottom: 32px;
        }
        .snap-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px 16px;
          display: flex; flex-direction: column; gap: 6px;
          transition: all 0.2s;
        }
        .snap-card:hover { border-color: #cbd5e1; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .snap-header { display: flex; align-items: center; justify-content: space-between; }
        .snap-domain { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
        .snap-time { font-size: 0.68rem; color: #94a3b8; font-weight: 500; }
        .snap-metrics { display: flex; flex-wrap: wrap; gap: 8px; }
        .snap-metric { font-size: 0.76rem; color: #475569; font-weight: 500; }
        .snap-metric strong { color: #0f172a; font-weight: 700; }
        .snap-empty { font-size: 0.76rem; color: #94a3b8; font-style: italic; }

        /* ── DOMAIN CARDS ── */
        .cards-container {
          max-width: 960px; margin: 0 auto; padding: 0 24px;
          display: flex; flex-direction: column; gap: 20px;
        }
        .domain-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: all 0.3s;
        }
        .domain-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.06); }
        .domain-header {
          padding: 18px 22px;
          display: flex; align-items: center; gap: 14px;
          border-bottom: 1px solid #f1f5f9;
        }
        .domain-icon {
          width: 42px; height: 42px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .domain-title { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
        .domain-sub { font-size: 0.76rem; color: #94a3b8; font-weight: 500; }
        .domain-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 16px; }
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .field-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }

        /* ── TEXT INPUTS ── */
        .text-field { display: flex; flex-direction: column; gap: 5px; }
        .text-label { font-size: 0.76rem; font-weight: 600; color: #475569; }
        .text-label .req { color: #3b82f6; margin-left: 2px; }
        .text-label .opt { color: #94a3b8; font-weight: 400; font-size: 0.72rem; margin-left: 4px; }
        .text-input {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: 0.86rem; padding: 10px 13px;
          border-radius: 10px; border: 1px solid #e2e8f0;
          background: #f8fafc; color: #0f172a;
          transition: all 0.18s; width: 100%; box-sizing: border-box;
          -moz-appearance: textfield;
        }
        .text-input::-webkit-outer-spin-button, .text-input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .text-input:focus { outline: none; border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .text-input::placeholder { color: #b0bac6; }

        /* ── SLIDER ── */
        .sync-slider { display: flex; flex-direction: column; gap: 6px; }
        .slider-header { display: flex; justify-content: space-between; align-items: center; }
        .slider-label-group { display: flex; align-items: center; gap: 6px; }
        .slider-icon { display: flex; align-items: center; }
        .slider-label { font-size: 0.76rem; font-weight: 600; color: #475569; }
        .slider-value { font-size: 0.88rem; font-weight: 800; font-family: 'JetBrains Mono', monospace; }
        .slider-track-wrap { position: relative; }
        .slider-input {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 6px; border-radius: 999px;
          outline: none; transition: background 0.15s;
          cursor: pointer;
        }
        .slider-input::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: #fff; border: 3px solid currentColor;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          cursor: grab; transition: transform 0.15s;
        }
        .slider-input::-webkit-slider-thumb:hover { transform: scale(1.15); }
        .slider-input::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: #fff; border: 3px solid currentColor;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          cursor: grab;
        }

        /* ── PILLS ── */
        .pill-group { display: flex; flex-direction: column; gap: 6px; }
        .pill-label { font-size: 0.76rem; font-weight: 600; color: #475569; }
        .pill-row { display: flex; flex-wrap: wrap; gap: 6px; }
        .pill {
          padding: 6px 14px; border-radius: 999px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc; color: #64748b;
          font-size: 0.76rem; font-weight: 600;
          cursor: pointer; transition: all 0.18s;
          font-family: 'Plus Jakarta Sans',sans-serif;
        }
        .pill:hover { border-color: #cbd5e1; }
        .pill-active { color: #fff !important; border-color: transparent !important; }

        /* ── TOGGLE ── */
        .toggle-row {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 14px; border-radius: 10px;
          background: #f8fafc; border: 1px solid #e2e8f0;
          cursor: pointer; transition: all 0.2s;
        }
        .toggle-row:hover { border-color: #cbd5e1; }
        .toggle-row.active { background: #fef2f2; border-color: #fca5a5; }
        .toggle-switch {
          width: 36px; height: 20px; border-radius: 999px;
          background: #e2e8f0; position: relative;
          flex-shrink: 0; transition: background 0.2s;
        }
        .toggle-switch.on { background: #ef4444; }
        .toggle-knob {
          position: absolute; top: 2px; left: 2px;
          width: 16px; height: 16px; border-radius: 50%;
          background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          transition: left 0.2s;
        }
        .toggle-switch.on .toggle-knob { left: 18px; }
        .toggle-text { font-size: 0.8rem; font-weight: 600; color: #475569; }
        .toggle-text.active-text { color: #dc2626; }

        /* ── DAILY NOTE ── */
        .note-card {
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 18px; overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }
        .note-header {
          padding: 18px 22px;
          display: flex; align-items: center; gap: 14px;
          border-bottom: 1px solid #f1f5f9;
        }
        .note-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          display: flex; align-items: center; justify-content: center;
          color: #f59e0b; flex-shrink: 0;
        }
        .note-body { padding: 18px 22px; }
        .note-prompt {
          font-size: 0.82rem; color: #94a3b8; font-style: italic;
          margin-bottom: 10px;
        }
        .note-textarea {
          width: 100%; min-height: 80px; border: 1px solid #e2e8f0;
          border-radius: 12px; padding: 12px 14px;
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: 0.86rem; color: #0f172a; background: #f8fafc;
          resize: vertical; transition: all 0.18s; box-sizing: border-box;
        }
        .note-textarea:focus { outline: none; border-color: #f59e0b; background: #fff; box-shadow: 0 0 0 3px rgba(245,158,11,0.1); }
        .note-counter { text-align: right; font-size: 0.7rem; color: #94a3b8; margin-top: 4px; }

        /* ── IMPACT PREVIEW ── */
        .impact-section {
          max-width: 960px; margin: 24px auto 0; padding: 0 24px;
        }
        .impact-title {
          font-size: 0.78rem; font-weight: 700; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 10px; display: flex; align-items: center; gap: 6px;
        }
        .impact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .impact-card {
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 14px; padding: 14px 16px;
          display: flex; align-items: center; gap: 12px;
          transition: all 0.3s;
        }
        .impact-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .impact-icon { display: flex; align-items: center; }
        .impact-info { display: flex; flex-direction: column; gap: 2px; }
        .impact-label { font-size: 0.72rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.04em; }
        .impact-scores { display: flex; align-items: center; gap: 6px; }
        .impact-old { font-size: 0.88rem; font-weight: 600; color: #94a3b8; }
        .impact-arrow { font-size: 0.78rem; color: #cbd5e1; }
        .impact-new { font-size: 1rem; font-weight: 800; font-family: 'JetBrains Mono', monospace; }
        .impact-diff {
          font-size: 0.72rem; font-weight: 700; padding: 2px 6px;
          border-radius: 6px; font-family: 'JetBrains Mono', monospace;
        }
        .diff-pos { background: #ecfdf5; color: #10b981; }
        .diff-neg { background: #fef2f2; color: #ef4444; }

        /* ── SUBMIT SECTION ── */
        .submit-section {
          max-width: 960px; margin: 28px auto 0; padding: 0 24px;
        }
        .submit-btn {
          width: 100%; padding: 16px; border-radius: 14px;
          border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: 0.95rem; font-weight: 700; color: #fff;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          box-shadow: 0 4px 20px rgba(59,130,246,0.3);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.2s;
        }
        .submit-btn:hover:not(:disabled) { filter: brightness(1.06); transform: translateY(-1px); box-shadow: 0 8px 28px rgba(59,130,246,0.35); }
        .submit-btn:disabled { background: #94a3b8 !important; box-shadow: none !important; cursor: not-allowed; }

        .msg-banner {
          max-width: 960px; margin: 12px auto 0; padding: 0 24px;
        }
        .msg-inner {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 16px; border-radius: 12px;
          font-size: 0.84rem; font-weight: 600;
          background: #fef2f2; border: 1px solid #fecaca; color: #dc2626;
        }

        /* ── PREMIUM FILE UPLOAD CARD ── */
        .file-upload-card {
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 18px; overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: all 0.3s;
        }
        .file-upload-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.06); }
        .upload-header {
          padding: 18px 22px;
          display: flex; align-items: center; gap: 14px;
          border-bottom: 1px solid #f1f5f9;
        }
        .upload-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: linear-gradient(135deg, #dbeafe, #c7d2fe);
          display: flex; align-items: center; justify-content: center;
          color: #3b82f6; flex-shrink: 0;
        }
        .upload-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 16px; }
        .file-dropzone {
          border: 2px dashed #cbd5e1; border-radius: 12px;
          padding: 24px 16px; text-align: center; cursor: pointer;
          background: #f8fafc; transition: all 0.2s;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .file-dropzone:hover { border-color: #3b82f6; background: #eff6ff; }
        .dropzone-text { font-size: 0.84rem; color: #64748b; margin-top: 4px; }
        .dropzone-subtext { font-size: 0.72rem; color: #94a3b8; margin-top: 2px; }
        .upload-submit-btn {
          width: 100%; padding: 12px; border-radius: 10px;
          border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: 0.88rem; font-weight: 700; color: #fff;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s;
        }
        .upload-submit-btn:hover:not(:disabled) { filter: brightness(1.06); }
        .upload-submit-btn:disabled { background: #94a3b8 !important; cursor: not-allowed; }
        .upload-status {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; border-radius: 8px;
          font-size: 0.78rem; font-weight: 600;
        }
        .upload-status.success { background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; }
        .upload-status.error { background: #fef2f2; border: 1px solid #fca5a5; color: #dc2626; }

        /* ── DIVIDER ── */
        .section-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }

        /* ── RESPONSIVE ── */
        @media (max-width: 640px) {
          .snapshot-row, .impact-grid { grid-template-columns: 1fr; }
          .field-grid { grid-template-columns: 1fr; }
          .field-grid-3 { grid-template-columns: 1fr; }
          .ing-hero { padding: 24px 16px 0; }
          .cards-container, .impact-section, .submit-section { padding: 0 16px; }
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.4s ease both; }
        .fade-in-1 { animation-delay: 0.05s; }
        .fade-in-2 { animation-delay: 0.1s; }
        .fade-in-3 { animation-delay: 0.15s; }
        .fade-in-4 { animation-delay: 0.2s; }
        .fade-in-5 { animation-delay: 0.25s; }
      `}</style>

      {/* ── NAV ── */}
      <div className="ing-nav">
        <button className="ing-back" onClick={() => router.push("/dashboard")}>
          <ArrowLeft size={15} /> Dashboard
        </button>
        <div className="ing-brand"><Sparkles size={11} /> Syntra AI</div>
      </div>

      {/* ── HERO ── */}
      <div className="ing-hero fade-in">
        <div className="hero-streak">
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Flame size={14} />
            Streak: {streak} {streak === 1 ? "day" : "days"}
          </span>
          <span style={{ width: "1px", height: "12px", background: "#cbd5e1" }} />
          <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b" }}>
            <Clock size={12} />
            Last Sync: {lastSyncText}
          </span>
        </div>
        <h1 className="hero-title">Daily Calibration</h1>
        <p className="hero-sub">
          Log your health, finances, and career progress. Your twin updates in real time.
        </p>
        {todayLogged && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 16px", borderRadius: 10,
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            fontSize: "0.82rem", fontWeight: 600, color: "#16a34a",
            marginBottom: 4,
          }}>
            <CheckCircle2 size={14} />
            Today&apos;s log loaded — form pre-filled with your earlier entries. Update and re-submit to overwrite.
          </div>
        )}
      </div>

      {/* ── SNAPSHOT ── */}
      {latest && (latest.health || latest.finance || latest.career) && (
        <div className="ing-hero fade-in fade-in-1" style={{ paddingTop: 0 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={12} /> {todayLogged ? "Today's Log" : "Last Logged"}
          </div>
          <div className="snapshot-row">
            <div className="snap-card" style={{ borderLeft: "3px solid #3b82f6" }}>
              <div className="snap-header">
                <span className="snap-domain" style={{ color: "#3b82f6" }}>Health</span>
                <span className="snap-time">{latest.health ? formatDate(latest.health.date) : ""}</span>
              </div>
              {latest.health ? (
                <div className="snap-metrics">
                  <span className="snap-metric">Sleep <strong>{latest.health.data.sleepHours}h</strong></span>
                  <span className="snap-metric">Workout <strong>{latest.health.data.workoutMinutes}m</strong></span>
                  <span className="snap-metric">Stress <strong>{latest.health.data.stressLevel}/10</strong></span>
                </div>
              ) : <span className="snap-empty">No data yet</span>}
            </div>
            <div className="snap-card" style={{ borderLeft: "3px solid #8b5cf6" }}>
              <div className="snap-header">
                <span className="snap-domain" style={{ color: "#8b5cf6" }}>Finance</span>
                <span className="snap-time">{latest.finance ? formatDate(latest.finance.date) : ""}</span>
              </div>
              {latest.finance ? (
                <div className="snap-metrics">
                  <span className="snap-metric">Saved <strong>₹{latest.finance.data.amountSaved}</strong></span>
                  <span className="snap-metric">Spent <strong>₹{latest.finance.data.discretionarySpent}</strong></span>
                </div>
              ) : <span className="snap-empty">No data yet</span>}
            </div>
            <div className="snap-card" style={{ borderLeft: "3px solid #6366f1" }}>
              <div className="snap-header">
                <span className="snap-domain" style={{ color: "#6366f1" }}>Career</span>
                <span className="snap-time">{latest.career ? formatDate(latest.career.date) : ""}</span>
              </div>
              {latest.career ? (
                <div className="snap-metrics">
                  <span className="snap-metric">Study <strong>{latest.career.data.hoursStudied}h</strong></span>
                  <span className="snap-metric">Productivity <strong>{latest.career.data.productivityRating}/10</strong></span>
                </div>
              ) : <span className="snap-empty">No data yet</span>}
            </div>
          </div>
        </div>
      )}

      {/* ── DOMAIN CARDS ── */}
      <div className="cards-container">

        {/* ─── HEALTH CARD ─── */}
        <div className="domain-card fade-in fade-in-2">
          <div className="domain-header">
            <div className="domain-icon" style={{ background: "linear-gradient(135deg, #dbeafe, #bfdbfe)", color: "#3b82f6" }}>
              <HeartPulse size={20} />
            </div>
            <div>
              <div className="domain-title">Health</div>
              <div className="domain-sub">Sleep, exercise, stress & hydration</div>
            </div>
          </div>
          <div className="domain-body">
            <div className="field-grid">
              <SyncSlider label="Sleep Hours" value={health.sleepHours} onChange={v => setHealth(p => ({ ...p, sleepHours: v }))} min={0} max={12} step={0.5} icon={<Moon size={14} />} unit="h" color="#3b82f6" />
              <SyncSlider label="Workout Minutes" value={health.workoutMinutes} onChange={v => setHealth(p => ({ ...p, workoutMinutes: v }))} min={0} max={120} step={5} icon={<Dumbbell size={14} />} unit="m" color="#10b981" />
            </div>
            <div className="field-grid">
              <SyncSlider label="Stress Level" value={health.stressLevel} onChange={v => setHealth(p => ({ ...p, stressLevel: v }))} min={1} max={10} step={1} icon={<Activity size={14} />} unit="/10" color="#ef4444" />
              <SyncSlider label="Water Intake" value={health.waterGlasses} onChange={v => setHealth(p => ({ ...p, waterGlasses: v }))} min={0} max={15} step={1} icon={<Droplets size={14} />} unit=" glasses" color="#06b6d4" />
            </div>
            <div className="section-divider" />
            <div className="field-grid">
              <SyncSlider label="Mood" value={health.moodScore} onChange={v => setHealth(p => ({ ...p, moodScore: v }))} min={1} max={10} step={1} icon={<Sparkles size={14} />} unit="/10" color="#f59e0b" />
              <SyncSlider label="Energy" value={health.energyLevel} onChange={v => setHealth(p => ({ ...p, energyLevel: v }))} min={1} max={10} step={1} icon={<Zap size={14} />} unit="/10" color="#8b5cf6" />
            </div>
            <PillSelect
              label="Skipped any meals today?"
              options={[
                { value: "breakfast", label: "☕ Breakfast" },
                { value: "lunch", label: "🍛 Lunch" },
                { value: "dinner", label: "🍽️ Dinner" },
              ]}
              selected={health.skippedMeals}
              onToggle={toggleMeal}
              color="#ef4444"
            />
            <div className="field-grid">
              <div className="text-field">
                <label className="text-label">Calories Consumed <span className="opt">(optional)</span></label>
                <input type="number" className="text-input" placeholder="e.g. 2100" value={health.caloriesConsumed} onChange={e => setHealth(p => ({ ...p, caloriesConsumed: e.target.value }))} />
              </div>
              <div className="text-field">
                <label className="text-label">Calorie Goal <span className="opt">(optional)</span></label>
                <input type="number" className="text-input" placeholder="e.g. 2400" value={health.calorieGoal} onChange={e => setHealth(p => ({ ...p, calorieGoal: e.target.value }))} />
              </div>
            </div>
            <div className="text-field" style={{ marginTop: "6px" }}>
              <label className="text-label">Meals & Foods Eaten Today <span className="opt">(optional — helps your Twin suggest precise nutrients)</span></label>
              <textarea 
                className="text-input" 
                style={{ minHeight: "64px", resize: "vertical" }}
                placeholder="e.g. Oats with flaxseeds and honey, brown rice with paneer curry and broccoli" 
                value={health.mealsEatenToday} 
                onChange={e => setHealth(p => ({ ...p, mealsEatenToday: e.target.value }))} 
              />
            </div>
          </div>
        </div>

        {/* ─── FINANCE CARD ─── */}
        <div className="domain-card fade-in fade-in-3">
          <div className="domain-header">
            <div className="domain-icon" style={{ background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", color: "#8b5cf6" }}>
              <Wallet size={20} />
            </div>
            <div>
              <div className="domain-title">Finance</div>
              <div className="domain-sub">Savings, spending & awareness</div>
            </div>
          </div>
          <div className="domain-body">
            <div className="field-grid">
              <div className="text-field">
                <label className="text-label">Amount Saved Today <span className="req">*</span></label>
                <input type="number" className="text-input" placeholder="₹ e.g. 350" value={finance.amountSaved} onChange={e => setFinance(p => ({ ...p, amountSaved: e.target.value }))} />
              </div>
              <div className="text-field">
                <label className="text-label">Discretionary Spending <span className="req">*</span></label>
                <input type="number" className="text-input" placeholder="₹ e.g. 60" value={finance.discretionarySpent} onChange={e => setFinance(p => ({ ...p, discretionarySpent: e.target.value }))} />
              </div>
            </div>
            <div className="field-grid">
              <div className="text-field">
                <label className="text-label">Biggest Expense Today <span className="opt">(optional)</span></label>
                <input type="text" className="text-input" placeholder="e.g. Swiggy, Amazon" value={finance.biggestExpenseToday} onChange={e => setFinance(p => ({ ...p, biggestExpenseToday: e.target.value }))} />
              </div>
              <div className="text-field">
                <label className="text-label">Spending Category</label>
                <select className="text-input" style={{ height: 42 }} value={finance.spendingCategory} onChange={e => setFinance(p => ({ ...p, spendingCategory: e.target.value }))}>
                  <option value="food">Food & Staples</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="shopping">Shopping</option>
                  <option value="transport">Transport</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div
              className={`toggle-row ${finance.impulseSpend ? "active" : ""}`}
              onClick={() => setFinance(p => ({ ...p, impulseSpend: !p.impulseSpend }))}
            >
              <div className={`toggle-switch ${finance.impulseSpend ? "on" : ""}`}>
                <div className="toggle-knob" />
              </div>
              <span className={`toggle-text ${finance.impulseSpend ? "active-text" : ""}`}>
                {finance.impulseSpend ? "⚠️ I made an impulse purchase today" : "Any impulse spending today?"}
              </span>
            </div>
          </div>
        </div>

        {/* ─── CAREER CARD ─── */}
        <div className="domain-card fade-in fade-in-4">
          <div className="domain-header">
            <div className="domain-icon" style={{ background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)", color: "#6366f1" }}>
              <Briefcase size={20} />
            </div>
            <div>
              <div className="domain-title">Career & Learning</div>
              <div className="domain-sub">Study, productivity & goal progress</div>
            </div>
          </div>
          <div className="domain-body">
            <div className="field-grid">
              <div className="text-field">
                <label className="text-label">Hours Studied <span className="req">*</span></label>
                <input type="number" className="text-input" placeholder="e.g. 3" value={career.hoursStudied} onChange={e => setCareer(p => ({ ...p, hoursStudied: e.target.value }))} />
              </div>
              <SyncSlider label="Productivity" value={career.productivityRating} onChange={v => setCareer(p => ({ ...p, productivityRating: v }))} min={1} max={10} step={1} icon={<TrendingUp size={14} />} unit="/10" color="#6366f1" />
            </div>
            <div className="field-grid">
              <div className="text-field">
                <label className="text-label">Course / Skill <span className="opt">(optional)</span></label>
                <input type="text" className="text-input" placeholder="e.g. ML Fundamentals" value={career.courseName} onChange={e => setCareer(p => ({ ...p, courseName: e.target.value }))} />
              </div>
              <div className="text-field">
                <label className="text-label">Sessions Done <span className="opt">(optional)</span></label>
                <input type="number" className="text-input" placeholder="e.g. 3" value={career.sessionsCompleted} onChange={e => setCareer(p => ({ ...p, sessionsCompleted: e.target.value }))} />
              </div>
            </div>
            <div className="text-field">
              <label className="text-label">What goal did you work toward today? <span className="opt">(optional)</span></label>
              <input type="text" className="text-input" placeholder="e.g. Practiced 5 LeetCode problems for Google prep" value={career.goalWorkedOn} onChange={e => setCareer(p => ({ ...p, goalWorkedOn: e.target.value }))} />
            </div>
            <div className="text-field">
              <label className="text-label">What blocked you today? <span className="opt">(optional)</span></label>
              <input type="text" className="text-input" placeholder="e.g. Too tired after work, couldn't focus" value={career.blockerToday} onChange={e => setCareer(p => ({ ...p, blockerToday: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* ─── DAILY NOTE ─── */}
        <div className="note-card fade-in fade-in-5">
          <div className="note-header">
            <div className="note-icon"><MessageSquare size={20} /></div>
            <div>
              <div className="domain-title">Daily Reflection</div>
              <div className="domain-sub">Your twin learns from how you feel</div>
            </div>
          </div>
          <div className="note-body">
            <p className="note-prompt">{todayPrompt}</p>
            <textarea
              className="note-textarea"
              placeholder="Write anything on your mind..."
              value={dailyNote}
              onChange={e => setDailyNote(e.target.value)}
              maxLength={500}
            />
            <div className="note-counter">{dailyNote.length}/500</div>
          </div>
        </div>

        {/* ─── FILE UPLOAD CARD (Mandatory) ─── */}
        <div className="file-upload-card fade-in fade-in-5">
          <div className="upload-header">
            <div className="upload-icon">
              <Upload size={20} />
            </div>
            <div>
              <div className="domain-title">File Upload</div>
              <div className="domain-sub">Ingest spreadsheets for automatic domain calibration</div>
            </div>
          </div>
          <div className="upload-body">
            <PillSelect
              label="Spreadsheet Domain Target"
              options={[
                { value: "health", label: "🟢 Health Domain" },
                { value: "finance", label: "🟣 Finance Domain" },
                { value: "career", label: "🔵 Career Domain" },
              ]}
              selected={[uploadDomain]}
              onToggle={(val) => setUploadDomain(val as any)}
              color="#3b82f6"
            />
            <div className="file-dropzone" onClick={() => document.getElementById("csv-file-input")?.click()}>
              <input
                id="csv-file-input"
                type="file"
                accept=".csv, .xlsx, .xls"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setUploadFile(file);
                }}
              />
              <Upload size={24} style={{ color: "#3b82f6", marginBottom: "8px" }} />
              <div className="dropzone-text">
                {uploadFile ? (
                  <strong style={{ color: "#0f172a" }}>{uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)</strong>
                ) : (
                  <>
                    <span style={{ color: "#3b82f6", fontWeight: 700 }}>Choose a file</span> or drag it here
                  </>
                )}
              </div>
              <div className="dropzone-subtext">Supports CSV, Excel (.xlsx, .xls)</div>
            </div>

            {uploadMessage && (
              <div className={`upload-status ${uploadMessage.type}`}>
                {uploadMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                <span>{uploadMessage.text}</span>
              </div>
            )}

            <button
              className="upload-submit-btn"
              onClick={handleFileUpload}
              disabled={!uploadFile || uploadLoading}
            >
              {uploadLoading ? (
                <><Activity size={16} className="spin" /> Ingesting spreadsheet...</>
              ) : (
                <><Send size={15} /> Ingest Spreadsheet</>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* ── IMPACT PREVIEW ── */}
      <div className="impact-section fade-in fade-in-5">
        <div className="impact-title"><Zap size={13} /> Score Impact Preview</div>
        <div className="impact-grid">
          <ImpactPreview label="Health" oldScore={currentScores.health} newScore={previewH} color="#3b82f6" icon={<HeartPulse size={18} />} />
          <ImpactPreview label="Finance" oldScore={currentScores.finance} newScore={previewF} color="#8b5cf6" icon={<Wallet size={18} />} />
          <ImpactPreview label="Career" oldScore={currentScores.career} newScore={previewC} color="#6366f1" icon={<Briefcase size={18} />} />
        </div>
      </div>

      {/* ── MESSAGE ── */}
      {message && (
        <div className="msg-banner">
          <div className="msg-inner">
            <AlertTriangle size={15} /> {message}
          </div>
        </div>
      )}

      {/* ── SUBMIT ── */}
      <div className="submit-section">
        <button className="submit-btn" onClick={handleSubmit} disabled={!canSubmit || loading}>
          {loading ? (
            <><Activity size={16} className="spin" /> Syncing all domains...</>
          ) : (
            <><Send size={16} /> Sync Twin</>
          )}
        </button>
      </div>
    </div>
  );
}