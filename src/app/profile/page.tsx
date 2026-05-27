"use client";

import { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
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
} from "lucide-react";

/* ─────────────────────────────────────────────
   Avatar SVG Definitions
───────────────────────────────────────────── */
const AVATAR_OPTIONS = [
  {
    id: 1,
    name: "Cool Guy",
    bg: "#DBEAFE",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <circle cx="50" cy="75" r="28" fill="#1D4ED8"/>
        <circle cx="50" cy="38" r="22" fill="#FBBF24"/>
        <ellipse cx="50" cy="18" rx="18" ry="8" fill="#1e293b"/>
        <rect x="32" y="16" width="36" height="10" rx="5" fill="#1e293b"/>
        <rect x="33" y="36" width="13" height="9" rx="4" fill="#1e293b"/>
        <rect x="54" y="36" width="13" height="9" rx="4" fill="#1e293b"/>
        <line x1="46" y1="40" x2="54" y2="40" stroke="#1e293b" strokeWidth="2"/>
        <path d="M42 50 Q50 58 58 50" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="28" cy="40" r="5" fill="#FBBF24"/>
        <circle cx="72" cy="40" r="5" fill="#FBBF24"/>
      </svg>
    ),
  },
  {
    id: 2,
    name: "Happy Girl",
    bg: "#FCE7F3",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <circle cx="50" cy="75" r="28" fill="#EC4899"/>
        <circle cx="50" cy="38" r="22" fill="#FDE68A"/>
        <ellipse cx="50" cy="18" rx="20" ry="9" fill="#7C3AED"/>
        <rect x="28" y="18" width="10" height="30" rx="5" fill="#7C3AED"/>
        <rect x="62" y="18" width="10" height="30" rx="5" fill="#7C3AED"/>
        <rect x="30" y="14" width="40" height="12" rx="6" fill="#7C3AED"/>
        <circle cx="41" cy="38" r="4" fill="#1e293b"/>
        <circle cx="59" cy="38" r="4" fill="#1e293b"/>
        <circle cx="43" cy="36" r="1.5" fill="white"/>
        <circle cx="61" cy="36" r="1.5" fill="white"/>
        <circle cx="35" cy="46" r="5" fill="#FCA5A5" opacity="0.6"/>
        <circle cx="65" cy="46" r="5" fill="#FCA5A5" opacity="0.6"/>
        <path d="M40 49 Q50 60 60 49" stroke="#92400e" strokeWidth="2.5" fill="#FCA5A5" strokeLinecap="round"/>
        <circle cx="28" cy="40" r="5" fill="#FDE68A"/>
        <circle cx="72" cy="40" r="5" fill="#FDE68A"/>
      </svg>
    ),
  },
  {
    id: 3,
    name: "Tech Wizard",
    bg: "#D1FAE5",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <circle cx="50" cy="75" r="28" fill="#059669"/>
        <circle cx="50" cy="38" r="22" fill="#FDBA74"/>
        <ellipse cx="50" cy="17" rx="16" ry="7" fill="#dc2626"/>
        <polygon points="36,18 32,4 40,14" fill="#dc2626"/>
        <polygon points="50,16 48,2 54,14" fill="#dc2626"/>
        <polygon points="64,18 68,4 60,14" fill="#dc2626"/>
        <circle cx="41" cy="38" r="7" fill="none" stroke="#1e293b" strokeWidth="2.5"/>
        <circle cx="59" cy="38" r="7" fill="none" stroke="#1e293b" strokeWidth="2.5"/>
        <line x1="48" y1="38" x2="52" y2="38" stroke="#1e293b" strokeWidth="2"/>
        <line x1="27" y1="35" x2="34" y2="37" stroke="#1e293b" strokeWidth="2"/>
        <line x1="66" y1="37" x2="73" y2="35" stroke="#1e293b" strokeWidth="2"/>
        <circle cx="41" cy="38" r="3" fill="#1e293b"/>
        <circle cx="59" cy="38" r="3" fill="#1e293b"/>
        <path d="M42 50 Q50 57 58 50" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="28" cy="40" r="5" fill="#FDBA74"/>
        <circle cx="72" cy="40" r="5" fill="#FDBA74"/>
      </svg>
    ),
  },
  {
    id: 4,
    name: "Explorer",
    bg: "#FEF3C7",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <circle cx="50" cy="75" r="28" fill="#D97706"/>
        <circle cx="50" cy="38" r="22" fill="#FCD34D"/>
        <rect x="30" y="18" width="40" height="6" rx="3" fill="#92400e"/>
        <ellipse cx="50" cy="16" rx="22" ry="5" fill="#92400e"/>
        <rect x="36" y="10" width="28" height="12" rx="4" fill="#B45309"/>
        <circle cx="41" cy="39" r="4.5" fill="white"/>
        <circle cx="59" cy="39" r="4.5" fill="white"/>
        <circle cx="42" cy="39" r="2.5" fill="#1e293b"/>
        <circle cx="60" cy="39" r="2.5" fill="#1e293b"/>
        <path d="M41 50 Q50 59 59 50" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="28" cy="40" r="5" fill="#FCD34D"/>
        <circle cx="72" cy="40" r="5" fill="#FCD34D"/>
      </svg>
    ),
  },
  {
    id: 5,
    name: "Star Artist",
    bg: "#EDE9FE",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <circle cx="50" cy="75" r="28" fill="#7C3AED"/>
        <circle cx="50" cy="38" r="22" fill="#FECACA"/>
        <circle cx="34" cy="22" r="9" fill="#0f172a"/>
        <circle cx="50" cy="18" r="10" fill="#0f172a"/>
        <circle cx="66" cy="22" r="9" fill="#0f172a"/>
        <circle cx="28" cy="32" r="7" fill="#0f172a"/>
        <circle cx="72" cy="32" r="7" fill="#0f172a"/>
        <text x="33" y="49" fontSize="9" fill="#F59E0B">★</text>
        <ellipse cx="41" cy="38" rx="4" ry="4.5" fill="#1e293b"/>
        <ellipse cx="59" cy="38" rx="4" ry="4.5" fill="#1e293b"/>
        <circle cx="42.5" cy="36.5" r="1.5" fill="white"/>
        <circle cx="60.5" cy="36.5" r="1.5" fill="white"/>
        <path d="M41 50 Q50 59 59 50" stroke="#991b1b" strokeWidth="2.5" fill="#FCA5A5" strokeLinecap="round"/>
        <circle cx="28" cy="40" r="5" fill="#FECACA"/>
        <circle cx="72" cy="40" r="5" fill="#FECACA"/>
      </svg>
    ),
  },
  {
    id: 6,
    name: "Sport Champ",
    bg: "#DCFCE7",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <circle cx="50" cy="75" r="28" fill="#16A34A"/>
        <rect x="30" y="22" width="40" height="8" rx="4" fill="#EF4444"/>
        <circle cx="50" cy="38" r="22" fill="#D1FAE5"/>
        <rect x="32" y="14" width="36" height="12" rx="6" fill="#1e293b"/>
        <ellipse cx="41" cy="38" rx="5" ry="4" fill="white"/>
        <ellipse cx="59" cy="38" rx="5" ry="4" fill="white"/>
        <circle cx="42" cy="38" r="3" fill="#1e293b"/>
        <circle cx="60" cy="38" r="3" fill="#1e293b"/>
        <path d="M43 50 Q52 57 58 50" stroke="#065f46" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="28" cy="40" r="5" fill="#D1FAE5"/>
        <circle cx="72" cy="40" r="5" fill="#D1FAE5"/>
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────
   InfoRow Component — read-only field
───────────────────────────────────────────── */
function InfoRow({ icon: Icon, label, value, accent }: {
  icon: any; label: string; value: string; accent?: boolean;
}) {
  return (
    <div className="pf-info-row">
      <div className="pf-info-icon">
        <Icon size={14} color={accent ? "#0044DD" : "#94a3b8"} />
      </div>
      <div className="pf-info-content">
        <span className="pf-info-label">{label}</span>
        <span className="pf-info-value" style={{ color: accent ? "#0044DD" : "#111" }}>{value || "—"}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   StatPill Component
───────────────────────────────────────────── */
function StatPill({ icon: Icon, label, value, color, bg }: {
  icon: any; label: string; value: string; color: string; bg: string;
}) {
  return (
    <div className="pf-stat-pill" style={{ background: bg, border: `1px solid ${color}22` }}>
      <div className="pf-stat-pill-icon" style={{ background: `${color}18` }}>
        <Icon size={13} color={color} />
      </div>
      <div>
        <div className="pf-stat-pill-label">{label}</div>
        <div className="pf-stat-pill-value" style={{ color }}>{value}</div>
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
  }, [fullText]); // ✅ only depends on fullText, self-drives via setTimeout chain

  return displayed;
}

/* ─────────────────────────────────────────────
   Main Profile Page
───────────────────────────────────────────── */
export default function ProfilePage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    avatarId: 1,
    optimizationVector: "career",
  });

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      setProfile({
        name: session.user.name || "",
        email: session.user.email || "",
        age: (session.user as any).age || "",
        avatarId: (session.user as any).avatarId || 1,
        optimizationVector: (session.user as any).optimizationVector || "career",
      });
    }
  }, [session]);

  const selectedAvatar = AVATAR_OPTIONS.find((a) => a.id === profile.avatarId) || AVATAR_OPTIONS[0];

  const vectorMeta: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    career:  { label: "Career Layer",  color: "#0066FF", bg: "#eff6ff", icon: Briefcase },
    health:  { label: "Health Layer",  color: "#ef4444", bg: "#fef2f2", icon: HeartPulse },
    finance: { label: "Finance Layer", color: "#10b981", bg: "#f0fdf4", icon: Wallet },
  };
  const activeVector = vectorMeta[profile.optimizationVector] || vectorMeta.career;
  const VectorIcon = activeVector.icon;

  const twinText = useTypewriter("Twin Profile");

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
          width: 240px;
          height: 100vh;
          position: sticky;
          top: 0;
          flex-shrink: 0;
          background: linear-gradient(140deg, #0044DD 0%, #0066FF 55%, #3322EE 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 24px 36px;
          overflow: hidden;
          gap: 0;
        }
        /* Decorative orbit rings */
        .pf-left::before {
          content: '';
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
          height: 320px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.06);
          pointer-events: none;
        }
        .pf-left::after {
          content: '';
          position: absolute;
          top: 90px;
          left: 50%;
          transform: translateX(-50%);
          width: 220px;
          height: 220px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.05);
          pointer-events: none;
        }
        /* Glowing orb */
        .pf-orb {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #4d8bff, #0044DD 60%, #0a0f2e);
          border: 2px solid rgba(255,255,255,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
          box-shadow: 0 0 0 12px rgba(0,68,221,0.12), 0 0 0 24px rgba(0,68,221,0.06);
        }
        .pf-orb-inner {
          width: 32px;
          height: 32px;
        }
        /* Brand name */
        .pf-brand {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.3rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0 0 4px;
          position: relative;
          z-index: 1;
        }
        .pf-brand-sub {
          font-size: 0.7rem;
          font-weight: 500;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 36px;
          position: relative;
          z-index: 1;
        }
        /* Divider */
        .pf-sidebar-divider {
          width: 100%;
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin-bottom: 28px;
          position: relative;
          z-index: 1;
        }
        /* Nav items */
        .pf-nav {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
          z-index: 1;
          flex: 1;
        }
        .pf-nav-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          font-family: 'Inter', sans-serif;
          cursor: default;
          transition: all 0.2s;
          letter-spacing: 0.01em;
        }
        .pf-nav-item:hover {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.8);
        }
        .pf-nav-item.active {
          background: rgba(255,255,255,0.12);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.14);
        }
        .pf-nav-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        /* Status badge */
        .pf-status-badge {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          position: relative;
          z-index: 1;
        }
        .pf-status-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #34d399;
          flex-shrink: 0;
          box-shadow: 0 0 0 3px rgba(52,211,153,0.25);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(52,211,153,0.25); }
          50% { box-shadow: 0 0 0 6px rgba(52,211,153,0.1); }
        }
        .pf-status-text {
          font-size: 0.72rem;
          font-weight: 600;
          color: rgba(255,255,255,0.55);
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.03em;
        }
        .pf-status-val {
          font-size: 0.72rem;
          font-weight: 700;
          color: #34d399;
        }
        /* Logout */
        .pf-signout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px 14px;
          color: rgba(255,255,255,0.45);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          font-family: 'Inter', sans-serif;
          position: relative;
          z-index: 1;
        }
        .pf-signout-btn:hover {
          background: rgba(255,80,80,0.15);
          border-color: rgba(255,120,120,0.3);
          color: #fca5a5;
        }

        /* ── MAIN ── */
        .pf-right { flex: 1; background: #f7f8fc; display: flex; flex-direction: column; align-items: center; padding: 40px 32px; min-height: 100vh; }
        .pf-main-wrapper { width: 100%; max-width: 680px; }

        .pf-exit-bar { display: inline-flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 600; color: #64748b; margin-bottom: 32px; padding: 7px 14px; border-radius: 9999px; background: #fff; border: 1px solid #e2e8f0; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: all 0.2s; width: fit-content; }
        .pf-exit-bar:hover { color: #0044DD; border-color: #b8d0ff; background: #f0f5ff; transform: translateX(-2px); }

        /* Header text */
        .pf-page-header { margin-bottom: 24px; }
        .pf-title { font-family: 'DM Sans', sans-serif; font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; color: #0d1117; letter-spacing: -0.04em; margin: 0 0 4px; min-height: 2.6rem; display: block; line-height: 1.2; }
        .pf-title-accent { color: #0044DD; display: inline; }
        .pf-title-rest { color: #0d1117; display: inline; }
        .pf-title-cursor { display: inline-block; width: 2.5px; height: 1em; background: #0044DD; margin-left: 3px; vertical-align: middle; border-radius: 1px; animation: cursorBlink 1.1s ease-in-out infinite; opacity: 0.85; }
        @keyframes cursorBlink { 0%, 100% { opacity: 0.85; } 48%, 52% { opacity: 0; } }
        .pf-subtitle { font-size: 0.83rem; color: #64748b; margin: 0; }

        /* ── PROFILE HERO CARD ── */
        .pf-hero-card { background: #fff; border-radius: 22px; border: 1px solid #e4e9f4; box-shadow: 0 8px 40px rgba(0,68,221,0.08), 0 1px 4px rgba(0,0,0,0.04); overflow: hidden; margin-bottom: 14px; }

        /* Top gradient banner */
        .pf-hero-banner { height: 80px; background: linear-gradient(120deg, #0044DD 0%, #0066FF 50%, #3322EE 100%); position: relative; overflow: hidden; flex-shrink: 0; }
        .pf-hero-banner::before { content: ''; position: absolute; top: -40px; right: -40px; width: 160px; height: 160px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%); }
        .pf-hero-banner::after  { content: ''; position: absolute; bottom: -30px; left: 60px; width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%); }

        .pf-hero-body { padding: 0 28px 26px; }

        .pf-avatar-row {
          display: flex;
          align-items: flex-end;
          gap: 20px;
          margin-top: -46px;
          margin-bottom: 22px;
          padding-top: 0;
        }

        /* Avatar ring with glow */
        .pf-avatar-outer { position: relative; flex-shrink: 0; }
        .pf-avatar-glow { position: absolute; inset: -4px; border-radius: 50%; background: conic-gradient(from 0deg, #0044DD, #0066FF, #3322EE, #0044DD); opacity: 0.6; filter: blur(4px); }
        .pf-avatar-ring { width: 90px; height: 90px; border-radius: 50%; background: #fff; border: 3px solid #fff; box-shadow: 0 6px 20px rgba(0,68,221,0.25); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; z-index: 1; }
        .pf-avatar-inner { width: 80px; height: 80px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; }

        .pf-avatar-meta {
          padding-bottom: 6px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .pf-hero-name { font-family: 'DM Sans', sans-serif; font-size: 1.35rem; font-weight: 800; color: #0d1117; letter-spacing: -0.03em; line-height: 1.2; }
        .pf-twin-badge { display: inline-flex; align-items: center; gap: 5px; background: linear-gradient(90deg, #eff4ff, #e8edfc); border: 1px solid #c7d7fb; border-radius: 9999px; padding: 4px 10px; font-size: 0.68rem; font-weight: 700; color: #0044DD; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 8px; width: fit-content; }

        /* Info rows */
        .pf-info-section { display: flex; flex-direction: column; gap: 2px; }
        .pf-info-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 11px; transition: background 0.15s; }
        .pf-info-row:hover { background: #f7f9ff; }
        .pf-info-icon { width: 30px; height: 30px; border-radius: 9px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pf-info-content { display: flex; flex-direction: column; gap: 1px; }
        .pf-info-label { font-size: 0.68rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; }
        .pf-info-value { font-size: 0.88rem; color: #111; font-weight: 600; }
        .pf-info-divider { height: 1px; background: #f1f5f9; margin: 4px 14px; }

        /* ── SECONDARY CARDS ── */
        .pf-card { background: #fff; border-radius: 18px; border: 1px solid #e4e9f4; overflow: hidden; box-shadow: 0 4px 20px rgba(0,68,221,0.05), 0 1px 3px rgba(0,0,0,0.03); margin-bottom: 14px; }
        .pf-card-header { padding: 16px 22px 14px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 13px; }
        .pf-icon-ring { width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pf-card-title { font-size: 0.88rem; font-weight: 700; color: #0d1117; letter-spacing: -0.01em; }
        .pf-card-sub { font-size: 0.72rem; color: #94a3b8; font-weight: 500; margin-top: 1px; }
        .pf-card-body { padding: 18px 22px; }

        /* Stat pills row */
        .pf-pills-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .pf-stat-pill { border-radius: 13px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; }
        .pf-stat-pill-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pf-stat-pill-label { font-size: 0.65rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; }
        .pf-stat-pill-value { font-size: 0.82rem; font-weight: 700; }

        /* Vector highlight */
        .pf-vector-highlight { display: flex; align-items: center; gap: 14px; border-radius: 14px; padding: 14px 18px; border: 1px solid; }
        .pf-vector-icon-wrap { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pf-vector-label { font-size: 0.72rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; }
        .pf-vector-name { font-size: 0.95rem; font-weight: 700; }
        .pf-vector-desc { font-size: 0.74rem; color: #64748b; margin-top: 2px; }

        /* Active chip */
        .pf-active-chip { margin-left: auto; display: flex; align-items: center; gap: 5px; font-size: 0.68rem; font-weight: 700; color: #0044DD; background: #eff4ff; border: 1px solid #c7d7fb; border-radius: 9999px; padding: 4px 10px; flex-shrink: 0; }

        @media (max-width: 860px) { .pf-left { display: none; } .pf-right { padding: 28px 16px; } }
        @media (max-width: 540px) { .pf-pills-row { grid-template-columns: 1fr 1fr; } .pf-hero-name { font-size: 1.1rem; } }
      `}</style>

      {/* ── LEFT SIDEBAR ── */}
      <div className="pf-left">
        {/* Glowing orb with S monogram */}
        
        <div className="pf-brand">Syntra</div>
        <div className="pf-brand-sub">AI Twin Platform</div>
        <div className="pf-sidebar-divider" />
        
        {/* Nav links */}
        <div className="pf-nav">
          <div className="pf-nav-item active">
            <div className="pf-nav-dot" style={{ background: "#60a5fa" }} />
            Twin Profile
          </div>
          <div className="pf-nav-item">
            <div className="pf-nav-dot" style={{ background: "rgba(255,255,255,0.2)" }} />
            Neural Sync
          </div>
          <div className="pf-nav-item">
            <div className="pf-nav-dot" style={{ background: "rgba(255,255,255,0.2)" }} />
            Optimization
          </div>
          <div className="pf-nav-item">
            <div className="pf-nav-dot" style={{ background: "rgba(255,255,255,0.2)" }} />
            Data Layers
          </div>
        </div>

        {/* Live status */}
        <div className="pf-status-badge">
          <div className="pf-status-pulse" />
          <div>
            <div className="pf-status-text">Twin Status</div>
            <div className="pf-status-val">Online & Syncing</div>
          </div>
        </div>

        {/* Logout */}
        <button
          className="pf-signout-btn"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut size={13} /> Log Out
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="pf-right">
        <div className="pf-main-wrapper">

          <div className="pf-exit-bar" onClick={() => history.back()}>
            <ArrowLeft size={13} /> Return to Dashboard
          </div>

          <div className="pf-page-header">
            <h1 className="pf-title">
              <span className="pf-title-accent">
                {twinText.slice(0, 4) || ""}
              </span>
              <span className="pf-title-rest">
                {twinText.slice(4) || ""}
              </span>
              <span className="pf-title-cursor" />
            </h1>

            <p className="pf-subtitle">
              Your digital identity and AI twin configuration overview.
            </p>
          </div>

          {/* ── HERO PROFILE CARD ── */}
          <div className="pf-hero-card">
            <div className="pf-hero-banner" />
            <div className="pf-hero-body">
              <div className="pf-avatar-row">
                {/* Avatar with glow ring ─ overlaps banner */}
                <div className="pf-avatar-outer">
                  <div className="pf-avatar-glow" />
                  <div className="pf-avatar-ring">
                    <div className="pf-avatar-inner" style={{ background: selectedAvatar.bg }}>
                      {selectedAvatar.svg}
                    </div>
                  </div>
                </div>
                {/* Name + badge ─ bottom-aligned beside avatar, fully below banner */}
                <div className="pf-avatar-meta">
                  <div className="pf-hero-name">{profile.name || "Your Name"}</div>
                  <div className="pf-twin-badge">
                    <Sparkles size={10} /> Syntra AI Twin — {selectedAvatar.name}
                  </div>
                </div>
              </div>

              {/* Info rows */}
              <div className="pf-info-section">
                <InfoRow icon={User}     label="Full Name"     value={profile.name} />
                <div className="pf-info-divider" />
                <InfoRow icon={Mail}     label="Email Address" value={profile.email} />
                <div className="pf-info-divider" />
                <InfoRow icon={Calendar} label="Age"           value={profile.age ? `${profile.age} years` : "—"} />
                <div className="pf-info-divider" />
                <InfoRow icon={Shield}   label="Access Level"  value="Authenticated Member" accent />
              </div>
            </div>
          </div>

          {/* ── SYNC OVERVIEW CARD ── */}
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
              <div className="pf-pills-row">
                <StatPill icon={HeartPulse} label="Health"  value="Active"      color="#ef4444" bg="#fef2f2" />
                <StatPill icon={Wallet}     label="Finance" value="Tracking"    color="#10b981" bg="#f0fdf4" />
                <StatPill icon={Briefcase}  label="Career"  value="In Progress" color="#0066FF" bg="#eff6ff" />
              </div>
            </div>
          </div>

          {/* ── OPTIMIZATION VECTOR CARD ── */}
          <div className="pf-card">
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
              <div
                className="pf-vector-highlight"
                style={{ background: activeVector.bg, borderColor: `${activeVector.color}22` }}
              >
                <div
                  className="pf-vector-icon-wrap"
                  style={{ background: `${activeVector.color}18` }}
                >
                  <VectorIcon size={18} color={activeVector.color} />
                </div>
                <div>
                  <div className="pf-vector-label">Current Focus</div>
                  <div className="pf-vector-name" style={{ color: activeVector.color }}>{activeVector.label}</div>
                  <div className="pf-vector-desc">
                    {{
                      career:  "Focus duration thresholds & production output metrics.",
                      health:  "Biometric rest cycles, metabolic energy & stability profiles.",
                      finance: "Run-rate curves, micro-spending & risk parameters.",
                    }[profile.optimizationVector]}
                  </div>
                </div>
                <div className="pf-active-chip">
                  <CheckCircle2 size={10} /> Active
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}