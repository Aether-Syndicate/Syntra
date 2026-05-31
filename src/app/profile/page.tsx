"use client";

import { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import {
  Cpu,
  Shield,
  Sparkles,
  Briefcase,
  HeartPulse,
  Wallet,
  ArrowLeft,
  CheckCircle2,
  User,
  Mail,
  Calendar,
  LogOut,
  Edit3,
  X,
  Save,
  Lock,
  Eye,
  EyeOff,
  Check,
  RefreshCw,
  BookOpen,
  Trophy,
  Star,
  Zap,
  Target,
  Flame,
  Award,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type SyncStatus = "idle" | "syncing" | "synced";
type OptVector = "career" | "health" | "finance";

/* ─────────────────────────────────────────────
   Premium Avatar Options (4 brand avatars)
───────────────────────────────────────────── */
const PREMIUM_AVATARS = [
  {
    id: "aether",
    name: "Aether",
    bg: "linear-gradient(135deg,#0a0f2e,#0044DD)",
    accentColor: "#60a5fa",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <radialGradient id="aether-glow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#0044DD" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#aether-glow)"/>
        {/* Geometric face */}
        <polygon points="50,12 72,36 72,64 50,88 28,64 28,36" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6"/>
        <circle cx="50" cy="42" r="14" fill="none" stroke="#60a5fa" strokeWidth="2"/>
        <circle cx="50" cy="42" r="7" fill="#60a5fa" opacity="0.8"/>
        <circle cx="50" cy="42" r="3" fill="#ffffff"/>
        {/* Scan lines */}
        <line x1="28" y1="58" x2="72" y2="58" stroke="#60a5fa" strokeWidth="1" opacity="0.3"/>
        <line x1="32" y1="64" x2="68" y2="64" stroke="#60a5fa" strokeWidth="0.8" opacity="0.2"/>
        {/* Data nodes */}
        <circle cx="28" cy="36" r="3" fill="#60a5fa"/>
        <circle cx="72" cy="36" r="3" fill="#60a5fa"/>
        <circle cx="28" cy="64" r="3" fill="#60a5fa"/>
        <circle cx="72" cy="64" r="3" fill="#60a5fa"/>
        <circle cx="50" cy="12" r="3" fill="#60a5fa"/>
        <circle cx="50" cy="88" r="3" fill="#60a5fa"/>
      </svg>
    ),
  },
  {
    id: "chronos",
    name: "Chronos",
    bg: "linear-gradient(135deg,#1a0a00,#92400e)",
    accentColor: "#f59e0b",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <radialGradient id="chronos-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#92400e" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#chronos-glow)"/>
        {/* Clock face */}
        <circle cx="50" cy="50" r="34" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.7"/>
        <circle cx="50" cy="50" r="28" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.3"/>
        {/* Hour markers */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
          const r1 = i % 3 === 0 ? 22 : 25, r2 = 28;
          const rad = (deg - 90) * Math.PI / 180;
          return <line key={deg} x1={50 + r1 * Math.cos(rad)} y1={50 + r1 * Math.sin(rad)} x2={50 + r2 * Math.cos(rad)} y2={50 + r2 * Math.sin(rad)} stroke="#f59e0b" strokeWidth={i % 3 === 0 ? 2 : 1} opacity="0.8"/>;
        })}
        {/* Clock hands */}
        <line x1="50" y1="50" x2="50" y2="26" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="50" y1="50" x2="64" y2="56" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="50" cy="50" r="3" fill="#f59e0b"/>
        {/* Face eyes */}
        <ellipse cx="40" cy="44" rx="4" ry="3" fill="#f59e0b" opacity="0.9"/>
        <ellipse cx="60" cy="44" rx="4" ry="3" fill="#f59e0b" opacity="0.9"/>
        <circle cx="40" cy="44" r="1.5" fill="#1a0a00"/>
        <circle cx="60" cy="44" r="1.5" fill="#1a0a00"/>
        <path d="M42 62 Q50 68 58 62" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "apex",
    name: "Apex",
    bg: "linear-gradient(135deg,#0f0f0f,#1f0f3a)",
    accentColor: "#a855f7",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <radialGradient id="apex-glow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#1f0f3a" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#apex-glow)"/>
        {/* Crown */}
        <polygon points="26,38 34,20 50,32 66,20 74,38" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinejoin="round"/>
        <polygon points="26,38 34,20 50,32 66,20 74,38" fill="#a855f7" opacity="0.15"/>
        {/* Jewels on crown */}
        <circle cx="34" cy="20" r="3" fill="#a855f7"/>
        <circle cx="50" cy="32" r="3" fill="#a855f7"/>
        <circle cx="66" cy="20" r="3" fill="#a855f7"/>
        {/* Face */}
        <circle cx="50" cy="60" r="22" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.4"/>
        <ellipse cx="41" cy="56" rx="5" ry="5" fill="#a855f7" opacity="0.9"/>
        <ellipse cx="59" cy="56" rx="5" ry="5" fill="#a855f7" opacity="0.9"/>
        <circle cx="41" cy="56" r="2.5" fill="#0f0f0f"/>
        <circle cx="59" cy="56" r="2.5" fill="#0f0f0f"/>
        <circle cx="42" cy="55" r="1" fill="white" opacity="0.7"/>
        <circle cx="60" cy="55" r="1" fill="white" opacity="0.7"/>
        <path d="M41 68 Q50 76 59 68" stroke="#a855f7" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Chin accent */}
        <line x1="44" y1="77" x2="56" y2="77" stroke="#a855f7" strokeWidth="1.5" opacity="0.5"/>
      </svg>
    ),
  },
  {
    id: "nexus",
    name: "Nexus",
    bg: "linear-gradient(135deg,#001a1a,#065f46)",
    accentColor: "#10b981",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <radialGradient id="nexus-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#065f46" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#nexus-glow)"/>
        {/* Neural network nodes */}
        <circle cx="50" cy="22" r="5" fill="#10b981" opacity="0.9"/>
        <circle cx="22" cy="50" r="5" fill="#10b981" opacity="0.9"/>
        <circle cx="78" cy="50" r="5" fill="#10b981" opacity="0.9"/>
        <circle cx="50" cy="78" r="5" fill="#10b981" opacity="0.9"/>
        <circle cx="30" cy="30" r="4" fill="#10b981" opacity="0.6"/>
        <circle cx="70" cy="30" r="4" fill="#10b981" opacity="0.6"/>
        <circle cx="30" cy="70" r="4" fill="#10b981" opacity="0.6"/>
        <circle cx="70" cy="70" r="4" fill="#10b981" opacity="0.6"/>
        {/* Network lines */}
        <line x1="50" y1="22" x2="30" y2="30" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
        <line x1="50" y1="22" x2="70" y2="30" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
        <line x1="22" y1="50" x2="30" y2="30" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
        <line x1="22" y1="50" x2="30" y2="70" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
        <line x1="78" y1="50" x2="70" y2="30" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
        <line x1="78" y1="50" x2="70" y2="70" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
        <line x1="50" y1="78" x2="30" y2="70" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
        <line x1="50" y1="78" x2="70" y2="70" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
        {/* Central face */}
        <circle cx="50" cy="50" r="16" fill="#10b981" opacity="0.1" stroke="#10b981" strokeWidth="1.5"/>
        <rect x="42" y="44" rx="2" ry="2" width="6" height="8" fill="#10b981" opacity="0.9"/>
        <rect x="52" y="44" rx="2" ry="2" width="6" height="8" fill="#10b981" opacity="0.9"/>
        <rect x="43" y="56" rx="2" ry="2" width="14" height="4" fill="#10b981" opacity="0.7"/>
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────
   Badge Definitions
───────────────────────────────────────────── */
const BADGES = [
  {
    id: "week_warrior",
    title: "Week Warrior",
    description: "Awarded for maintaining a 7-day ingestion streak",
    icon: Flame,
    color: "#f59e0b",
    bg: "#fef3c7",
    unlocked: true,
  },
  {
    id: "neural_init",
    title: "Neural Init",
    description: "First successful AI twin sync completed",
    icon: Zap,
    color: "#0044DD",
    bg: "#dbeafe",
    unlocked: true,
  },
  {
    id: "apex_optimizer",
    title: "Apex Optimizer",
    description: "Reached top 10% on your optimization vector",
    icon: Target,
    color: "#a855f7",
    bg: "#f3e8ff",
    unlocked: true,
  },
  {
    id: "data_sovereign",
    title: "Data Sovereign",
    description: "All three layers synced simultaneously",
    icon: Star,
    color: "#10b981",
    bg: "#d1fae5",
    unlocked: false,
  },
  {
    id: "grand_architect",
    title: "Grand Architect",
    description: "Completed 30-day continuous twin operation",
    icon: Award,
    color: "#ef4444",
    bg: "#fee2e2",
    unlocked: false,
  },
];

/* ─────────────────────────────────────────────
   InfoRow Component
───────────────────────────────────────────── */
function InfoRow({
  icon: Icon, label, value, accent, editing, editValue, onEdit,
}: {
  icon: any; label: string; value: string; accent?: boolean;
  editing?: boolean; editValue?: string; onEdit?: (v: string) => void;
}) {
  return (
    <div className="pf-info-row">
      <div className="pf-info-icon">
        <Icon size={14} color={accent ? "#0044DD" : "#94a3b8"} />
      </div>
      <div className="pf-info-content">
        <span className="pf-info-label">{label}</span>
        {editing && onEdit ? (
          <input
            className="pf-edit-input"
            value={editValue ?? value}
            onChange={e => onEdit(e.target.value)}
            autoFocus={label === "Full Name"}
          />
        ) : (
          <span className="pf-info-value" style={{ color: accent ? "#0044DD" : "#111" }}>
            {value || "—"}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Typewriter Hook
───────────────────────────────────────────── */
function useTypewriter(fullText: string) {
  const [displayed, setDisplayed] = useState("");
  const phaseRef = useRef<"typing" | "pause" | "erasing" | "pauseEmpty">("typing");
  const indexRef = useRef(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const phase = phaseRef.current;
      if (phase === "typing") {
        if (indexRef.current <= fullText.length) {
          setDisplayed(fullText.slice(0, indexRef.current));
          indexRef.current += 1;
          timeout = setTimeout(tick, 90);
        } else {
          phaseRef.current = "pause";
          timeout = setTimeout(tick, 1800);
        }
      } else if (phase === "pause") {
        phaseRef.current = "erasing";
        timeout = setTimeout(tick, 400);
      } else if (phase === "erasing") {
        if (indexRef.current > 0) {
          indexRef.current -= 1;
          setDisplayed(fullText.slice(0, indexRef.current));
          timeout = setTimeout(tick, 55);
        } else {
          phaseRef.current = "pauseEmpty";
          timeout = setTimeout(tick, 500);
        }
      } else if (phase === "pauseEmpty") {
        indexRef.current = 0;
        phaseRef.current = "typing";
        timeout = setTimeout(tick, 300);
      }
    };
    timeout = setTimeout(tick, 90);
    return () => clearTimeout(timeout);
  }, [fullText]);

  return displayed;
}

/* ─────────────────────────────────────────────
   Main Profile Page
───────────────────────────────────────────── */
export default function ProfilePage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  const { data: dashData } = useSWR<any>("/api/dashboard", fetcher, {
    dedupingInterval: 60000,
    revalidateOnFocus: true,
  });
  const userBadges = dashData?.dashboard?.gamification?.badges || [];

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    avatarId: "aether" as string,
    optimizationVector: "career" as OptVector,
  });

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Credentials drawer
  const [credsOpen, setCredsOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  // Sync states
  const [syncStatuses, setSyncStatuses] = useState<Record<string, SyncStatus>>({
    health: "idle",
    finance: "idle",
    coursera: "idle",
  });

  // Optimization vector pulse
  const [vectorPulse, setVectorPulse] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      setProfile({
        name: session.user.name || "",
        email: session.user.email || "",
        age: (session.user as any).age || "",
        avatarId: (session.user as any).avatarId || "aether",
        optimizationVector: (session.user as any).optimizationVector || "career",
      });
    }
  }, [session]);

  const selectedAvatar =
    PREMIUM_AVATARS.find(a => a.id === profile.avatarId) || PREMIUM_AVATARS[0];

  const vectorMeta: Record<OptVector, { label: string; color: string; bg: string; icon: any; desc: string }> = {
    career:  { label: "Career Layer",  color: "#0066FF", bg: "#eff6ff", icon: Briefcase, desc: "Focus duration thresholds & production output metrics." },
    health:  { label: "Health Layer",  color: "#ef4444", bg: "#fef2f2", icon: HeartPulse, desc: "Biometric rest cycles, metabolic energy & stability profiles." },
    finance: { label: "Finance Layer", color: "#10b981", bg: "#f0fdf4", icon: Wallet,     desc: "Run-rate curves, micro-spending & risk parameters." },
  };
  const activeVector = vectorMeta[profile.optimizationVector];
  const VectorIcon = activeVector.icon;

  const twinText = useTypewriter("Twin Profile");

  // Edit mode handlers
  const handleEditStart = () => {
    setEditName(profile.name);
    setEditEmail(profile.email);
    setEditMode(true);
  };
  const handleEditSave = () => {
    setProfile(p => ({ ...p, name: editName, email: editEmail }));
    setEditMode(false);
    // TODO: API integration hook — call PATCH /api/profile with { name: editName, email: editEmail }
  };
  const handleEditCancel = () => setEditMode(false);

  // Password update handler
  const handlePwSubmit = () => {
    setPwError("");
    if (!currentPw) { setPwError("Current password is required."); return; }
    if (newPw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match."); return; }
    // TODO: API integration hook — call POST /api/auth/change-password
    setPwSuccess(true);
    setTimeout(() => {
      setPwSuccess(false);
      setCredsOpen(false);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    }, 2200);
  };

  // Sync handler
  const handleSync = (key: string) => {
    if (syncStatuses[key] !== "idle") return;
    setSyncStatuses(s => ({ ...s, [key]: "syncing" }));
    setTimeout(() => {
      setSyncStatuses(s => ({ ...s, [key]: "synced" }));
      setTimeout(() => setSyncStatuses(s => ({ ...s, [key]: "idle" })), 3000);
    }, 1800);
  };

  // Vector select handler
  const handleVectorSelect = (v: OptVector) => {
    setProfile(p => ({ ...p, optimizationVector: v }));
    setVectorPulse(true);
    setTimeout(() => setVectorPulse(false), 600);
  };

  if (!mounted) return null;

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

        /* ── SIDEBAR ── */
        .pf-left {
          width: 240px; height: 100vh; position: sticky; top: 0; flex-shrink: 0;
          background: linear-gradient(140deg,#0044DD 0%,#0066FF 55%,#3322EE 100%);
          display: flex; flex-direction: column; align-items: center;
          padding: 48px 24px 36px; overflow: hidden; gap: 0;
        }
        .pf-left::before {
          content:''; position:absolute; top:60px; left:50%; transform:translateX(-50%);
          width:320px; height:320px; border-radius:50%; border:1px solid rgba(255,255,255,0.06); pointer-events:none;
        }
        .pf-left::after {
          content:''; position:absolute; top:90px; left:50%; transform:translateX(-50%);
          width:220px; height:220px; border-radius:50%; border:1px solid rgba(255,255,255,0.05); pointer-events:none;
        }
        .pf-brand { font-family:'DM Sans',sans-serif; font-size:1.3rem; font-weight:800; color:#ffffff; letter-spacing:0.08em; text-transform:uppercase; margin:0 0 4px; position:relative; z-index:1; }
        .pf-brand-sub { font-size:0.7rem; font-weight:500; color:rgba(255,255,255,0.35); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:36px; position:relative; z-index:1; }
        .pf-sidebar-divider { width:100%; height:1px; background:rgba(255,255,255,0.08); margin-bottom:28px; position:relative; z-index:1; }
        .pf-nav { width:100%; display:flex; flex-direction:column; gap:6px; position:relative; z-index:1; flex:1; }
        .pf-nav-item { display:flex; align-items:center; gap:11px; padding:10px 14px; border-radius:12px; font-size:0.8rem; font-weight:600; color:rgba(255,255,255,0.5); font-family:'Inter',sans-serif; cursor:default; transition:all 0.2s; letter-spacing:0.01em; }
        .pf-nav-item:hover { background:rgba(255,255,255,0.07); color:rgba(255,255,255,0.8); }
        .pf-nav-item.active { background:rgba(255,255,255,0.12); color:#fff; border:1px solid rgba(255,255,255,0.14); }
        .pf-nav-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
        .pf-status-badge { width:100%; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:12px 14px; display:flex; align-items:center; gap:10px; margin-bottom:14px; position:relative; z-index:1; }
        .pf-status-pulse { width:8px; height:8px; border-radius:50%; background:#34d399; flex-shrink:0; box-shadow:0 0 0 3px rgba(52,211,153,0.25); animation:pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { box-shadow:0 0 0 3px rgba(52,211,153,0.25); } 50% { box-shadow:0 0 0 6px rgba(52,211,153,0.1); } }
        .pf-status-text { font-size:0.72rem; font-weight:600; color:rgba(255,255,255,0.55); font-family:'Inter',sans-serif; letter-spacing:0.03em; }
        .pf-status-val { font-size:0.72rem; font-weight:700; color:#34d399; }
        .pf-signout-btn { display:flex; align-items:center; justify-content:center; gap:8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:10px 14px; color:rgba(255,255,255,0.45); font-size:0.78rem; font-weight:600; cursor:pointer; transition:all 0.2s; width:100%; font-family:'Inter',sans-serif; position:relative; z-index:1; }
        .pf-signout-btn:hover { background:rgba(255,80,80,0.15); border-color:rgba(255,120,120,0.3); color:#fca5a5; }

        /* ── MAIN ── */
        .pf-right { flex:1; background:#f7f8fc; display:flex; flex-direction:column; align-items:center; padding:40px 32px; min-height:100vh; }
        .pf-main-wrapper { width:100%; max-width:680px; }
        .pf-exit-bar { display:inline-flex; align-items:center; gap:8px; font-size:0.8rem; font-weight:600; color:#64748b; margin-bottom:32px; padding:7px 14px; border-radius:9999px; background:#fff; border:1px solid #e2e8f0; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.06); transition:all 0.2s; width:fit-content; }
        .pf-exit-bar:hover { color:#0044DD; border-color:#b8d0ff; background:#f0f5ff; transform:translateX(-2px); }

        /* Header */
        .pf-page-header { margin-bottom:24px; }
        .pf-title { font-family:'DM Sans',sans-serif; font-size:clamp(1.5rem,3vw,2rem); font-weight:800; color:#0d1117; letter-spacing:-0.04em; margin:0 0 4px; min-height:2.6rem; display:block; line-height:1.2; }
        .pf-title-accent { color:#0044DD; display:inline; }
        .pf-title-rest { color:#0d1117; display:inline; }
        .pf-title-cursor { display:inline-block; width:2.5px; height:1em; background:#0044DD; margin-left:3px; vertical-align:middle; border-radius:1px; animation:cursorBlink 1.1s ease-in-out infinite; opacity:0.85; }
        @keyframes cursorBlink { 0%,100% { opacity:0.85; } 48%,52% { opacity:0; } }
        .pf-subtitle { font-size:0.83rem; color:#64748b; margin:0; }

        /* Edit Config Button */
        .pf-edit-config-btn {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(0,68,221,0.07);
          border: 1.5px solid rgba(0,68,221,0.2);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          padding: 9px 16px;
          font-size: 0.78rem; font-weight: 700;
          color: #0044DD;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.01em;
          float: right;
          margin-top: -4px;
        }
        .pf-edit-config-btn:hover { background:rgba(0,68,221,0.12); border-color:rgba(0,68,221,0.4); transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,68,221,0.15); }
        .pf-edit-actions { display:flex; gap:8px; margin-top:14px; padding:0 14px; }
        .pf-btn-save { display:flex; align-items:center; gap:6px; background:#0044DD; border:none; border-radius:10px; padding:9px 18px; color:#fff; font-size:0.8rem; font-weight:700; cursor:pointer; transition:all 0.18s; font-family:'Inter',sans-serif; }
        .pf-btn-save:hover { background:#0033bb; transform:translateY(-1px); }
        .pf-btn-cancel { display:flex; align-items:center; gap:6px; background:#f1f5f9; border:1px solid #e2e8f0; border-radius:10px; padding:9px 18px; color:#64748b; font-size:0.8rem; font-weight:700; cursor:pointer; transition:all 0.18s; font-family:'Inter',sans-serif; }
        .pf-btn-cancel:hover { background:#e2e8f0; }
        .pf-edit-input { font-size:0.88rem; font-weight:600; color:#0044DD; background:#eff4ff; border:1.5px solid #b8d0ff; border-radius:8px; padding:4px 10px; outline:none; font-family:'Inter',sans-serif; transition:border-color 0.15s; }
        .pf-edit-input:focus { border-color:#0044DD; }

        /* Creds button */
        .pf-creds-btn { display:inline-flex; align-items:center; gap:7px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:8px 14px; font-size:0.77rem; font-weight:700; color:#475569; cursor:pointer; transition:all 0.18s; font-family:'Inter',sans-serif; margin-top:10px; margin-left:14px; }
        .pf-creds-btn:hover { background:#f1f5f9; border-color:#cbd5e1; color:#0044DD; }

        /* ── HERO CARD ── */
        .pf-hero-card { background:#fff; border-radius:22px; border:1px solid #e4e9f4; box-shadow:0 8px 40px rgba(0,68,221,0.08),0 1px 4px rgba(0,0,0,0.04); overflow:hidden; margin-bottom:14px; }
        .pf-hero-banner { height:80px; background:linear-gradient(120deg,#0044DD 0%,#0066FF 50%,#3322EE 100%); position:relative; overflow:hidden; flex-shrink:0; }
        .pf-hero-banner::before { content:''; position:absolute; top:-40px; right:-40px; width:160px; height:160px; border-radius:50%; background:radial-gradient(circle,rgba(255,255,255,0.15) 0%,transparent 70%); }
        .pf-hero-banner::after  { content:''; position:absolute; bottom:-30px; left:60px; width:120px; height:120px; border-radius:50%; background:radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 70%); }
        .pf-hero-body { padding:0 28px 26px; }
        .pf-avatar-row { display:flex; align-items:flex-end; gap:20px; margin-top:-46px; margin-bottom:22px; padding-top:0; }
        .pf-avatar-outer { position:relative; flex-shrink:0; }
        .pf-avatar-glow { position:absolute; inset:-4px; border-radius:50%; background:conic-gradient(from 0deg,#0044DD,#0066FF,#3322EE,#0044DD); opacity:0.6; filter:blur(4px); }
        .pf-avatar-ring { width:90px; height:90px; border-radius:50%; background:#fff; border:3px solid #fff; box-shadow:0 6px 20px rgba(0,68,221,0.25); display:flex; align-items:center; justify-content:center; overflow:hidden; position:relative; z-index:1; }
        .pf-avatar-inner { width:80px; height:80px; border-radius:50%; overflow:hidden; display:flex; align-items:center; justify-content:center; }
        .pf-avatar-meta { padding-bottom:6px; display:flex; flex-direction:column; justify-content:flex-end; flex:1; }
        .pf-avatar-meta-top { display:flex; align-items:flex-start; justify-content:space-between; }
        .pf-hero-name { font-family:'DM Sans',sans-serif; font-size:1.35rem; font-weight:800; color:#0d1117; letter-spacing:-0.03em; line-height:1.2; }
        .pf-twin-badge { display:inline-flex; align-items:center; gap:5px; background:linear-gradient(90deg,#eff4ff,#e8edfc); border:1px solid #c7d7fb; border-radius:9999px; padding:4px 10px; font-size:0.68rem; font-weight:700; color:#0044DD; letter-spacing:0.06em; text-transform:uppercase; margin-top:8px; width:fit-content; }

        /* Info rows */
        .pf-info-section { display:flex; flex-direction:column; gap:2px; }
        .pf-info-row { display:flex; align-items:center; gap:12px; padding:10px 14px; border-radius:11px; transition:background 0.15s; }
        .pf-info-row:hover { background:#f7f9ff; }
        .pf-info-icon { width:30px; height:30px; border-radius:9px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .pf-info-content { display:flex; flex-direction:column; gap:1px; flex:1; }
        .pf-info-label { font-size:0.68rem; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:0.07em; }
        .pf-info-value { font-size:0.88rem; color:#111; font-weight:600; }
        .pf-info-divider { height:1px; background:#f1f5f9; margin:4px 14px; }

        /* ── SECONDARY CARDS ── */
        .pf-card { background:#fff; border-radius:18px; border:1px solid #e4e9f4; overflow:hidden; box-shadow:0 4px 20px rgba(0,68,221,0.05),0 1px 3px rgba(0,0,0,0.03); margin-bottom:14px; }
        .pf-card-header { padding:16px 22px 14px; border-bottom:1px solid #f1f5f9; display:flex; align-items:center; gap:13px; }
        .pf-icon-ring { width:38px; height:38px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .pf-card-title { font-size:0.88rem; font-weight:700; color:#0d1117; letter-spacing:-0.01em; }
        .pf-card-sub { font-size:0.72rem; color:#94a3b8; font-weight:500; margin-top:1px; }
        .pf-card-body { padding:18px 22px; }

        /* ── PREMIUM AVATAR GRID ── */
        .pf-avatar-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
        .pf-avatar-card {
          border-radius:16px; padding:14px 10px; display:flex; flex-direction:column; align-items:center; gap:8px;
          border:2px solid transparent; cursor:pointer; transition:all 0.22s; position:relative; overflow:hidden;
        }
        .pf-avatar-card:hover { transform:translateY(-3px) scale(1.03); }
        .pf-avatar-card.selected { border-color:var(--av-accent); }
        .pf-avatar-card-img { width:64px; height:64px; border-radius:50%; overflow:hidden; display:flex; align-items:center; justify-content:center; transition:box-shadow 0.22s; }
        .pf-avatar-card.selected .pf-avatar-card-img { box-shadow:0 0 0 3px var(--av-accent), 0 0 20px color-mix(in srgb,var(--av-accent) 50%,transparent); }
        .pf-avatar-card-name { font-size:0.72rem; font-weight:700; color:#374151; letter-spacing:0.04em; text-transform:uppercase; }
        .pf-avatar-check { position:absolute; top:7px; right:7px; background:var(--av-accent); border-radius:50%; width:18px; height:18px; display:flex; align-items:center; justify-content:center; }

        /* ── SYNC CARDS ── */
        .pf-sync-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
        .pf-sync-card {
          border-radius:14px; padding:14px 12px; display:flex; flex-direction:column; align-items:center; gap:8px;
          border:1.5px solid transparent; cursor:pointer; transition:all 0.2s; position:relative; overflow:hidden;
          text-align:center;
        }
        .pf-sync-card:hover:not(.syncing):not(.synced) { transform:translateY(-2px); filter:brightness(0.97); }
        .pf-sync-card.syncing { cursor:wait; }
        .pf-sync-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .pf-sync-label { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; }
        .pf-sync-status { font-size:0.7rem; font-weight:600; display:flex; align-items:center; gap:4px; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .spinning { animation:spin 0.8s linear infinite; }
        @keyframes gradientSweep {
          0% { background-position:200% center; }
          100% { background-position:-200% center; }
        }
        .pf-sync-card.syncing { background-size:200% 100%; animation:gradientSweep 1.4s linear infinite; }

        /* ── OPTIMIZATION VECTOR SELECTOR ── */
        .pf-vector-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
        .pf-vector-card {
          border-radius:14px; padding:16px 14px; display:flex; flex-direction:column; gap:8px;
          border:2px solid transparent; cursor:pointer; transition:all 0.22s; position:relative; overflow:hidden;
        }
        .pf-vector-card:hover { transform:scale(1.025); }
        .pf-vector-card.selected { border-color:var(--vc-color); }
        .pf-vector-card.pulse { animation:vectorPulse 0.55s ease-out; }
        @keyframes vectorPulse {
          0% { transform:scale(1.025); box-shadow:0 0 0 0 var(--vc-shadow); }
          50% { transform:scale(1.04); box-shadow:0 0 0 8px transparent; }
          100% { transform:scale(1.025); box-shadow:0 0 0 0 transparent; }
        }
        .pf-vector-card.selected { box-shadow:0 0 0 3px color-mix(in srgb,var(--vc-color) 25%,transparent); }
        .pf-vector-card-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; }
        .pf-vector-card-label { font-size:0.68rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.07em; }
        .pf-vector-card-name { font-size:0.88rem; font-weight:800; }
        .pf-vector-card-desc { font-size:0.67rem; color:#64748b; line-height:1.4; }
        .pf-vector-active-chip { display:inline-flex; align-items:center; gap:4px; font-size:0.62rem; font-weight:700; padding:3px 8px; border-radius:9999px; }

        /* ── CREDENTIALS DRAWER ── */
        .pf-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.3); backdrop-filter:blur(4px); z-index:100; display:flex; align-items:center; justify-content:center; animation:fadeIn 0.2s ease; }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .pf-drawer {
          background:#fff; border-radius:22px; padding:30px 28px; width:100%; max-width:420px;
          box-shadow:0 24px 80px rgba(0,0,0,0.18),0 4px 20px rgba(0,0,0,0.08);
          animation:slideUp 0.25s cubic-bezier(0.16,1,0.3,1);
          position:relative;
        }
        @keyframes slideUp { from { transform:translateY(24px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        .pf-drawer-title { font-family:'DM Sans',sans-serif; font-size:1.1rem; font-weight:800; color:#0d1117; margin:0 0 4px; }
        .pf-drawer-sub { font-size:0.78rem; color:#94a3b8; margin:0 0 22px; }
        .pf-drawer-close { position:absolute; top:18px; right:18px; width:32px; height:32px; border-radius:10px; background:#f1f5f9; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#64748b; transition:all 0.15s; }
        .pf-drawer-close:hover { background:#e2e8f0; color:#0d1117; }
        .pf-pw-field { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }
        .pf-pw-label { font-size:0.72rem; font-weight:700; color:#374151; text-transform:uppercase; letter-spacing:0.07em; }
        .pf-pw-input-wrap { display:flex; align-items:center; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; overflow:hidden; transition:border-color 0.15s; }
        .pf-pw-input-wrap:focus-within { border-color:#0044DD; background:#eff4ff; }
        .pf-pw-input { flex:1; border:none; background:transparent; padding:10px 12px; font-size:0.85rem; font-weight:500; color:#0d1117; outline:none; font-family:'Inter',sans-serif; }
        .pf-pw-toggle { padding:0 12px; border:none; background:transparent; cursor:pointer; color:#94a3b8; display:flex; align-items:center; transition:color 0.15s; }
        .pf-pw-toggle:hover { color:#0044DD; }
        .pf-pw-error { font-size:0.75rem; font-weight:600; color:#ef4444; background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:8px 12px; margin-bottom:12px; display:flex; align-items:center; gap:6px; }
        .pf-pw-success { font-size:0.8rem; font-weight:600; color:#10b981; background:#f0fdf4; border:1px solid #a7f3d0; border-radius:10px; padding:12px 16px; text-align:center; display:flex; align-items:center; justify-content:center; gap:8px; }
        .pf-pw-submit { width:100%; background:#0044DD; border:none; border-radius:12px; padding:12px; color:#fff; font-size:0.85rem; font-weight:700; cursor:pointer; transition:all 0.18s; font-family:'Inter',sans-serif; margin-top:4px; }
        .pf-pw-submit:hover { background:#0033bb; transform:translateY(-1px); box-shadow:0 6px 20px rgba(0,68,221,0.25); }

        /* ── BADGE VAULT ── */
        .pf-badge-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; }
        .pf-badge-card { border-radius:14px; padding:14px 10px; display:flex; flex-direction:column; align-items:center; gap:6px; text-align:center; border:1.5px solid transparent; }
        .pf-badge-card.unlocked { border-color:color-mix(in srgb,var(--b-color) 25%,transparent); }
        .pf-badge-card.locked { opacity:0.45; filter:grayscale(0.6); }
        .pf-badge-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; }
        .pf-badge-card.unlocked .pf-badge-icon { box-shadow:0 0 0 3px color-mix(in srgb,var(--b-color) 30%,transparent), 0 0 16px color-mix(in srgb,var(--b-color) 25%,transparent); }
        .pf-badge-title { font-size:0.67rem; font-weight:800; color:#0d1117; letter-spacing:0.02em; text-transform:uppercase; }
        .pf-badge-desc { font-size:0.6rem; color:#64748b; line-height:1.35; }
        .pf-badge-lock { font-size:0.6rem; color:#94a3b8; display:flex; align-items:center; gap:3px; font-weight:600; }

        /* Active chip */
        .pf-active-chip { margin-left:auto; display:flex; align-items:center; gap:5px; font-size:0.68rem; font-weight:700; color:#0044DD; background:#eff4ff; border:1px solid #c7d7fb; border-radius:9999px; padding:4px 10px; flex-shrink:0; }

        @media (max-width:860px) { .pf-left { display:none; } .pf-right { padding:28px 16px; } }
        @media (max-width:600px) { .pf-avatar-grid { grid-template-columns:repeat(2,1fr); } .pf-sync-grid { grid-template-columns:1fr 1fr; } .pf-vector-grid { grid-template-columns:1fr; } .pf-badge-grid { grid-template-columns:repeat(3,1fr); } }
        @media (max-width:420px) { .pf-hero-name { font-size:1.1rem; } }
      `}</style>

      {/* ── CREDENTIALS DRAWER/MODAL ── */}
      {credsOpen && (
        <div className="pf-overlay" onClick={e => { if (e.target === e.currentTarget) setCredsOpen(false); }}>
          <div className="pf-drawer">
            <button className="pf-drawer-close" onClick={() => setCredsOpen(false)}>
              <X size={15} />
            </button>
            <div className="pf-drawer-title">Update Credentials</div>
            <div className="pf-drawer-sub">Secure credential rotation — changes apply immediately.</div>

            {pwSuccess ? (
              <div className="pf-pw-success">
                <CheckCircle2 size={18} color="#10b981" /> Password updated successfully!
              </div>
            ) : (
              <>
                {pwError && (
                  <div className="pf-pw-error">
                    <X size={13} /> {pwError}
                  </div>
                )}

                <div className="pf-pw-field">
                  <div className="pf-pw-label">Current Password</div>
                  <div className="pf-pw-input-wrap">
                    <input className="pf-pw-input" type={showCurrentPw ? "text" : "password"} placeholder="Enter current password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} />
                    <button className="pf-pw-toggle" onClick={() => setShowCurrentPw(v => !v)}>{showCurrentPw ? <EyeOff size={15}/> : <Eye size={15}/>}</button>
                  </div>
                </div>

                <div className="pf-pw-field">
                  <div className="pf-pw-label">New Password</div>
                  <div className="pf-pw-input-wrap">
                    <input className="pf-pw-input" type={showNewPw ? "text" : "password"} placeholder="Min. 8 characters" value={newPw} onChange={e => setNewPw(e.target.value)} />
                    <button className="pf-pw-toggle" onClick={() => setShowNewPw(v => !v)}>{showNewPw ? <EyeOff size={15}/> : <Eye size={15}/>}</button>
                  </div>
                </div>

                <div className="pf-pw-field">
                  <div className="pf-pw-label">Confirm Password</div>
                  <div className="pf-pw-input-wrap">
                    <input className="pf-pw-input" type={showConfirmPw ? "text" : "password"} placeholder="Repeat new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} onKeyDown={e => e.key === "Enter" && handlePwSubmit()} />
                    <button className="pf-pw-toggle" onClick={() => setShowConfirmPw(v => !v)}>{showConfirmPw ? <EyeOff size={15}/> : <Eye size={15}/>}</button>
                  </div>
                </div>

                <button className="pf-pw-submit" onClick={handlePwSubmit}>
                  Update Password
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── LEFT SIDEBAR ── */}
      <div className="pf-left">
        <div className="pf-brand">Syntra</div>
        <div className="pf-brand-sub">AI Twin Platform</div>
        <div className="pf-sidebar-divider" />
        <div className="pf-nav">
          <div className="pf-nav-item active">
            <div className="pf-nav-dot" style={{ background: "#60a5fa" }} /> Twin Profile
          </div>
          <div className="pf-nav-item">
            <div className="pf-nav-dot" style={{ background: "rgba(255,255,255,0.2)" }} /> Neural Sync
          </div>
          <div className="pf-nav-item">
            <div className="pf-nav-dot" style={{ background: "rgba(255,255,255,0.2)" }} /> Optimization
          </div>
          <div className="pf-nav-item">
            <div className="pf-nav-dot" style={{ background: "rgba(255,255,255,0.2)" }} /> Data Layers
          </div>
        </div>
        <div className="pf-status-badge">
          <div className="pf-status-pulse" />
          <div>
            <div className="pf-status-text">Twin Status</div>
            <div className="pf-status-val">Online & Syncing</div>
          </div>
        </div>
        <button className="pf-signout-btn" onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOut size={13} /> Log Out
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="pf-right">
        <div className="pf-main-wrapper">

          <div className="pf-exit-bar" onClick={() => history.back()}>
            <ArrowLeft size={13} /> Return to Dashboard
          </div>

          <div className="pf-page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h1 className="pf-title">
                <span className="pf-title-accent">{twinText.slice(0, 4) || ""}</span>
                <span className="pf-title-rest">{twinText.slice(4) || ""}</span>
                <span className="pf-title-cursor" />
              </h1>
              <p className="pf-subtitle">Your digital identity and AI twin configuration overview.</p>
            </div>
            {!editMode && (
              <button className="pf-edit-config-btn" onClick={handleEditStart}>
                <Edit3 size={13} /> Edit Configuration
              </button>
            )}
          </div>

          {/* ── HERO PROFILE CARD ── */}
          <div className="pf-hero-card">
            <div className="pf-hero-banner" />
            <div className="pf-hero-body">
              <div className="pf-avatar-row">
                <div className="pf-avatar-outer">
                  <div className="pf-avatar-glow" />
                  <div className="pf-avatar-ring">
                    <div className="pf-avatar-inner" style={{ background: "transparent" }}>
                      {selectedAvatar.svg}
                    </div>
                  </div>
                </div>
                <div className="pf-avatar-meta">
                  <div className="pf-avatar-meta-top">
                    <div>
                      <div className="pf-hero-name">{editMode ? (editName || "Your Name") : (profile.name || "Your Name")}</div>
                      <div className="pf-twin-badge">
                        <Sparkles size={10} /> Syntra AI Twin — {selectedAvatar.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pf-info-section">
                <InfoRow icon={User} label="Full Name" value={profile.name}
                  editing={editMode} editValue={editName} onEdit={setEditName} />
                <div className="pf-info-divider" />
                <InfoRow icon={Mail} label="Email Address" value={profile.email}
                  editing={editMode} editValue={editEmail} onEdit={setEditEmail} />
                <div className="pf-info-divider" />
                <InfoRow icon={Calendar} label="Age" value={profile.age ? `${profile.age} years` : "—"} />
                <div className="pf-info-divider" />
                <InfoRow icon={Shield} label="Access Level" value="Authenticated Member" accent />
              </div>

              {editMode && (
                <div className="pf-edit-actions">
                  <button className="pf-btn-save" onClick={handleEditSave}>
                    <Save size={13} /> Save Changes
                  </button>
                  <button className="pf-btn-cancel" onClick={handleEditCancel}>
                    <X size={13} /> Cancel
                  </button>
                </div>
              )}

              <button className="pf-creds-btn" onClick={() => setCredsOpen(true)}>
                <Lock size={12} /> Update Credentials
              </button>
            </div>
          </div>

          {/* ── PREMIUM AVATAR GRID SELECTOR ── */}
          <div className="pf-card">
            <div className="pf-card-header">
              <div className="pf-icon-ring" style={{ background: "#f3e8ff" }}>
                <User size={17} color="#a855f7" />
              </div>
              <div>
                <div className="pf-card-title">Avatar Selection</div>
                <div className="pf-card-sub">Choose your premium Syntra identity</div>
              </div>
            </div>
            <div className="pf-card-body">
              <div className="pf-avatar-grid">
                {PREMIUM_AVATARS.map(av => (
                  <div
                    key={av.id}
                    className={`pf-avatar-card${profile.avatarId === av.id ? " selected" : ""}`}
                    style={{
                      background: "linear-gradient(135deg,#f8fafc,#f1f5f9)",
                      ["--av-accent" as any]: av.accentColor,
                    }}
                    onClick={() => setProfile(p => ({ ...p, avatarId: av.id }))}
                  >
                    {profile.avatarId === av.id && (
                      <div className="pf-avatar-check">
                        <Check size={10} color="#fff" />
                      </div>
                    )}
                    <div className="pf-avatar-card-img" style={{ background: av.bg }}>
                      {av.svg}
                    </div>
                    <div className="pf-avatar-card-name" style={{ color: profile.avatarId === av.id ? av.accentColor : "#374151" }}>
                      {av.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── NEURAL SYNC OVERVIEW (Active Sync Buttons) ── */}
          <div className="pf-card">
            <div className="pf-card-header">
              <div className="pf-icon-ring" style={{ background: "#dbeafe" }}>
                <Cpu size={17} color="#0044DD" />
              </div>
              <div>
                <div className="pf-card-title">Neural Sync Overview</div>
                <div className="pf-card-sub">Live status across all twin data layers</div>
              </div>
            </div>
            <div className="pf-card-body">
              <div className="pf-sync-grid">
                {/* Apple Health */}
                {(() => {
                  const st = syncStatuses.health;
                  return (
                    <div
                      className={`pf-sync-card${st === "syncing" ? " syncing" : ""}${st === "synced" ? " synced" : ""}`}
                      style={{
                        background: st === "syncing"
                          ? "linear-gradient(90deg,#fef2f2,#fee2e2,#fef2f2)"
                          : st === "synced" ? "#f0fdf4" : "#fef2f2",
                        borderColor: st === "synced" ? "#10b981" : "#fecaca",
                      }}
                      onClick={() => handleSync("health")}
                    >
                      <div className="pf-sync-icon" style={{ background: "#fee2e2" }}>
                        <HeartPulse size={17} color="#ef4444" className={st === "syncing" ? "" : ""} />
                      </div>
                      <div className="pf-sync-label" style={{ color: "#ef4444" }}>Apple Health</div>
                      <div className="pf-sync-status" style={{ color: st === "synced" ? "#10b981" : "#ef4444" }}>
                        {st === "idle" && <><RefreshCw size={11}/> Tap to Sync</>}
                        {st === "syncing" && <><RefreshCw size={11} className="spinning"/> Pulling live metrics...</>}
                        {st === "synced" && <><Check size={11}/> Synced</>}
                      </div>
                    </div>
                  );
                })()}

                {/* Bank Account */}
                {(() => {
                  const st = syncStatuses.finance;
                  return (
                    <div
                      className={`pf-sync-card${st === "syncing" ? " syncing" : ""}`}
                      style={{
                        background: st === "syncing"
                          ? "linear-gradient(90deg,#f0fdf4,#dcfce7,#f0fdf4)"
                          : st === "synced" ? "#f0fdf4" : "#f0fdf4",
                        borderColor: st === "synced" ? "#10b981" : "#a7f3d0",
                      }}
                      onClick={() => handleSync("finance")}
                    >
                      <div className="pf-sync-icon" style={{ background: "#dcfce7" }}>
                        <Wallet size={17} color="#10b981" />
                      </div>
                      <div className="pf-sync-label" style={{ color: "#10b981" }}>Bank Account</div>
                      <div className="pf-sync-status" style={{ color: st === "synced" ? "#10b981" : "#10b981" }}>
                        {st === "idle" && <><RefreshCw size={11}/> Tap to Sync</>}
                        {st === "syncing" && <><RefreshCw size={11} className="spinning"/> Pulling live metrics...</>}
                        {st === "synced" && <><Check size={11}/> Synced</>}
                      </div>
                    </div>
                  );
                })()}

                {/* Coursera */}
                {(() => {
                  const st = syncStatuses.coursera;
                  return (
                    <div
                      className={`pf-sync-card${st === "syncing" ? " syncing" : ""}`}
                      style={{
                        background: st === "syncing"
                          ? "linear-gradient(90deg,#eff6ff,#dbeafe,#eff6ff)"
                          : st === "synced" ? "#f0fdf4" : "#eff6ff",
                        borderColor: st === "synced" ? "#10b981" : "#bfdbfe",
                      }}
                      onClick={() => handleSync("coursera")}
                    >
                      <div className="pf-sync-icon" style={{ background: "#dbeafe" }}>
                        <BookOpen size={17} color="#0066FF" />
                      </div>
                      <div className="pf-sync-label" style={{ color: "#0066FF" }}>Coursera API</div>
                      <div className="pf-sync-status" style={{ color: st === "synced" ? "#10b981" : "#0066FF" }}>
                        {st === "idle" && <><RefreshCw size={11}/> Tap to Sync</>}
                        {st === "syncing" && <><RefreshCw size={11} className="spinning"/> Pulling live metrics...</>}
                        {st === "synced" && <><Check size={11}/> Synced</>}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* ── BADGE VAULT ── */}
          <div className="pf-card">
            <div className="pf-card-header">
              <div className="pf-icon-ring" style={{ background: "#fef3c7" }}>
                <Trophy size={17} color="#f59e0b" />
              </div>
              <div>
                <div className="pf-card-title">Badge Vault</div>
                <div className="pf-card-sub">Achievements earned through twin activity</div>
              </div>
            </div>
            <div className="pf-card-body">
              <div className="pf-badge-grid">
                {BADGES.map(badge => {
                  const BIcon = badge.icon;
                  const isUnlocked = userBadges.some((ub: string) => 
                    ub.toLowerCase() === badge.title.toLowerCase() || 
                    ub.toLowerCase() === badge.id.toLowerCase() ||
                    ub.toLowerCase() === badge.id.replace("_", " ").toLowerCase()
                  ) || (badge.id === "neural_init" && userBadges.length > 0)
                    || (badge.id === "apex_optimizer" && userBadges.includes("Rising Twin"))
                    || (badge.id === "grand_architect" && userBadges.includes("Month Master"));

                  return (
                    <div
                      key={badge.id}
                      className={`pf-badge-card ${isUnlocked ? "unlocked" : "locked"}`}
                      style={{
                        background: isUnlocked ? badge.bg : "#f8fafc",
                        ["--b-color" as any]: badge.color,
                      }}
                    >
                      <div className="pf-badge-icon" style={{ background: isUnlocked ? `${badge.color}22` : "#f1f5f9" }}>
                        {isUnlocked
                          ? <BIcon size={22} color={badge.color} />
                          : <Lock size={18} color="#cbd5e1" />
                        }
                      </div>
                      <div className="pf-badge-title" style={{ color: isUnlocked ? badge.color : "#94a3b8" }}>
                        {badge.title}
                      </div>
                      {isUnlocked ? (
                        <div className="pf-badge-desc">{badge.description}</div>
                      ) : (
                        <div className="pf-badge-lock"><Lock size={9}/> Locked</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── OPTIMIZATION VECTOR SELECTOR ── */}
          <div className="pf-card" style={{ marginBottom: 40 }}>
            <div className="pf-card-header">
              <div className="pf-icon-ring" style={{ background: `${activeVector.color}18` }}>
                <Sparkles size={17} color={activeVector.color} />
              </div>
              <div>
                <div className="pf-card-title">Active Optimization Vector</div>
                <div className="pf-card-sub">Primary axis driving twin's trade-off computations</div>
              </div>
            </div>
            <div className="pf-card-body">
              <div className="pf-vector-grid">
                {(["health", "finance", "career"] as OptVector[]).map(v => {
                  const meta = vectorMeta[v];
                  const VIcon = meta.icon;
                  const isSelected = profile.optimizationVector === v;
                  return (
                    <div
                      key={v}
                      className={`pf-vector-card${isSelected ? " selected" : ""}${isSelected && vectorPulse ? " pulse" : ""}`}
                      style={{
                        background: meta.bg,
                        ["--vc-color" as any]: meta.color,
                        ["--vc-shadow" as any]: `${meta.color}44`,
                      }}
                      onClick={() => handleVectorSelect(v)}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div className="pf-vector-card-icon" style={{ background: `${meta.color}18` }}>
                          <VIcon size={18} color={meta.color} />
                        </div>
                        {isSelected && (
                          <div className="pf-vector-active-chip" style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}33` }}>
                            <CheckCircle2 size={10} /> Active
                          </div>
                        )}
                      </div>
                      <div className="pf-vector-card-label">Optimization</div>
                      <div className="pf-vector-card-name" style={{ color: meta.color }}>{meta.label}</div>
                      <div className="pf-vector-card-desc">{meta.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}