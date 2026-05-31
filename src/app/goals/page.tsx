"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import {
  HeartPulse,
  Wallet,
  Briefcase,
  Trash2,
  Target,
  CheckCircle2,
  ShieldAlert,
  ArrowLeft,
  Plus,
  Rocket,
  Calendar,
  Sparkles,
  ChevronLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Lock,
  Star,
  Zap,
  Award,
  Flame,
  Trophy,
  BookOpen,
} from "lucide-react";

type Milestone = {
  _id?: string;
  text: string;
  completed: boolean;
};

type Goal = {
  _id?: string;
  title: string;
  domain: "health" | "finance" | "career";
  priority: string;
  targetDate?: string;
  milestones?: Milestone[];
};

/* ─────────────────────────────────────────────
   Step Dots
───────────────────────────────────────────── */
const STEPS = ["Define", "Details", "Missions", "Review"];

const STEP_COLORS = [
  "linear-gradient(135deg, #2563eb, #3b82f6)",
  "linear-gradient(135deg, #8b5cf6, #a78bfa)",
  "linear-gradient(135deg, #3b82f6, #8b5cf6)",
  "linear-gradient(135deg, #10b981, #34d399)",
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
                ? { background: STEP_COLORS[i], boxShadow: "0 0 15px rgba(37,99,235,0.45)", border: "1.5px solid rgba(255,255,255,0.4)" }
                : completed.has(i)
                ? { background: "#10b981", borderColor: "#10b981", boxShadow: "0 0 10px rgba(16,185,129,0.3)" }
                : {}
            }
          >
            {completed.has(i) && i !== current ? (
              <CheckCircle2 size={12} color="#fff" />
            ) : (
              <span className="dot-num">{i + 1}</span>
            )}
          </div>
          <span
            className="dot-label"
            style={{ color: i === current ? "#60a5fa" : completed.has(i) ? "#10b981" : "#94a3b8" }}
          >
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <div
              className="dot-connector"
              style={{ background: completed.has(i) ? "#10b981" : "rgba(255,255,255,0.12)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Progress Bar
───────────────────────────────────────────── */
function ProgressBar({ pct, gradient }: { pct: number; gradient: string }) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${pct}%`, background: gradient }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   BADGES DATA
───────────────────────────────────────────── */
const BADGES = [
  { id: "week_warrior", label: "Week Warrior", desc: "7-day ingestion streak", icon: <Flame size={18} />, color: "#f97316", glow: "rgba(249,115,22,0.4)", unlocked: true },
  { id: "goal_crusher", label: "Goal Crusher", desc: "Complete 3 goals", icon: <Trophy size={18} />, color: "#eab308", glow: "rgba(234,179,8,0.4)", unlocked: true },
  { id: "apex_mind", label: "Apex Mind", desc: "Reach level 10", icon: <Star size={18} />, color: "#a855f7", glow: "rgba(168,85,247,0.4)", unlocked: false },
  { id: "lightning", label: "Lightning Fast", desc: "Log 5 quick entries", icon: <Zap size={18} />, color: "#3b82f6", glow: "rgba(59,130,246,0.4)", unlocked: false },
  { id: "scholar", label: "Scholar", desc: "Complete a course", icon: <BookOpen size={18} />, color: "#10b981", glow: "rgba(16,185,129,0.4)", unlocked: false },
];

/* ─────────────────────────────────────────────
   Active Twin Missions Widget
───────────────────────────────────────────── */
function ActiveMissionsWidget({
  goals,
  onToggleMilestone,
  floatXP,
}: {
  goals: Goal[];
  onToggleMilestone: (goalId: string, milestoneId: string, completed: boolean) => void;
  floatXP: { id: string; key: number } | null;
}) {
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  if (goals.length === 0) return null;

  return (
    <div className="twin-widget">
      <div className="twin-widget-header">
        <div className="twin-widget-title">
          <Rocket size={16} style={{ color: "#3b82f6" }} />
          <span>Active Twin Missions</span>
        </div>
        <span className="twin-count">{goals.length} active</span>
      </div>
      <div className="twin-goals-list">
        {goals.slice(0, 5).map((goal) => {
          const total = goal.milestones?.length ?? 0;
          const done = goal.milestones?.filter((m) => m.completed).length ?? 0;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const domainColor =
            goal.domain === "health" ? "#ef4444" : goal.domain === "finance" ? "#10b981" : "#3b82f6";
          const domainIcon =
            goal.domain === "health" ? <HeartPulse size={14} /> : goal.domain === "finance" ? <Wallet size={14} /> : <Briefcase size={14} />;
          const isExpanded = expandedGoal === goal._id;

          return (
            <div key={goal._id} className="twin-goal-row">
              <div
                className="twin-goal-header"
                onClick={() => setExpandedGoal(isExpanded ? null : goal._id || null)}
                style={{ cursor: "pointer" }}
              >
                <div className="twin-goal-icon" style={{ background: `${domainColor}15`, color: domainColor }}>
                  {domainIcon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="twin-goal-name">{goal.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <div className="twin-mini-track">
                      <div className="twin-mini-fill" style={{ width: `${pct}%`, background: domainColor }} />
                    </div>
                    {total > 0 && (
                      <span className="twin-fraction">{done}/{total}</span>
                    )}
                  </div>
                </div>
                {total > 0 && (
                  <div style={{ color: "#64748b", flexShrink: 0 }}>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                )}
              </div>

              {isExpanded && total > 0 && (
                <div className="twin-milestones">
                  {goal.milestones?.map((m) => (
                    <div key={m._id} className="twin-ms-row" style={{ position: "relative" }}>
                      <div
                        className={`twin-ms-check ${m.completed ? "twin-ms-checked" : ""}`}
                        onClick={() => goal._id && m._id && onToggleMilestone(goal._id, m._id, m.completed)}
                      >
                        {m.completed && <CheckCircle2 size={10} color="#fff" />}
                      </div>
                      <span className={`twin-ms-text ${m.completed ? "twin-ms-done" : ""}`}>{m.text}</span>
                      {floatXP && floatXP.id === m._id && (
                        <span className="xp-float" key={floatXP.key}>+100 XP</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Badge Showcase
───────────────────────────────────────────── */
function BadgeShowcase({ userBadges = [] }: { userBadges?: string[] }) {
  return (
    <div className="badge-showcase">
      <div className="badge-showcase-header">
        <Award size={16} style={{ color: "#eab308" }} />
        <span>Earned Badges</span>
      </div>
      <div className="badge-carousel">
        {BADGES.map((b) => {
          const isUnlocked = userBadges.some((ub: string) => 
            ub.toLowerCase() === b.label.toLowerCase() ||
            ub.toLowerCase() === b.id.toLowerCase() ||
            ub.toLowerCase() === b.id.replace("_", " ").toLowerCase()
          ) || (b.id === "goal_crusher" && userBadges.includes("Savings Streak"))
            || (b.id === "scholar" && userBadges.includes("Learning Machine"))
            || (b.id === "apex_mind" && userBadges.includes("Rising Twin"))
            || (b.id === "lightning" && userBadges.length > 0);

          return (
            <div
              key={b.id}
              className={`badge-item ${isUnlocked ? "badge-unlocked" : "badge-locked"}`}
              style={isUnlocked ? { border: `1.5px solid ${b.color}33`, boxShadow: `0 4px 16px ${b.glow}` } : {}}
            >
              <div
                className="badge-icon-ring"
                style={
                  isUnlocked
                    ? { background: `${b.color}15`, color: b.color, border: `1.5px solid ${b.color}44` }
                    : {}
                }
              >
                {isUnlocked ? b.icon : <Lock size={14} />}
              </div>
              <div className="badge-label">{b.label}</div>
              {isUnlocked && <div className="badge-desc">{b.desc}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function GoalsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [animDir, setAnimDir] = useState<"forward" | "backward">("forward");
  const [animating, setAnimating] = useState(false);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const [typedTitle, setTypedTitle] = useState("");
  const fullTitle = "Goals & Missions";

  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState<Goal["domain"]>("health");
  const [priority, setPriority] = useState("medium");
  const [targetDate, setTargetDate] = useState("");
  const [milestoneInput, setMilestoneInput] = useState("");
  const [milestones, setMilestones] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Left panel: expanded goal for milestone interaction
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [floatXP, setFloatXP] = useState<{ id: string; key: number } | null>(null);

  const { data, mutate } = useSWR<any>("/api/goals", fetcher, {
    dedupingInterval: 300000,
    revalidateOnFocus: false,
    errorRetryCount: 1,
  });
  const goals: Goal[] = data?.goals || [];

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

  const goTo = (target: number) => {
    if (animating) return;
    setAnimDir(target > step ? "forward" : "backward");
    setAnimating(true);
    setTimeout(() => {
      setStep(target);
      setMessage("");
      setAnimating(false);
    }, 320);
  };

  const stepProgress = [
    title.trim() ? 100 : 0,
    [domain, priority].filter(Boolean).length === 2 ? (targetDate ? 100 : 70) : 0,
    milestones.length > 0 ? Math.min(100, milestones.length * 25) : 0,
    goals.length > 0 ? 100 : 0,
  ];

  const canNext = [!!title.trim(), true, true, true][step];

  const handleNext = () => {
    if (!canNext) { setMessage("Please fill in all required fields before continuing."); return; }
    setCompleted(prev => new Set([...prev, step]));
    if (step < 3) goTo(step + 1);
  };

  const handleBack = () => { if (step > 0) goTo(step - 1); };

  const addMilestone = () => {
    if (!milestoneInput.trim()) return;
    setMilestones([...milestones, milestoneInput.trim()]);
    setMilestoneInput("");
  };

  const removeMilestone = (i: number) => setMilestones(milestones.filter((_, idx) => idx !== i));

  const createGoal = async () => {
    if (!title.trim()) { setMessage("Goal title required."); return; }
    setLoading(true); setMessage("");
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, domain, priority, targetDate: targetDate || undefined, milestones: milestones.map((m) => ({ text: m, completed: false })) }),
      });
      const d = await res.json();
      if (d.success) {
        mutate({ goals: d.goals }, false);
        setCompleted(new Set([0, 1, 2, 3]));
        setSubmitted(true);
        setTimeout(() => router.push("/dashboard"), 2800);
      } else { setMessage(d.message || d.error || "Failed to create goal."); }
    } catch { setMessage("Goal creation failed."); }
    finally { setLoading(false); }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const res = await fetch("/api/goals", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ goalId }),
      });
      const d = await res.json();
      if (d.success) { mutate({ goals: d.goals }, false); setMessage("Goal removed."); }
      else setMessage(d.message || d.error || "Failed to remove goal.");
    } catch { setMessage("Delete failed."); }
  };

  const toggleMilestone = async (goalId: string, milestoneId: string, completed: boolean) => {
    try {
      const res = await fetch("/api/goals/milestone", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ goalId, milestoneId, completed: !completed }),
      });
      const d = await res.json();
      if (d.success) {
        mutate({ goals: d.goals }, false);
        if (!completed) {
          setFloatXP({ id: milestoneId, key: Date.now() });
          setTimeout(() => setFloatXP(null), 1400);
        }
      }
      else setMessage(d.message || "Failed to update milestone.");
    } catch { setMessage("Milestone update failed."); }
  };

  const deleteMilestone = async (goalId: string, milestoneId: string) => {
    try {
      const res = await fetch("/api/goals/milestone", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ goalId, milestoneId }),
      });
      const d = await res.json();
      if (d.success) mutate({ goals: d.goals }, false);
      else setMessage(d.message || "Failed to delete milestone.");
    } catch { setMessage("Milestone deletion failed."); }
  };

  if (!mounted) return null;

  const isError = (msg: string) =>
    msg.toLowerCase().includes("fail") || msg.includes("required") || msg.includes("fill") || msg.includes("complete");

  const gradients = [
    "linear-gradient(90deg,#3b82f6,#60a5fa)",
    "linear-gradient(90deg,#8b5cf6,#a78bfa)",
    "linear-gradient(90deg,#3b82f6,#8b5cf6)",
    "linear-gradient(90deg,#10b981,#34d399)",
  ];
  const btnGradients = [
    "linear-gradient(135deg,#3b82f6,#60a5fa)",
    "linear-gradient(135deg,#8b5cf6,#a78bfa)",
    "linear-gradient(135deg,#3b82f6,#8b5cf6)",
    "linear-gradient(135deg,#10b981,#34d399)",
  ];
  const btnShadows = [
    "0 4px 14px rgba(59,130,246,0.3)",
    "0 4px 14px rgba(139,92,246,0.3)",
    "0 4px 14px rgba(59,130,246,0.3)",
    "0 4px 14px rgba(16,185,129,0.3)",
  ];
  const iconRings = [
    { bg: "rgba(37, 99, 235, 0.08)", color: "#3b82f6" },
    { bg: "rgba(139, 92, 246, 0.08)", color: "#8b5cf6" },
    { bg: "rgba(16, 185, 129, 0.08)", color: "#10b981" },
    { bg: "rgba(99, 102, 241, 0.08)", color: "#6366f1" },
  ];
  const domainConfig = {
    health:  { stripe: "linear-gradient(90deg,#ef4444,#f97316)", badge: { background: "rgba(239, 68, 68, 0.08)", color: "#ef4444" }, ring: { background: "rgba(239, 68, 68, 0.08)", color: "#ef4444" }, icon: <HeartPulse size={16} />, progressColor: "#ef4444" },
    finance: { stripe: "linear-gradient(90deg,#10b981,#059669)", badge: { background: "rgba(16, 185, 129, 0.08)", color: "#10b981" }, ring: { background: "rgba(16, 185, 129, 0.08)", color: "#10b981" }, icon: <Wallet size={16} />, progressColor: "#10b981" },
    career:  { stripe: "linear-gradient(90deg,#3b82f6,#6366f1)", badge: { background: "rgba(59, 130, 246, 0.08)", color: "#3b82f6" }, ring: { background: "rgba(59, 130, 246, 0.08)", color: "#3b82f6" }, icon: <Briefcase size={16} />, progressColor: "#3b82f6" },
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: '"Plus Jakarta Sans","Inter",-apple-system,sans-serif',
      display: "flex",
      alignItems: "stretch",
    }}>
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

        /* ── Left Panel ── */
        .page-left { width: 340px; min-height: 100vh; flex-shrink: 0; background: linear-gradient(135deg, #0b0f19 0%, #1e293b 50%, #0b0f19 100%); display: flex; flex-direction: column; justify-content: center; padding: 48px 44px; position: relative; overflow: hidden; }
        .page-left::before { content: ''; position: absolute; top: -80px; left: -80px; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%); pointer-events: none; }
        .page-left::after { content: ''; position: absolute; bottom: -60px; right: -60px; width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%); pointer-events: none; }
        .brand-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 9999px; padding: 6px 14px; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 700; color: #60a5fa; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 28px; }
        .left-title { font-family: 'Sora', sans-serif; font-size: 2rem; font-weight: 800; color: #ffffff; line-height: 1.2; letter-spacing: -0.04em; margin-bottom: 14px; }
        .left-title span { color: #60a5fa; font-weight: 800; }
        .left-sub { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.83rem; color: #94a3b8; line-height: 1.7; margin-bottom: 36px; }
        .left-steps { display: flex; flex-direction: column; gap: 18px; }
        .left-step { display: flex; align-items: center; gap: 14px; transition: all 0.3s ease; }
        .left-step-dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid rgba(255, 255, 255, 0.2); background: transparent; flex-shrink: 0; transition: all 0.3s ease; }
        .left-step.active .left-step-dot { background: #3b82f6; border-color: #3b82f6; box-shadow: 0 0 12px #3b82f6; transform: scale(1.2); }
        .left-step-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem; font-weight: 500; color: rgba(255,255,255,0.4); transition: all 0.3s ease; }
        .left-step-text.active { color: #ffffff; font-weight: 700; letter-spacing: -0.01em; }

        /* ── Split layout ── */
        .page-right { flex: 1; background: #f8fafc; display: flex; flex-direction: row; gap: 0; min-height: 100vh; overflow: hidden; }

        /* ── Goals Control Panel - Left Section (Always-On) ── */
        .goals-control-left { width: 340px; flex-shrink: 0; background: rgba(255, 255, 255, 0.45); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-right: 1px solid rgba(37, 99, 235, 0.08); display: flex; flex-direction: column; overflow-y: auto; }
        .gcl-header { padding: 32px 24px 20px; border-bottom: 1px solid rgba(37, 99, 235, 0.05); }
        .gcl-title { font-family: 'Sora', sans-serif; font-size: 1.15rem; font-weight: 800; color: var(--text-main); letter-spacing: -0.03em; margin-bottom: 4px; }
        .gcl-sub { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: var(--text-sub); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .gcl-body { flex: 1; padding: 20px 16px; display: flex; flex-direction: column; gap: 12px; }
        .gcl-empty { padding: 48px 16px; text-align: center; color: #94a3b8; font-size: 0.84rem; line-height: 1.6; }
        .gcl-goal-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(8px); border: 1.5px solid rgba(0, 85, 238, 0.06); border-radius: 16px; overflow: hidden; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); box-shadow: 0 4px 16px rgba(0, 68, 220, 0.02); }
        .gcl-goal-card:hover { transform: translateY(-3px); border-color: rgba(37, 99, 235, 0.25); box-shadow: 0 12px 28px rgba(37, 99, 235, 0.08); background: #ffffff; }
        .gcl-goal-top { padding: 14px 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .gcl-domain-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform 0.2s ease; }
        .gcl-goal-card:hover .gcl-domain-icon { transform: scale(1.05); }
        .gcl-goal-info { flex: 1; min-width: 0; }
        .gcl-goal-name { font-size: 0.88rem; font-weight: 700; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .gcl-goal-meta { font-size: 0.74rem; color: var(--text-sub); margin-top: 3px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .gcl-ms-bar { margin: 0 16px 12px; }
        .gcl-ms-track { height: 4px; background: #e2e8f0; border-radius: 999px; overflow: hidden; }
        .gcl-ms-fill { height: 100%; border-radius: 999px; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .gcl-expand-btn { color: #cbd5e1; flex-shrink: 0; display: flex; align-items: center; transition: color 0.2s; }
        .gcl-goal-card:hover .gcl-expand-btn { color: var(--text-sub); }

        /* milestone expanded */
        .gcl-milestones { padding: 6px 16px 14px; display: flex; flex-direction: column; gap: 6px; border-top: 1px solid rgba(37, 99, 235, 0.04); background: rgba(248, 250, 252, 0.5); }
        .gcl-ms-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; animation: fadeIn 0.2s ease; position: relative; }
        .gcl-ms-check { width: 18px; height: 18px; border-radius: 6px; border: 2px solid #cbd5e1; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all 0.2s ease; }
        .gcl-ms-check:hover { border-color: var(--primary); background: rgba(37, 99, 235, 0.05); }
        .gcl-ms-check-done { background: #10b981; border-color: #10b981 !important; box-shadow: 0 0 8px rgba(16, 185, 129, 0.3); }
        .gcl-ms-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem; font-weight: 500; color: var(--text-main); flex: 1; transition: all 0.2s ease; }
        .gcl-ms-text-done { text-decoration: line-through; color: #94a3b8; }
        .gcl-ms-del { background: none; border: none; color: #cbd5e1; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 6px; transition: all 0.15s; }
        .gcl-ms-del:hover { color: #ef4444; background: rgba(239, 68, 68, 0.08); }

        /* ── Goals Creator - Right Section ── */
        .goals-control-right { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 36px 32px; overflow-y: auto; }
        .main-wrapper { width: 100%; max-width: 580px; }

        .exit-bar { display: inline-flex; align-items: center; gap: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem; font-weight: 600; color: var(--text-sub); text-decoration: none; margin-bottom: 24px; padding: 8px 16px; border-radius: 9999px; background: #ffffff; border: 1.5px solid rgba(0, 85, 238, 0.06); transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; width: fit-content; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .exit-bar:hover { color: var(--primary); border-color: var(--primary); background: rgba(37, 99, 235, 0.05); transform: translateX(-3px); box-shadow: 0 4px 16px rgba(37, 99, 235, 0.1); }

        .title-container { margin-bottom: 24px; }
        .dynamic-title { font-family: 'Sora', sans-serif; font-size: clamp(1.5rem, 3vw, 2.1rem); font-weight: 800; color: var(--text-main); letter-spacing: -0.04em; margin-bottom: 6px; display: flex; align-items: center; gap: 2px; }
        .title-accent { background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .cursor { display: inline-block; width: 3px; height: 1.9rem; background-color: var(--primary); margin-left: 4px; animation: blink 0.7s infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        .dynamic-sub { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.86rem; color: var(--text-sub); line-height: 1.6; }

        /* ── Step Dots ── */
        .step-dots { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 24px; background: rgba(15, 21, 32, 0.95); border-radius: 16px; padding: 12px 24px; box-shadow: 0 8px 32px rgba(15, 21, 32, 0.15); border: 1px solid rgba(255,255,255,0.06); }
        .step-dot-wrapper { display: flex; align-items: center; gap: 0; position: relative; }
        .step-dot { width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); flex-shrink: 0; border: 1.5px solid rgba(255,255,255,0.12); }
        .dot-active { transform: scale(1.15); border-color: rgba(255, 255, 255, 0.3); }
        .dot-num { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.4); }
        .dot-active .dot-num { color: #ffffff; }
        .dot-label { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.72rem; font-weight: 600; margin-left: 8px; white-space: nowrap; transition: all 0.3s ease; }
        .dot-connector { height: 2px; width: 40px; margin: 0 10px; transition: background 0.4s; flex-shrink: 0; }

        /* ── Progress Bar ── */
        .progress-track { height: 5px; background: #e2e8f0; width: 100%; border-radius: 0; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 0; transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }

        /* ── Step Card ── */
        .step-card { background: var(--card-bg); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-radius: 24px; border: 1.5px solid rgba(37, 99, 235, 0.06); overflow: hidden; box-shadow: 0 10px 40px rgba(37, 99, 235, 0.04), 0 1px 4px rgba(0,0,0,0.02); transition: border-color 0.3s ease, box-shadow 0.3s ease; }
        .step-card:hover { border-color: rgba(37, 99, 235, 0.12); box-shadow: 0 12px 48px rgba(37, 99, 235, 0.06); }
        .card-header { padding: 22px 24px 18px; border-bottom: 1px solid rgba(37, 99, 235, 0.05); display: flex; align-items: center; gap: 14px; }
        .icon-ring { width: 46px; height: 46px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .card-label { display: flex; flex-direction: column; gap: 3px; }
        .card-title { font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 800; color: var(--text-main); letter-spacing: -0.01em; }
        .card-sub { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.78rem; color: var(--text-sub); font-weight: 500; }
        .card-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }

        /* ── Form Elements ── */
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-label { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.8rem; font-weight: 700; color: var(--text-main); letter-spacing: 0.01em; }
        .req { color: #ef4444; margin-left: 2px; }
        .opt-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; color: var(--text-sub); font-weight: 500; margin-left: 4px; text-transform: uppercase; }
        .form-input { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.88rem; padding: 10px 14px; border-radius: 12px; border: 1.5px solid #cbd5e1; background: rgba(248, 250, 252, 0.8); color: var(--text-main); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); width: 100%; box-sizing: border-box; height: 44px; }
        .form-input:focus { outline: none; border-color: var(--primary); background: #fff; box-shadow: 0 0 0 4px var(--primary-glow); }
        .form-input::placeholder { color: #a1a1aa; font-size: 0.84rem; }
        select.form-input { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; background-size: 16px; padding-right: 40px; }
        .section-divider { height: 1px; background: rgba(37, 99, 235, 0.05); margin: 6px 0; }

        /* ── Card Footer ── */
        .card-footer { padding: 16px 24px 22px; display: flex; align-items: center; gap: 12px; border-top: 1px solid rgba(37, 99, 235, 0.05); background: rgba(248, 250, 252, 0.4); }
        .nav-btn { display: flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 12px; border: 1.5px solid #cbd5e1; background: #fff; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.86rem; font-weight: 700; color: var(--text-sub); cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap; height: 44px; }
        .nav-btn:hover { border-color: var(--primary); color: var(--primary); background: rgba(37, 99, 235, 0.05); }
        .nav-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .submit-btn { flex: 1; height: 44px; border-radius: 12px; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.88rem; font-weight: 700; color: #fff; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .submit-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
        .submit-btn:active:not(:disabled) { transform: translateY(1px); }
        .submit-btn:disabled { background: #cbd5e1 !important; box-shadow: none !important; cursor: not-allowed; transform: none; filter: none; color: #94a3b8; }

        .progress-label { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 700; color: var(--text-sub); text-align: right; padding: 6px 24px 0; text-transform: uppercase; letter-spacing: 0.05em; }

        /* ── Status Banner ── */
        .live-status-banner { display: flex; align-items: center; gap: 12px; border-radius: 14px; padding: 12px 16px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.86rem; font-weight: 600; margin-bottom: 16px; border: 1px solid; animation: slideDown 0.3s ease; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        /* ── Animations ── */
        @keyframes slideInForward { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInBackward { from { opacity:0; transform:translateX(-30px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideOutForward { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(-30px); } }
        @keyframes slideOutBackward { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(30px); } }
        .slide-enter-forward { animation: slideInForward 0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
        .slide-enter-backward { animation: slideInBackward 0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
        .slide-exit-forward { animation: slideOutForward 0.28s ease forwards; }
        .slide-exit-backward { animation: slideOutBackward 0.28s ease forwards; }

        /* ── Success Card ── */
        .success-card { background: #ffffff; border-radius: 24px; border: 1.5px solid rgba(16, 185, 129, 0.25); padding: 48px 32px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; box-shadow: 0 12px 40px rgba(16, 185, 129, 0.08); animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .success-icon { width: 68px; height: 68px; border-radius: 50%; background: linear-gradient(135deg,#10b981,#059669); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(16,185,129,0.3); margin-bottom: 6px; }
        .success-title { font-family: 'Sora', sans-serif; font-size: 1.6rem; font-weight: 800; color: var(--text-main); letter-spacing: -0.03em; }
        .success-sub { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.9rem; color: var(--text-sub); line-height: 1.6; max-width: 380px; }

        /* ── Milestone chip ── */
        .ms-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .chip { display: inline-flex; align-items: center; gap: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.8rem; font-weight: 700; padding: 6px 14px; border-radius: 9999px; background: rgba(37, 99, 235, 0.08); color: var(--primary); border: 1.5px solid rgba(37, 99, 235, 0.15); animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .chip-x { cursor: pointer; color: rgba(37, 99, 235, 0.5); font-size: 0.95rem; line-height: 1; transition: color 0.15s; }
        .chip-x:hover { color: #ef4444; }

        /* ── Goals List (Step 3 review) ── */
        .goals-list { display: flex; flex-direction: column; gap: 10px; max-height: 280px; overflow-y: auto; padding-right: 4px; scrollbar-width: thin; }
        .goal-item { background: rgba(255, 255, 255, 0.8); border-radius: 14px; border: 1px solid rgba(0, 85, 238, 0.06); padding: 12px 16px; display: flex; align-items: center; gap: 12px; transition: all 0.2s ease; }
        .goal-item:hover { background: #ffffff; border-color: rgba(37, 99, 235, 0.2); box-shadow: 0 4px 16px rgba(37, 99, 235, 0.04); }
        .goal-title-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.88rem; font-weight: 700; color: var(--text-main); line-height: 1.4; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .goal-meta { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.74rem; color: var(--text-sub); margin-top: 4px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .goal-ms-progress { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 6px; background: rgba(37, 99, 235, 0.08); color: var(--primary); }
        .btn-delete-goal { width: 30px; height: 30px; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.15); background: rgba(239, 68, 68, 0.05); color: #ef4444; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; flex-shrink: 0; }
        .btn-delete-goal:hover { background: #ef4444; color: #ffffff; border-color: #ef4444; }

        /* ── Add milestone row (Step 2) ── */
        .add-row { display: flex; gap: 12px; align-items: center; }
        .add-btn { display: flex; align-items: center; gap: 6px; padding: 0 16px; height: 44px; border-radius: 12px; border: 1.5px solid rgba(37, 99, 235, 0.15); background: rgba(37, 99, 235, 0.06); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.86rem; font-weight: 700; color: var(--primary); cursor: pointer; transition: all 0.2s ease; white-space: nowrap; }
        .add-btn:hover { background: var(--primary); color: #ffffff; border-color: var(--primary); }

        /* ── Active Twin Missions Widget ── */
        .twin-widget { background: rgba(255,255,255,0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1.5px solid rgba(37, 99, 235, 0.08); border-radius: 20px; padding: 20px; box-shadow: 0 10px 30px rgba(37, 99, 235, 0.04); margin-bottom: 20px; transition: all 0.3s ease; }
        .twin-widget:hover { border-color: rgba(37, 99, 235, 0.15); box-shadow: 0 12px 36px rgba(37, 99, 235, 0.06); }
        .twin-widget-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .twin-widget-title { display: flex; align-items: center; gap: 8px; font-family: 'Sora', sans-serif; font-size: 0.88rem; font-weight: 700; color: var(--text-main); }
        .twin-count { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 700; background: rgba(37, 99, 235, 0.08); color: var(--primary); border-radius: 9999px; padding: 3px 10px; border: 1px solid rgba(37, 99, 235, 0.12); }
        .twin-goals-list { display: flex; flex-direction: column; gap: 8px; }
        .twin-goal-row { border-radius: 12px; background: rgba(248, 250, 252, 0.6); border: 1px solid rgba(37, 99, 235, 0.04); overflow: hidden; transition: all 0.2s ease; }
        .twin-goal-row:hover { background: rgba(255, 255, 255, 0.9); border-color: rgba(37, 99, 235, 0.1); }
        .twin-goal-header { display: flex; align-items: center; gap: 12px; padding: 12px 14px; }
        .twin-goal-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .twin-goal-name { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.86rem; font-weight: 700; color: var(--text-main); }
        .twin-mini-track { flex: 1; height: 4px; background: #e2e8f0; border-radius: 999px; overflow: hidden; }
        .twin-mini-fill { height: 100%; border-radius: 999px; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .twin-fraction { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 700; color: var(--primary); white-space: nowrap; }
        .twin-milestones { border-top: 1px solid rgba(37, 99, 235, 0.05); padding: 10px 14px 12px; display: flex; flex-direction: column; gap: 6px; background: rgba(255, 255, 255, 0.4); }
        .twin-ms-row { display: flex; align-items: center; gap: 10px; position: relative; }
        .twin-ms-check { width: 16px; height: 16px; border-radius: 5px; border: 2px solid #cbd5e1; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all 0.2s ease; }
        .twin-ms-check:hover { border-color: var(--primary); }
        .twin-ms-checked { background: #10b981; border-color: #10b981 !important; box-shadow: 0 0 6px rgba(16, 185, 129, 0.3); }
        .twin-ms-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.81rem; font-weight: 500; color: var(--text-main); transition: all 0.2s ease; }
        .twin-ms-done { text-decoration: line-through; color: #94a3b8; }
        @keyframes floatUp { 0% { opacity: 0; transform: translateY(8px) scale(0.8); } 15% { opacity: 1; transform: translateY(0) scale(1); } 85% { opacity: 1; transform: translateY(-20px) scale(1); } 100% { opacity: 0; transform: translateY(-28px) scale(0.9); } }
        .xp-float { position: absolute; right: 0; top: -6px; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; font-weight: 800; color: #10b981; text-shadow: 0 2px 8px rgba(16, 185, 129, 0.2); animation: floatUp 1.4s cubic-bezier(0.25, 1, 0.5, 1) forwards; pointer-events: none; }

        /* ── Badge Showcase ── */
        .badge-showcase { background: rgba(255,255,255,0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1.5px solid rgba(37, 99, 235, 0.08); border-radius: 20px; padding: 18px 20px; box-shadow: 0 10px 30px rgba(37, 99, 235, 0.04); margin-bottom: 24px; }
        .badge-showcase-header { display: flex; align-items: center; gap: 8px; font-family: 'Sora', sans-serif; font-size: 0.86rem; font-weight: 700; color: var(--text-main); margin-bottom: 14px; }
        .badge-carousel { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 6px; scrollbar-width: thin; scrollbar-color: rgba(37, 99, 235, 0.15) transparent; }
        .badge-carousel::-webkit-scrollbar { height: 4px; }
        .badge-carousel::-webkit-scrollbar-track { background: transparent; }
        .badge-carousel::-webkit-scrollbar-thumb { background: rgba(37, 99, 235, 0.15); border-radius: 10px; }
        .badge-item { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 14px; border-radius: 14px; border: 1px solid; min-width: 90px; flex-shrink: 0; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .badge-item:hover { transform: translateY(-4px); }
        .badge-unlocked { background: #ffffff; border-color: rgba(37, 99, 235, 0.08); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.03); }
        .badge-locked { background: rgba(248, 250, 252, 0.8); border-color: rgba(0, 85, 238, 0.04); opacity: 0.5; }
        .badge-icon-ring { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
        .badge-item:hover .badge-icon-ring { transform: scale(1.1) rotate(5deg); }
        .badge-locked .badge-icon-ring { background: #e2e8f0; color: #94a3b8; border: none; }
        .badge-label { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.72rem; font-weight: 700; color: var(--text-main); text-align: center; white-space: nowrap; }
        .badge-locked .badge-label { color: #94a3b8; }
        .badge-desc { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.62rem; color: var(--text-sub); text-align: center; line-height: 1.3; }

        @media (max-width: 1100px) { .page-left { display: none; } }
        @media (max-width: 860px) {
          .page-right { flex-direction: column; }
          .goals-control-left { width: 100%; min-height: auto; border-right: none; border-bottom: 1px solid #e8ebf4; max-height: 360px; }
          .goals-control-right { padding: 24px 16px; }
        }
        @media (max-width: 600px) { .dot-connector { width: 16px; } .dot-label { display: none; } .field-row { grid-template-columns: 1fr; } }
      `}</style>

      {/* ── Left Panel ── */}
      <div className="page-left">
        <div className="brand-badge"><Sparkles size={11} /> Syntra AI</div>
        <h2 className="left-title">Define your <span>mission</span> parameters.</h2>
        <p className="left-sub">Set health, career, and financial goals. Syntra tracks every milestone and optimises your trajectory.</p>
        <div className="left-steps">
          {[
            { label: "Define Objective" },
            { label: "Set Details" },
            { label: "Add Milestones" },
            { label: "Review Goals" },
          ].map((s, i) => (
            <div className={`left-step ${i === step ? "active" : ""}`} key={i}>
              <div
                className="left-step-dot"
                style={{
                  background: i === step ? "#ffffff" : completed.has(i) ? "#10b981" : "rgba(255,255,255,0.25)",
                  boxShadow: i === step ? "0 0 10px rgba(255,255,255,0.8)" : completed.has(i) ? "0 0 8px rgba(16,185,129,0.5)" : "none"
                }}
              />
              <span className={`left-step-text ${i === step ? "active" : ""}`} style={{ color: completed.has(i) && i !== step ? "#10b981" : undefined }}>
                {s.label} {completed.has(i) && i !== step && "✓"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel: Split View ── */}
      <div className="page-right">

        {/* ── LEFT SECTION: Always-On Goals List ── */}
        <div className="goals-control-left">
          <div className="gcl-header">
            <div className="gcl-title">Active Goals</div>
            <div className="gcl-sub">{goals.length} goal{goals.length !== 1 ? "s" : ""} in progress</div>
          </div>
          <div className="gcl-body">
            {goals.length === 0 ? (
              <div className="gcl-empty">No active goals yet.<br />Create one using the wizard →</div>
            ) : (
              goals.map((goal) => {
                const total = goal.milestones?.length ?? 0;
                const done = goal.milestones?.filter((m) => m.completed).length ?? 0;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                const dc = domainConfig[goal.domain];
                const pClass = goal.priority === "high" ? "p-high" : goal.priority === "medium" ? "p-medium" : "p-low";
                const isExp = expandedGoalId === goal._id;

                // Precompute inline finance deficit math to keep user mathematically aligned
                let inlineFinanceElement = null;
                if (goal.domain === "finance") {
                  let targetAmount = 1500000;
                  const numMatch = goal.title.replace(/,/g, '').match(/\d+/);
                  if (numMatch) {
                    targetAmount = parseInt(numMatch[0]);
                  } else if (goal.title.toLowerCase().includes("thar")) {
                    targetAmount = 1500000;
                  } else if (goal.title.toLowerCase().includes("zomato")) {
                    targetAmount = 5000;
                  }

                  const targetDate = goal.targetDate ? new Date(goal.targetDate) : new Date(Date.now() + 24 * 30 * 24 * 3600 * 1000);
                  const monthsRemaining = Math.max(1, Math.round((targetDate.getTime() - Date.now()) / (30 * 24 * 3600 * 1000)));
                  const requiredMonthlySavings = Math.round(targetAmount / monthsRemaining);
                  const actualSavings = Math.round(requiredMonthlySavings - 3000); // simulate deficit
                  const deficit = Math.max(0, requiredMonthlySavings - actualSavings);

                  inlineFinanceElement = (
                    <div className="gcl-finance-math" style={{
                      margin: "6px 14px 12px",
                      padding: "10px 12px",
                      background: deficit > 0 ? "rgba(239, 68, 68, 0.04)" : "rgba(16, 185, 129, 0.04)",
                      borderRadius: "10px",
                      border: `1.5px solid ${deficit > 0 ? "rgba(239, 68, 68, 0.12)" : "rgba(16, 185, 129, 0.12)"}`,
                      fontFamily: '"JetBrains Mono", monospace'
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", fontWeight: 700, color: "var(--text-sub)" }}>
                        <span>Monthly Req: ₹{requiredMonthlySavings.toLocaleString("en-IN")}</span>
                        <span style={{ color: "var(--primary)" }}>{monthsRemaining}mo left</span>
                      </div>
                      <div style={{ fontSize: "0.74rem", fontWeight: 700, color: deficit > 0 ? "#ef4444" : "#10b981", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                        {deficit > 0 ? <ShieldAlert size={12} style={{ color: "#ef4444" }} /> : <CheckCircle2 size={12} style={{ color: "#10b981" }} />}
                        <span>{deficit > 0 ? `₹${deficit.toLocaleString("en-IN")} deficit` : "On Track"}</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="gcl-goal-card" key={goal._id}>
                    <div className="gcl-goal-top" onClick={() => setExpandedGoalId(isExp ? null : goal._id || null)}>
                      <div className="gcl-domain-icon" style={{ background: dc.ring.background, color: dc.ring.color }}>
                        {dc.icon}
                      </div>
                      <div className="gcl-goal-info">
                        <div className="gcl-goal-name">{goal.title}</div>
                        <div className="gcl-goal-meta">
                          <span className={`goal-priority-badge ${pClass}`} style={{ fontSize: "0.65rem" }}>{goal.priority}</span>
                          {total > 0 && <span style={{ color: "var(--primary)", fontWeight: 700 }}>{done}/{total}</span>}
                          {goal.targetDate && (
                            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                              <Calendar size={10} />
                              {new Date(goal.targetDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="gcl-expand-btn">
                        {total > 0 ? (isExp ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : null}
                      </div>
                    </div>
                    {total > 0 && (
                      <div className="gcl-ms-bar">
                        <div className="gcl-ms-track">
                          <div className="gcl-ms-fill" style={{ width: `${pct}%`, background: dc.progressColor }} />
                        </div>
                      </div>
                    )}
                    {inlineFinanceElement}
                    {isExp && total > 0 && (
                      <div className="gcl-milestones">
                        {goal.milestones?.map((m) => (
                          <div className="gcl-ms-row" key={m._id}>
                            <div
                              className={`gcl-ms-check ${m.completed ? "gcl-ms-check-done" : ""}`}
                              onClick={() => goal._id && m._id && toggleMilestone(goal._id, m._id, m.completed)}
                            >
                              {m.completed && <CheckCircle2 size={9} color="#fff" />}
                            </div>
                            <span className={`gcl-ms-text ${m.completed ? "gcl-ms-text-done" : ""}`}>{m.text}</span>
                            {floatXP && floatXP.id === m._id && (
                              <span className="xp-float" key={floatXP.key} style={{ right: 28 }}>+100 XP</span>
                            )}
                            <button className="gcl-ms-del" onClick={() => goal._id && m._id && deleteMilestone(goal._id, m._id)}>
                              <Trash2 size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── RIGHT SECTION: Goal Creator Wizard ── */}
        <div className="goals-control-right">
          <div className="main-wrapper">

            <div className="exit-bar" onClick={() => router.push("/dashboard")}>
              <ArrowLeft size={14} /> <span>Return to Dashboard</span>
            </div>

            {/* Active Twin Missions Widget */}
            {goals.length > 0 && (
              <ActiveMissionsWidget goals={goals} onToggleMilestone={toggleMilestone} floatXP={floatXP} />
            )}

            {/* Badge Showcase */}
            <BadgeShowcase userBadges={data?.badges || []} />

            <div className="title-container">
              <h1 className="dynamic-title">
                <span className="title-accent">{typedTitle}</span>
                <span className="cursor" />
              </h1>
              <p className="dynamic-sub">Define objectives, lock in milestones, and let Syntra optimize your path.</p>
            </div>

            <StepDots current={step} completed={completed} />

            {message && !submitted && (
              <div className="live-status-banner" style={{ borderColor: isError(message) ? "rgba(239, 68, 68, 0.2)" : "rgba(37, 99, 235, 0.2)", background: isError(message) ? "rgba(239, 68, 68, 0.04)" : "rgba(37, 99, 235, 0.04)", color: isError(message) ? "#ef4444" : "var(--primary)" }}>
                {isError(message) ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
                <span style={{ fontWeight: 600 }}>{message}</span>
              </div>
            )}

            {submitted ? (
              <div className="success-card">
                <div className="success-icon"><CheckCircle2 size={34} color="#fff" /></div>
                <h2 className="success-title">Mission Established</h2>
                <p className="success-sub">Your goal has been logged and your milestones are now tracked. Syntra is recalibrating your optimal trajectory.</p>
              </div>
            ) : (
              <div className={`step-card ${animating ? (animDir === "forward" ? "slide-exit-forward" : "slide-exit-backward") : (animDir === "forward" ? "slide-enter-forward" : "slide-enter-backward")}`}>
                <ProgressBar pct={stepProgress[step]} gradient={gradients[step]} />
                <div className="progress-label">{stepProgress[step]}% complete</div>

                {/* ── Step 0: Define Objective ── */}
                {step === 0 && (
                  <>
                    <div className="card-header">
                      <div className="icon-ring" style={{ background: iconRings[0].bg, color: iconRings[0].color }}><Target size={22} /></div>
                      <div className="card-label">
                        <span className="card-title">Define Objective</span>
                        <span className="card-sub">Name your mission target</span>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="field">
                        <label className="form-label">Objective Title <span className="req">*</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g., Run 5k under 25 minutes"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          style={{ height: 44, fontSize: "0.93rem" }}
                        />
                      </div>
                      <div className="field">
                        <label className="form-label">Domain</label>
                        <select className="form-input" value={domain} onChange={(e) => setDomain(e.target.value as Goal["domain"])}>
                          <option value="health">Health</option>
                          <option value="finance">Finance</option>
                          <option value="career">Career</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* ── Step 1: Set Details ── */}
                {step === 1 && (
                  <>
                    <div className="card-header">
                      <div className="icon-ring" style={{ background: iconRings[1].bg, color: iconRings[1].color }}><Calendar size={22} /></div>
                      <div className="card-label">
                        <span className="card-title">Goal Parameters</span>
                        <span className="card-sub">Priority and timeline configuration</span>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="field-row">
                        <div className="field">
                          <label className="form-label">Priority Layer</label>
                          <select className="form-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        <div className="field">
                          <label className="form-label">Target Date <span className="opt-tag">(optional)</span></label>
                          <input type="date" className="form-input" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
                        </div>
                      </div>
                      <div className="section-divider" />
                      <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "6px 0" }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: domainConfig[domain].ring.background, display: "flex", alignItems: "center", justifyContent: "center", color: domainConfig[domain].ring.color, flexShrink: 0 }}>
                          {domainConfig[domain].icon}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-main)" }}>{title || "Untitled Goal"}</div>
                          <div style={{ fontSize: "0.74rem", color: "var(--text-sub)", marginTop: 2 }}>{domain.charAt(0).toUpperCase() + domain.slice(1)} · {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority{targetDate ? ` · Due ${new Date(targetDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : ""}</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ── Step 2: Add Milestones ── */}
                {step === 2 && (
                  <>
                    <div className="card-header">
                      <div className="icon-ring" style={{ background: iconRings[2].bg, color: iconRings[2].color }}><CheckCircle2 size={22} /></div>
                      <div className="card-label">
                        <span className="card-title">Milestone Nodes</span>
                        <span className="card-sub">Break your goal into trackable steps</span>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="field">
                        <label className="form-label">Add Milestone <span className="opt-tag">(optional)</span></label>
                        <div className="add-row">
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g., Complete week 1 training"
                            value={milestoneInput}
                            onChange={(e) => setMilestoneInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addMilestone()}
                            style={{ flex: 1 }}
                          />
                          <button className="add-btn" onClick={addMilestone}>
                            <Plus size={14} /> Add
                          </button>
                        </div>
                      </div>
                      {milestones.length > 0 && (
                        <div>
                          <div className="ms-chips">
                            {milestones.map((m, i) => (
                              <div key={i} className="chip">
                                {m}
                                <span className="chip-x" onClick={() => removeMilestone(i)}>✕</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop: 12, fontSize: "0.8rem", color: "var(--primary)", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                            <CheckCircle2 size={14} /> {milestones.length} milestone{milestones.length !== 1 ? "s" : ""} queued
                          </div>
                        </div>
                      )}
                      {milestones.length === 0 && (
                        <div style={{ fontSize: "0.84rem", color: "#94a3b8", textAlign: "center", padding: "16px 0" }}>
                          No milestones added yet — you can skip this step.
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* ── Step 3: Review Goals ── */}
                {step === 3 && (
                  <>
                    <div className="card-header">
                      <div className="icon-ring" style={{ background: iconRings[3].bg, color: iconRings[3].color }}><Rocket size={22} /></div>
                      <div className="card-label">
                        <span className="card-title">Mission Review Console</span>
                        <span className="card-sub">{goals.length} active goal{goals.length !== 1 ? "s" : ""} · confirm and sync</span>
                      </div>
                    </div>
                    <div className="card-body">
                      {/* New goal preview */}
                      <div style={{ background: "rgba(37, 99, 235, 0.04)", border: "1.5px solid rgba(37, 99, 235, 0.12)", borderRadius: 14, padding: "14px 16px" }}>
                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--primary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: '"JetBrains Mono", monospace' }}>New goal to be created</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: domainConfig[domain].ring.background, color: domainConfig[domain].ring.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {domainConfig[domain].icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)" }}>{title || "Untitled Goal"}</div>
                            <div style={{ fontSize: "0.74rem", color: "var(--text-sub)", marginTop: 3 }}>
                              {domain.charAt(0).toUpperCase() + domain.slice(1)} · {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                              {targetDate ? ` · ${new Date(targetDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : ""}
                              {milestones.length > 0 ? ` · ${milestones.length} milestone${milestones.length !== 1 ? "s" : ""}` : ""}
                            </div>
                          </div>
                          <span className={`goal-priority-badge ${priority === "high" ? "p-high" : priority === "medium" ? "p-medium" : "p-low"}`}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Existing goals list */}
                      {goals.length > 0 && (
                        <>
                          <div className="section-divider" />
                          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: '"JetBrains Mono", monospace' }}>
                            Existing goals ({goals.length})
                          </div>
                          <div className="goals-list">
                            {goals.map((goal, index) => {
                              const dc = domainConfig[goal.domain];
                              const total = goal.milestones?.length ?? 0;
                              const done = goal.milestones?.filter(m => m.completed).length ?? 0;
                              const pClass = goal.priority === "high" ? "p-high" : goal.priority === "medium" ? "p-medium" : "p-low";
                              return (
                                <div className="goal-item" key={goal._id || index}>
                                  <div style={{ width: 30, height: 30, borderRadius: 8, background: dc.ring.background, color: dc.ring.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    {dc.icon}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="goal-title-text">{goal.title}</div>
                                    <div className="goal-meta">
                                      <span className={`goal-priority-badge ${pClass}`} style={{ fontSize: "0.66rem" }}>{goal.priority}</span>
                                      {total > 0 && <span className="goal-ms-progress">{done}/{total} done</span>}
                                      {goal.targetDate && (
                                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                          <Calendar size={10} />
                                          {new Date(goal.targetDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <button className="btn-delete-goal" onClick={() => goal._id && confirm("Delete this goal?") && deleteGoal(goal._id)}>
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}

                <div className="card-footer">
                  {step > 0 && (
                    <button className="nav-btn" onClick={handleBack} disabled={loading}>
                      <ChevronLeft size={16} /> Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      className="submit-btn"
                      onClick={handleNext}
                      disabled={loading || !canNext}
                      style={{ background: canNext ? btnGradients[step] : undefined, boxShadow: canNext ? btnShadows[step] : undefined, opacity: canNext ? 1 : 0.5 }}
                    >
                      Next Step <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      className="submit-btn"
                      onClick={createGoal}
                      disabled={loading}
                      style={{ background: btnGradients[3], boxShadow: btnShadows[3] }}
                    >
                      <Rocket size={14} /> {loading ? "Establishing mission..." : "Establish Goal"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}