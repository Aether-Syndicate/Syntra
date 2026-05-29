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
  { id: "week_warrior", label: "Week Warrior", desc: "7-day ingestion streak", icon: <Flame size={18} />, color: "#f97316", glow: "rgba(249,115,22,0.5)", unlocked: true },
  { id: "goal_crusher", label: "Goal Crusher", desc: "Complete 3 goals", icon: <Trophy size={18} />, color: "#eab308", glow: "rgba(234,179,8,0.5)", unlocked: true },
  { id: "apex_mind", label: "Apex Mind", desc: "Reach level 10", icon: <Star size={18} />, color: "#a855f7", glow: "rgba(168,85,247,0.5)", unlocked: false },
  { id: "lightning", label: "Lightning Fast", desc: "Log 5 quick entries", icon: <Zap size={18} />, color: "#3b82f6", glow: "rgba(59,130,246,0.5)", unlocked: false },
  { id: "scholar", label: "Scholar", desc: "Complete a course", icon: <BookOpen size={18} />, color: "#10b981", glow: "rgba(16,185,129,0.5)", unlocked: false },
];

/* ─────────────────────────────────────────────
   Active Twin Missions Widget
───────────────────────────────────────────── */
function ActiveMissionsWidget({
  goals,
  onToggleMilestone,
}: {
  goals: Goal[];
  onToggleMilestone: (goalId: string, milestoneId: string, completed: boolean) => void;
}) {
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [floatXP, setFloatXP] = useState<{ id: string; key: number } | null>(null);

  const handleToggle = (goalId: string, milestoneId: string, completed: boolean) => {
    onToggleMilestone(goalId, milestoneId, completed);
    if (!completed) {
      setFloatXP({ id: milestoneId, key: Date.now() });
      setTimeout(() => setFloatXP(null), 1400);
    }
  };

  if (goals.length === 0) return null;

  return (
    <div className="twin-widget">
      <div className="twin-widget-header">
        <div className="twin-widget-title">
          <Rocket size={14} style={{ color: "#60a5fa" }} />
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
            goal.domain === "health" ? "#ef4444" : goal.domain === "finance" ? "#16a34a" : "#0044DD";
          const domainIcon =
            goal.domain === "health" ? <HeartPulse size={13} /> : goal.domain === "finance" ? <Wallet size={13} /> : <Briefcase size={13} />;
          const isExpanded = expandedGoal === goal._id;

          return (
            <div key={goal._id} className="twin-goal-row">
              <div
                className="twin-goal-header"
                onClick={() => setExpandedGoal(isExpanded ? null : goal._id || null)}
                style={{ cursor: "pointer" }}
              >
                <div className="twin-goal-icon" style={{ background: `${domainColor}22`, color: domainColor }}>
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
                        onClick={() => goal._id && m._id && handleToggle(goal._id, m._id, m.completed)}
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
function BadgeShowcase() {
  return (
    <div className="badge-showcase">
      <div className="badge-showcase-header">
        <Award size={14} style={{ color: "#eab308" }} />
        <span>Earned Badges</span>
      </div>
      <div className="badge-carousel">
        {BADGES.map((b) => (
          <div
            key={b.id}
            className={`badge-item ${b.unlocked ? "badge-unlocked" : "badge-locked"}`}
            style={b.unlocked ? { boxShadow: `0 0 12px ${b.glow}` } : {}}
          >
            <div
              className="badge-icon-ring"
              style={
                b.unlocked
                  ? { background: `${b.color}22`, color: b.color, border: `1.5px solid ${b.color}55` }
                  : {}
              }
            >
              {b.unlocked ? b.icon : <Lock size={14} />}
            </div>
            <div className="badge-label">{b.label}</div>
            {b.unlocked && <div className="badge-desc">{b.desc}</div>}
          </div>
        ))}
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
      if (d.success) mutate({ goals: d.goals }, false);
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
  const domainConfig = {
    health:  { stripe: "linear-gradient(90deg,#ef4444,#f97316)", badge: { background: "#fee2e2", color: "#991b1b" }, ring: { background: "#fee2e2", color: "#dc2626" }, icon: <HeartPulse size={16} />, progressColor: "#ef4444" },
    finance: { stripe: "linear-gradient(90deg,#16a34a,#059669)", badge: { background: "#dcfce7", color: "#166534" }, ring: { background: "#dcfce7", color: "#15803d" }, icon: <Wallet size={16} />, progressColor: "#16a34a" },
    career:  { stripe: "linear-gradient(90deg,#0044DD,#3322EE)", badge: { background: "#dbeafe", color: "#1e40af" }, ring: { background: "#dbeafe", color: "#0044DD" }, icon: <Briefcase size={16} />, progressColor: "#0044DD" },
  };

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

        /* ── Left Panel ── */
        .page-left { width: 340px; min-height: 100vh; flex-shrink: 0; background: linear-gradient(140deg, #0044DD 0%, #0066FF 55%, #3322EE 100%); display: flex; flex-direction: column; justify-content: center; padding: 48px 44px; position: relative; overflow: hidden; }
        .page-left::before { content: ''; position: absolute; top: -80px; left: -80px; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%); pointer-events: none; }
        .page-left::after { content: ''; position: absolute; bottom: -60px; right: -60px; width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%); pointer-events: none; }
        .brand-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 9999px; padding: 6px 14px; font-size: 0.72rem; font-weight: 700; color: #ffffff; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 28px; }
        .left-title { font-family: 'DM Sans', sans-serif; font-size: 2rem; font-weight: 800; color: #ffffff; line-height: 1.2; letter-spacing: -0.04em; margin-bottom: 14px; }
        .left-title span { color: rgba(255,255,255,0.75); font-weight: 300; }
        .left-sub { font-size: 0.83rem; color: rgba(255,255,255,0.72); line-height: 1.7; margin-bottom: 36px; }
        .left-steps { display: flex; flex-direction: column; gap: 14px; }
        .left-step { display: flex; align-items: center; gap: 12px; }
        .left-step-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .left-step-text { font-size: 0.8rem; font-weight: 500; color: rgba(255,255,255,0.45); }
        .left-step-text.active { color: #ffffff; font-weight: 600; }

        /* ── Split layout ── */
        .page-right { flex: 1; background: #f7f8fc; display: flex; flex-direction: row; gap: 0; min-height: 100vh; overflow: hidden; }

        /* ── Goals Control Panel - Left Section (Always-On) ── */
        .goals-control-left { width: 340px; flex-shrink: 0; background: #ffffff; border-right: 1px solid #e8ebf4; display: flex; flex-direction: column; overflow-y: auto; }
        .gcl-header { padding: 28px 24px 16px; border-bottom: 1px solid #f1f5f9; }
        .gcl-title { font-family: 'DM Sans', sans-serif; font-size: 1.05rem; font-weight: 800; color: #111111; letter-spacing: -0.03em; margin-bottom: 4px; }
        .gcl-sub { font-size: 0.76rem; color: #94a3b8; font-weight: 500; }
        .gcl-body { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
        .gcl-empty { padding: 32px 16px; text-align: center; color: #94a3b8; font-size: 0.84rem; }
        .gcl-goal-card { background: #f7f8fc; border: 1px solid #e8ebf4; border-radius: 12px; overflow: hidden; transition: border-color 0.15s; }
        .gcl-goal-card:hover { border-color: #c7d7fb; background: #eff6ff; }
        .gcl-goal-top { padding: 12px 14px; display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
        .gcl-domain-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .gcl-goal-info { flex: 1; min-width: 0; }
        .gcl-goal-name { font-size: 0.86rem; font-weight: 700; color: #111111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .gcl-goal-meta { font-size: 0.73rem; color: #94a3b8; margin-top: 3px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .gcl-ms-bar { margin: 0 14px 12px; }
        .gcl-ms-track { height: 3px; background: #e2e8f0; border-radius: 999px; overflow: hidden; }
        .gcl-ms-fill { height: 100%; border-radius: 999px; transition: width 0.4s; }
        .gcl-expand-btn { color: #94a3b8; flex-shrink: 0; display: flex; align-items: center; }

        /* milestone expanded */
        .gcl-milestones { padding: 0 14px 12px; display: flex; flex-direction: column; gap: 5px; border-top: 1px solid #f1f5f9; margin-top: 2px; }
        .gcl-ms-row { display: flex; align-items: center; gap: 8px; padding: 5px 0; }
        .gcl-ms-check { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #cbd5e1; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all 0.15s; }
        .gcl-ms-check-done { background: #22c55e; border-color: #22c55e; }
        .gcl-ms-text { font-size: 0.79rem; color: #475569; flex: 1; }
        .gcl-ms-text-done { text-decoration: line-through; color: #94a3b8; }
        .gcl-ms-del { background: none; border: none; color: #cbd5e1; cursor: pointer; display: flex; align-items: center; padding: 2px; border-radius: 4px; transition: color 0.15s; }
        .gcl-ms-del:hover { color: #ef4444; }

        /* ── Goals Creator - Right Section ── */
        .goals-control-right { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 32px 28px; overflow-y: auto; }
        .main-wrapper { width: 100%; max-width: 580px; }

        .exit-bar { display: inline-flex; align-items: center; gap: 8px; font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 600; color: #64748b; text-decoration: none; margin-bottom: 24px; padding: 7px 14px; border-radius: 9999px; background: #ffffff; border: 1px solid #e2e8f0; transition: all 0.2s ease; cursor: pointer; width: fit-content; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .exit-bar:hover { color: #0044DD; border-color: #0044DD; background: #eff4ff; transform: translateX(-2px); }

        .title-container { margin-bottom: 18px; }
        .dynamic-title { font-family: 'DM Sans', sans-serif; font-size: clamp(1.4rem, 3vw, 1.9rem); font-weight: 800; color: #111111; letter-spacing: -0.04em; margin-bottom: 4px; display: flex; align-items: center; gap: 2px; }
        .title-accent { color: #0044DD; }
        .cursor { display: inline-block; width: 3px; height: 1.8rem; background-color: #0044DD; margin-left: 4px; animation: blink 0.7s infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        .dynamic-sub { font-family: 'Inter', sans-serif; font-size: 0.82rem; color: #5a5a6a; line-height: 1.6; }

        /* ── Step Dots ── */
        .step-dots { display: flex; align-items: center; gap: 0; margin-bottom: 16px; background: #0f1520; border-radius: 14px; padding: 10px 18px; }
        .step-dot-wrapper { display: flex; align-items: center; gap: 0; }
        .step-dot { width: 26px; height: 26px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; flex-shrink: 0; }
        .dot-active { transform: scale(1.15); }
        .dot-num { font-size: 0.68rem; font-weight: 700; color: #64748b; }
        .dot-label { font-size: 0.68rem; font-weight: 600; margin-left: 6px; white-space: nowrap; transition: color 0.3s; }
        .dot-connector { height: 2px; width: 30px; margin: 0 6px; transition: background 0.4s; flex-shrink: 0; }

        /* ── Progress Bar ── */
        .progress-track { height: 4px; background: #e2e8f0; width: 100%; border-radius: 0; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 0; transition: width 0.5s cubic-bezier(0.34,1.56,0.64,1); }

        /* ── Step Card ── */
        .step-card { background: #fff; border-radius: 20px; border: 1px solid #e8ebf4; overflow: hidden; box-shadow: 0 8px 32px rgba(0,68,221,0.08), 0 1px 4px rgba(0,0,0,0.04); }
        .card-header { padding: 18px 22px 14px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; }
        .icon-ring { width: 42px; height: 42px; border-radius: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .card-label { display: flex; flex-direction: column; gap: 2px; }
        .card-title { font-size: 0.95rem; font-weight: 700; color: #111111; letter-spacing: -0.01em; }
        .card-sub { font-size: 0.76rem; color: #94a3b8; font-weight: 500; }
        .card-body { padding: 18px 22px; display: flex; flex-direction: column; gap: 13px; }

        /* ── Form Elements ── */
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-label { font-family: 'Inter', sans-serif; font-size: 0.77rem; font-weight: 600; color: #475569; letter-spacing: 0.01em; }
        .req { color: #0044DD; margin-left: 2px; }
        .opt-tag { font-size: 0.72rem; color: #94a3b8; font-weight: 400; margin-left: 4px; }
        .form-input { font-family: 'Inter', sans-serif; font-size: 0.88rem; padding: 10px 13px; border-radius: 10px; border: 1px solid #cbd5e1; background: #f7f8fc; color: #111111; transition: all 0.18s; width: 100%; box-sizing: border-box; height: 40px; }
        .form-input:focus { outline: none; border-color: #0044DD; background: #fff; box-shadow: 0 0 0 3px rgba(0,68,221,0.1); }
        .form-input::placeholder { color: #b0bac6; font-size: 0.84rem; }
        .section-divider { height: 1px; background: #eef1f8; margin: 2px 0; }

        /* ── Card Footer ── */
        .card-footer { padding: 14px 22px 20px; display: flex; align-items: center; gap: 12px; border-top: 1px solid #eef1f8; background: #f7f8fc; }
        .nav-btn { display: flex; align-items: center; gap: 7px; padding: 10px 18px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: #fff; font-family: 'Inter', sans-serif; font-size: 0.84rem; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.18s; white-space: nowrap; }
        .nav-btn:hover { border-color: #0044DD; color: #0044DD; background: #eff4ff; }
        .submit-btn { flex: 1; padding: 11px; border-radius: 12px; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 0.87rem; font-weight: 600; color: #fff; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.18s; }
        .submit-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
        .submit-btn:disabled { background: #94a3b8 !important; box-shadow: none !important; cursor: not-allowed; transform: none; filter: none; }

        .progress-label { font-size: 0.72rem; font-weight: 600; color: #94a3b8; text-align: right; padding: 4px 22px 0; }

        /* ── Status Banner ── */
        .live-status-banner { display: flex; align-items: center; gap: 12px; border-radius: 12px; padding: 10px 14px; font-family: 'Inter', sans-serif; font-size: 0.84rem; font-weight: 500; margin-bottom: 12px; border: 1px solid; }

        /* ── Animations ── */
        @keyframes slideInForward { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInBackward { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideOutForward { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(-40px); } }
        @keyframes slideOutBackward { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(40px); } }
        .slide-enter-forward { animation: slideInForward 0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
        .slide-enter-backward { animation: slideInBackward 0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
        .slide-exit-forward { animation: slideOutForward 0.28s ease forwards; }
        .slide-exit-backward { animation: slideOutBackward 0.28s ease forwards; }

        /* ── Success Card ── */
        .success-card { background: #fff; border-radius: 20px; border: 1px solid #c7d7fb; padding: 40px 28px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 14px; box-shadow: 0 8px 32px rgba(0,68,221,0.1); }
        .success-icon { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg,#0044DD,#0066FF); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,68,221,0.3); margin-bottom: 4px; }
        .success-title { font-family: 'DM Sans', sans-serif; font-size: 1.5rem; font-weight: 800; color: #111111; letter-spacing: -0.03em; }
        .success-sub { font-size: 0.88rem; color: #5a5a6a; line-height: 1.6; max-width: 360px; }

        /* ── Milestone chip ── */
        .ms-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 6px; }
        .chip { display: inline-flex; align-items: center; gap: 6px; font-size: 0.78rem; font-weight: 600; padding: 5px 12px; border-radius: 9999px; background: #eff4ff; color: #0044DD; border: 1px solid #c7d7fb; }
        .chip-x { cursor: pointer; color: #6fa3ff; font-size: 0.9rem; line-height: 1; transition: color 0.15s; }
        .chip-x:hover { color: #ef4444; }

        /* ── Goals List (Step 3 review) ── */
        .goals-list { display: flex; flex-direction: column; gap: 10px; max-height: 280px; overflow-y: auto; padding-right: 2px; }
        .goal-item { background: #f7f8fc; border-radius: 12px; border: 1px solid #e8ebf4; padding: 12px 14px; display: flex; align-items: flex-start; gap: 10px; transition: background 0.15s; }
        .goal-item:hover { background: #eff4ff; border-color: #c7d7fb; }
        .goal-title-text { font-size: 0.88rem; font-weight: 600; color: #111111; line-height: 1.4; flex: 1; }
        .goal-meta { font-size: 0.73rem; color: #94a3b8; margin-top: 4px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .goal-ms-progress { font-size: 0.71rem; font-weight: 600; padding: 2px 8px; border-radius: 6px; background: #eff4ff; color: #0044DD; }
        .goal-priority-badge { font-size: 0.7rem; font-weight: 700; padding: 3px 9px; border-radius: 6px; }
        .p-high { background: #fee2e2; color: #991b1b; }
        .p-medium { background: #fef3c7; color: #92400e; }
        .p-low { background: #dcfce7; color: #166534; }
        .btn-delete-goal { width: 28px; height: 28px; border-radius: 8px; border: 1px solid #fee2e2; background: #fef2f2; color: #ef4444; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; flex-shrink: 0; }
        .btn-delete-goal:hover { background: #fee2e2; border-color: #fca5a5; }

        /* ── Add milestone row (Step 2) ── */
        .add-row { display: flex; gap: 10px; align-items: center; }
        .add-btn { display: flex; align-items: center; gap: 6px; padding: 0 14px; height: 40px; border-radius: 10px; border: 1.5px solid #c7d7fb; background: #eff4ff; font-family: 'Inter', sans-serif; font-size: 0.84rem; font-weight: 600; color: #0044DD; cursor: pointer; transition: all 0.18s; white-space: nowrap; }
        .add-btn:hover { background: #dbeafe; border-color: #0044DD; }

        /* ── Active Twin Missions Widget ── */
        .twin-widget { background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(199,215,251,0.7); border-radius: 16px; padding: 16px; box-shadow: 0 4px 20px rgba(0,68,221,0.08); margin-bottom: 14px; }
        .twin-widget-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .twin-widget-title { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 700; color: #111111; }
        .twin-count { font-size: 0.7rem; font-weight: 700; background: #eff4ff; color: #0044DD; border-radius: 9999px; padding: 2px 9px; }
        .twin-goals-list { display: flex; flex-direction: column; gap: 6px; }
        .twin-goal-row { border-radius: 10px; background: #f7f8fc; border: 1px solid #eef1f8; overflow: hidden; }
        .twin-goal-header { display: flex; align-items: center; gap: 10px; padding: 10px 12px; }
        .twin-goal-icon { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .twin-goal-name { font-size: 0.81rem; font-weight: 600; color: #111111; }
        .twin-mini-track { flex: 1; height: 3px; background: #e2e8f0; border-radius: 999px; overflow: hidden; }
        .twin-mini-fill { height: 100%; border-radius: 999px; transition: width 0.4s; }
        .twin-fraction { font-size: 0.7rem; font-weight: 700; color: #0044DD; white-space: nowrap; }
        .twin-milestones { border-top: 1px solid #f1f5f9; padding: 8px 12px 10px; display: flex; flex-direction: column; gap: 4px; }
        .twin-ms-row { display: flex; align-items: center; gap: 8px; position: relative; }
        .twin-ms-check { width: 15px; height: 15px; border-radius: 50%; border: 2px solid #cbd5e1; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all 0.15s; }
        .twin-ms-checked { background: #22c55e; border-color: #22c55e; }
        .twin-ms-text { font-size: 0.78rem; color: #475569; }
        .twin-ms-done { text-decoration: line-through; color: #94a3b8; }
        @keyframes floatUp { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-28px); } }
        .xp-float { position: absolute; right: 0; top: -4px; font-size: 0.73rem; font-weight: 800; color: #16a34a; animation: floatUp 1.4s ease forwards; pointer-events: none; }

        /* ── Badge Showcase ── */
        .badge-showcase { background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(199,215,251,0.7); border-radius: 16px; padding: 14px 16px; box-shadow: 0 4px 20px rgba(0,68,221,0.06); margin-bottom: 14px; }
        .badge-showcase-header { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 700; color: #111111; margin-bottom: 12px; }
        .badge-carousel { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
        .badge-carousel::-webkit-scrollbar { height: 3px; }
        .badge-carousel::-webkit-scrollbar-track { background: transparent; }
        .badge-carousel::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 3px; }
        .badge-item { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 10px 12px; border-radius: 12px; border: 1px solid; min-width: 80px; flex-shrink: 0; transition: transform 0.18s; }
        .badge-item:hover { transform: translateY(-2px); }
        .badge-unlocked { background: #ffffff; border-color: #e8ebf4; }
        .badge-locked { background: #f1f5f9; border-color: #e2e8f0; opacity: 0.6; }
        .badge-icon-ring { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .badge-locked .badge-icon-ring { background: #e2e8f0; color: #94a3b8; border: none; }
        .badge-label { font-size: 0.68rem; font-weight: 700; color: #111111; text-align: center; white-space: nowrap; }
        .badge-locked .badge-label { color: #94a3b8; }
        .badge-desc { font-size: 0.62rem; color: #94a3b8; text-align: center; line-height: 1.3; }

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
            <div className="left-step" key={i}>
              <div className="left-step-dot" style={{ background: i === step ? "#ffffff" : "rgba(255,255,255,0.35)", boxShadow: i === step ? "0 0 8px rgba(255,255,255,0.6)" : "none" }} />
              <span className={`left-step-text ${i === step ? "active" : ""}`}>{s.label}</span>
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
                          {total > 0 && <span style={{ color: "#0044DD", fontWeight: 700 }}>{done}/{total}</span>}
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
              <ActiveMissionsWidget goals={goals} onToggleMilestone={toggleMilestone} />
            )}

            {/* Badge Showcase */}
            <BadgeShowcase />

            <div className="title-container">
              <h1 className="dynamic-title">
                <span className="title-accent">{typedTitle}</span>
                <span className="cursor" />
              </h1>
              <p className="dynamic-sub">Define objectives, lock in milestones, and let Syntra optimize your path.</p>
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
                      <div className="icon-ring" style={{ background: iconRings[0].bg, color: iconRings[0].color }}><Target size={20} /></div>
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
                      <div className="icon-ring" style={{ background: iconRings[1].bg, color: iconRings[1].color }}><Calendar size={20} /></div>
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
                      <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 0" }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: domain === "health" ? "#fee2e2" : domain === "finance" ? "#dcfce7" : "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", color: domain === "health" ? "#dc2626" : domain === "finance" ? "#15803d" : "#0044DD", flexShrink: 0 }}>
                          {domain === "health" ? <HeartPulse size={16} /> : domain === "finance" ? <Wallet size={16} /> : <Briefcase size={16} />}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.81rem", fontWeight: 700, color: "#111111" }}>{title || "Untitled Goal"}</div>
                          <div style={{ fontSize: "0.73rem", color: "#94a3b8", marginTop: 2 }}>{domain.charAt(0).toUpperCase() + domain.slice(1)} · {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority{targetDate ? ` · Due ${new Date(targetDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : ""}</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ── Step 2: Add Milestones ── */}
                {step === 2 && (
                  <>
                    <div className="card-header">
                      <div className="icon-ring" style={{ background: iconRings[2].bg, color: iconRings[2].color }}><CheckCircle2 size={20} /></div>
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
                          <div style={{ marginTop: 10, fontSize: "0.78rem", color: "#0044DD", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                            <CheckCircle2 size={13} /> {milestones.length} milestone{milestones.length !== 1 ? "s" : ""} queued
                          </div>
                        </div>
                      )}
                      {milestones.length === 0 && (
                        <div style={{ fontSize: "0.81rem", color: "#94a3b8", textAlign: "center", padding: "14px 0" }}>
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
                      <div className="icon-ring" style={{ background: iconRings[3].bg, color: iconRings[3].color }}><Rocket size={20} /></div>
                      <div className="card-label">
                        <span className="card-title">Mission Review Console</span>
                        <span className="card-sub">{goals.length} active goal{goals.length !== 1 ? "s" : ""} · confirm and sync</span>
                      </div>
                    </div>
                    <div className="card-body">
                      {/* New goal preview */}
                      <div style={{ background: "#eff4ff", border: "1px solid #c7d7fb", borderRadius: 12, padding: "13px 15px" }}>
                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#0044DD", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>New goal to be created</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 9, background: domainConfig[domain].ring.background, color: domainConfig[domain].ring.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {domainConfig[domain].icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#111111" }}>{title || "Untitled Goal"}</div>
                            <div style={{ fontSize: "0.73rem", color: "#5a5a6a", marginTop: 3 }}>
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
                          <div style={{ fontSize: "0.71rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
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
                                  <div style={{ width: 28, height: 28, borderRadius: 8, background: dc.ring.background, color: dc.ring.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
                      <ChevronLeft size={15} /> Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      className="submit-btn"
                      onClick={handleNext}
                      disabled={loading || !canNext}
                      style={{ background: canNext ? btnGradients[step] : undefined, boxShadow: canNext ? btnShadows[step] : undefined, opacity: canNext ? 1 : 0.5 }}
                    >
                      Next Step <ArrowRight size={15} />
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