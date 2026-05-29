"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  HeartPulse,
  Wallet,
  Briefcase,
  CheckCircle2,
  Sparkles,
  Cpu,
  Brain,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type OptVector = "health" | "finance" | "career";
type PageState = "selecting" | "loading" | "calibrating";

interface VectorCard {
  id: OptVector;
  theme: string;
  color: string;
  bg: string;
  borderColor: string;
  glowColor: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tags: string[];
}

/* ─────────────────────────────────────────────
   Vector Card Definitions
───────────────────────────────────────────── */
const VECTOR_CARDS: VectorCard[] = [
  {
    id: "health",
    theme: "Health Layer",
    color: "#ef4444",
    bg: "linear-gradient(145deg,#1a0505,#2d0a0a)",
    borderColor: "rgba(239,68,68,0.35)",
    glowColor: "rgba(239,68,68,0.25)",
    icon: <HeartPulse size={26} color="#ef4444" />,
    title: "Vitality",
    subtitle: "Biometric optimization core",
    tags: ["Rest cycles", "Metabolic stability", "Energy profiles", "Vitality optimization"],
  },
  {
    id: "finance",
    theme: "Finance Layer",
    color: "#10b981",
    bg: "linear-gradient(145deg,#011a0f,#032d1c)",
    borderColor: "rgba(16,185,129,0.35)",
    glowColor: "rgba(16,185,129,0.25)",
    icon: <Wallet size={26} color="#10b981" />,
    title: "Capital Runway",
    subtitle: "Financial intelligence engine",
    tags: ["Run-rate curves", "Savings runway", "Expense forecasting", "Capital management"],
  },
  {
    id: "career",
    theme: "Career Layer",
    color: "#3b82f6",
    bg: "linear-gradient(145deg,#020b1a,#041529)",
    borderColor: "rgba(59,130,246,0.35)",
    glowColor: "rgba(59,130,246,0.25)",
    icon: <Briefcase size={26} color="#3b82f6" />,
    title: "Production",
    subtitle: "Output & velocity intelligence",
    tags: ["Focus thresholds", "Learning velocity", "Output metrics", "Productivity intelligence"],
  },
];

/* ─────────────────────────────────────────────
   Syntra Monogram (matches Signup page style)
───────────────────────────────────────────── */
function SyntraMonogram() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 40 }}>
      <div style={{ position: "relative", width: 72, height: 72 }}>
        {/* Outer glow ring */}
        <div style={{
          position: "absolute", inset: -8,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,102,255,0.18) 0%, transparent 70%)",
          animation: "monogramPulse 3s ease-in-out infinite",
        }} />
        {/* SVG monogram */}
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="mono-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0a1628" />
              <stop offset="100%" stopColor="#050d1a" />
            </radialGradient>
            <radialGradient id="mono-glow1" cx="40%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#0044DD" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0044DD" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="mono-glow2" cx="60%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#0066FF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
            </radialGradient>
            <filter id="glow-filter">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Background circle */}
          <circle cx="36" cy="36" r="35" fill="url(#mono-bg)" stroke="rgba(0,68,221,0.3)" strokeWidth="1" />
          {/* Glow overlays */}
          <circle cx="36" cy="36" r="35" fill="url(#mono-glow1)" />
          <circle cx="36" cy="36" r="35" fill="url(#mono-glow2)" />
          {/* Intersecting circles - double helix inspired */}
          <circle cx="28" cy="36" r="14" fill="none" stroke="rgba(0,102,255,0.6)" strokeWidth="1.2" />
          <circle cx="44" cy="36" r="14" fill="none" stroke="rgba(0,68,221,0.6)" strokeWidth="1.2" />
          {/* Inner intersection fill */}
          <path d="M36 24.2 C39.8 27.2 42 31.4 42 36 C42 40.6 39.8 44.8 36 47.8 C32.2 44.8 30 40.6 30 36 C30 31.4 32.2 27.2 36 24.2Z"
            fill="rgba(0,85,255,0.18)" stroke="rgba(100,160,255,0.4)" strokeWidth="0.8" />
          {/* Horizontal infinity line */}
          <path d="M14 36 Q22 28 30 36 Q38 44 46 36 Q54 28 58 36"
            fill="none" stroke="rgba(96,165,250,0.5)" strokeWidth="1" strokeLinecap="round" />
          {/* Center dot */}
          <circle cx="36" cy="36" r="2.5" fill="#60a5fa" opacity="0.9" filter="url(#glow-filter)" />
          {/* Outer orbit dots */}
          <circle cx="36" cy="14" r="1.5" fill="#0044DD" opacity="0.7" />
          <circle cx="36" cy="58" r="1.5" fill="#0044DD" opacity="0.7" />
          <circle cx="14" cy="36" r="1.5" fill="#0044DD" opacity="0.7" />
          <circle cx="58" cy="36" r="1.5" fill="#0044DD" opacity="0.7" />
        </svg>
      </div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "1.1rem",
        fontWeight: 800,
        color: "#ffffff",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}>
        SYNTRA
      </div>
      <div style={{
        fontSize: "0.65rem",
        fontWeight: 600,
        color: "rgba(255,255,255,0.3)",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
      }}>
        AI Twin Platform
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Calibration Screen
───────────────────────────────────────────── */
function CalibrationScreen({ vector }: { vector: OptVector | null }) {
  const meta = vector ? VECTOR_CARDS.find(c => c.id === vector) : null;
  const accentColor = meta?.color ?? "#0044DD";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "linear-gradient(135deg,#020812 0%,#030e1e 50%,#040a14 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.4s ease",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ringPulse1 { 0%,100% { transform: scale(1); opacity: 0.15; } 50% { transform: scale(1.08); opacity: 0.3; } }
        @keyframes ringPulse2 { 0%,100% { transform: scale(1); opacity: 0.1; } 50% { transform: scale(1.12); opacity: 0.22; } }
        @keyframes ringPulse3 { 0%,100% { transform: scale(1); opacity: 0.06; } 50% { transform: scale(1.16); opacity: 0.14; } }
        @keyframes brainRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes calibTextIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dotBlink { 0%,80%,100% { opacity: 0; } 40% { opacity: 1; } }
      `}</style>

      {/* Pulsing rings */}
      <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%",
        border: `1px solid ${accentColor}`, animation: "ringPulse3 2.4s ease-in-out infinite", animationDelay: "0.6s" }} />
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%",
        border: `1px solid ${accentColor}`, animation: "ringPulse2 2.4s ease-in-out infinite", animationDelay: "0.3s" }} />
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%",
        border: `1px solid ${accentColor}`, animation: "ringPulse1 2.4s ease-in-out infinite" }} />

      {/* Radial glow */}
      <div style={{
        position: "absolute", width: 280, height: 280, borderRadius: "50%",
        background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
      }} />

      {/* Brain/core icon */}
      <div style={{
        position: "relative", zIndex: 1,
        width: 96, height: 96, borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${accentColor}33 0%, rgba(5,13,26,0.95) 70%)`,
        border: `1.5px solid ${accentColor}55`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 40px ${accentColor}40, 0 0 80px ${accentColor}20`,
        marginBottom: 36,
      }}>
        {/* Rotating orbit */}
        <div style={{
          position: "absolute", inset: -12,
          borderRadius: "50%",
          border: `1px dashed ${accentColor}40`,
          animation: "brainRotate 4s linear infinite",
        }} />
        <Brain size={40} color={accentColor} />
      </div>

      {/* Text */}
      <div style={{
        position: "relative", zIndex: 1,
        textAlign: "center",
        animation: "calibTextIn 0.5s ease 0.2s both",
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: "-0.03em",
          marginBottom: 12,
        }}>
          Synchronizing Your AI Twin
        </div>
        <div style={{
          fontSize: "0.82rem",
          color: "rgba(255,255,255,0.4)",
          fontWeight: 500,
          letterSpacing: "0.04em",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
        }}>
          Calibrating {meta?.theme} vector
          <span style={{ display: "inline-flex", gap: 3, marginLeft: 2 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 4, height: 4, borderRadius: "50%",
                background: accentColor,
                display: "inline-block",
                animation: `dotBlink 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }} />
            ))}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        position: "relative", zIndex: 1,
        marginTop: 32, width: 220, height: 2,
        background: "rgba(255,255,255,0.06)",
        borderRadius: 9999, overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: 9999,
          background: `linear-gradient(90deg, ${accentColor}80, ${accentColor})`,
          animation: "progressFill 2s ease forwards",
        }} />
      </div>

      <style>{`
        @keyframes progressFill { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Onboarding Page
───────────────────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedVector, setSelectedVector] = useState<OptVector | null>(null);
  const [pageState, setPageState] = useState<PageState>("selecting");
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<OptVector | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleLockIn = async () => {
    if (!selectedVector || pageState !== "selecting") return;
    setError(null);
    setPageState("loading");

    try {
      const res = await fetch("/api/profile/vector", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optimizationVector: selectedVector }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? "Failed to save optimization vector.");
      }

      setPageState("calibrating");
      setTimeout(() => {
        router.push("/ingestion");
      }, 2200);
    } catch (err: any) {
      setError(err.message ?? "An error occurred. Please try again.");
      setPageState("selecting");
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
      padding: "40px 20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        /* Background mesh */
        .ob-bg-mesh {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 80% 50% at 20% 20%, rgba(0,68,221,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0,68,221,0.05) 0%, transparent 60%);
        }
        .ob-grid-overlay {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(0,68,221,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,68,221,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Cards */
        .ob-vector-card {
          position: relative; border-radius: 20px; padding: 28px 24px;
          cursor: pointer; transition: all 0.28s cubic-bezier(0.16,1,0.3,1);
          border: 1.5px solid transparent;
          overflow: hidden;
          flex: 1; min-width: 0;
        }
        .ob-vector-card::before {
          content: ''; position: absolute; inset: 0; border-radius: 20px;
          opacity: 0; transition: opacity 0.28s;
          pointer-events: none;
        }
        .ob-vector-card:hover {
          transform: translateY(-4px) scale(1.015);
        }
        .ob-vector-card.selected {
          transform: translateY(-4px) scale(1.015);
        }
        .ob-vector-card.selected .ob-card-check {
          opacity: 1; transform: scale(1);
        }

        /* Tag pills */
        .ob-tag {
          display: inline-block;
          padding: 4px 10px; border-radius: 9999px;
          font-size: 0.67rem; font-weight: 600;
          letter-spacing: 0.04em;
          transition: all 0.2s;
        }

        /* Lock In Button */
        .ob-cta-btn {
          width: 100%; max-width: 480px;
          padding: 16px 32px;
          border: none; border-radius: 14px;
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem; font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .ob-cta-btn:not(:disabled) {
          background: linear-gradient(135deg,#0044DD,#0066FF,#3322EE);
          color: #fff;
          box-shadow: 0 4px 24px rgba(0,68,221,0.35), 0 1px 4px rgba(0,0,0,0.2);
        }
        .ob-cta-btn:not(:disabled):hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 36px rgba(0,68,221,0.5), 0 2px 8px rgba(0,0,0,0.25);
        }
        .ob-cta-btn:not(:disabled):active {
          transform: translateY(0) scale(0.99);
        }
        .ob-cta-btn:disabled {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.2);
          cursor: not-allowed;
          box-shadow: none;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .ob-cta-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.2s;
          border-radius: inherit;
          pointer-events: none;
        }
        .ob-cta-btn:not(:disabled):hover::after { opacity: 1; }

        /* Pulse animation for selected card */
        @keyframes cardSelectPulse {
          0% { box-shadow: var(--card-shadow); }
          50% { box-shadow: var(--card-shadow-peak); }
          100% { box-shadow: var(--card-shadow); }
        }
        .ob-vector-card.selected {
          animation: cardSelectPulse 2s ease-in-out infinite;
        }

        /* Monogram glow */
        @keyframes monogramPulse {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        /* Loading spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }

        /* Staggered card entrance */
        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ob-vector-card { animation: cardEnter 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .ob-vector-card:nth-child(1) { animation-delay: 0.1s; }
        .ob-vector-card:nth-child(2) { animation-delay: 0.2s; }
        .ob-vector-card:nth-child(3) { animation-delay: 0.3s; }

        @keyframes headerEnter {
          from { opacity: 0; transform: translateY(-14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ob-header { animation: headerEnter 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }

        @keyframes ctaEnter {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ob-cta-wrap { animation: ctaEnter 0.5s cubic-bezier(0.16,1,0.3,1) 0.45s both; }

        /* Error shake */
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-6px); }
          40%,80% { transform: translateX(6px); }
        }
        .ob-error { animation: shake 0.4s ease; }

        @media (max-width: 700px) {
          .ob-cards-row { flex-direction: column !important; }
          .ob-vector-card { min-height: auto !important; }
        }
      `}</style>

      {/* Background layers */}
      <div className="ob-bg-mesh" />
      <div className="ob-grid-overlay" />

      {/* Calibration overlay */}
      {pageState === "calibrating" && <CalibrationScreen vector={selectedVector} />}

      {/* Content wrapper */}
      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: 900,
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 0,
      }}>

        {/* Monogram */}
        <SyntraMonogram />

        {/* Header */}
        <div className="ob-header" style={{ textAlign: "center", marginBottom: 48 }}>
          {/* Step indicator */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(0,68,221,0.1)",
            border: "1px solid rgba(0,68,221,0.25)",
            borderRadius: 9999,
            padding: "5px 14px",
            marginBottom: 20,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#0066FF",
              boxShadow: "0 0 6px rgba(0,102,255,0.8)",
            }} />
            <span style={{
              fontSize: "0.67rem", fontWeight: 700, color: "rgba(96,165,250,0.9)",
              letterSpacing: "0.12em", textTransform: "uppercase",
            }}>
              Step 1 of 2 — Optimization Vector
            </span>
          </div>

          <h1 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(1.7rem, 4vw, 2.6rem)",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.04em",
            margin: "0 0 14px",
            lineHeight: 1.15,
          }}>
            What is your primary{" "}
            <span style={{
              background: "linear-gradient(90deg, #60a5fa, #3b82f6, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              optimization bias?
            </span>
          </h1>

          <p style={{
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.4)",
            fontWeight: 500,
            margin: 0,
            letterSpacing: "0.01em",
            maxWidth: 420,
            marginInline: "auto",
          }}>
            Choose the domain your AI Twin should prioritize first.
          </p>
        </div>

        {/* Vector Cards */}
        <div
          className="ob-cards-row"
          style={{
            display: "flex",
            gap: 16,
            width: "100%",
            marginBottom: 36,
            alignItems: "stretch",
          }}
        >
          {VECTOR_CARDS.map((card) => {
            const isSelected = selectedVector === card.id;
            const isHovered = hoveredCard === card.id;

            return (
              <div
                key={card.id}
                className={`ob-vector-card${isSelected ? " selected" : ""}`}
                style={{
                  background: card.bg,
                  borderColor: isSelected ? card.color : (isHovered ? card.borderColor : "rgba(255,255,255,0.06)"),
                  boxShadow: isSelected
                    ? `0 0 0 1px ${card.color}40, 0 8px 40px ${card.glowColor}, inset 0 1px 0 rgba(255,255,255,0.06)`
                    : `0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)`,
                  ["--card-shadow" as any]: `0 0 0 1px ${card.color}40, 0 8px 40px ${card.glowColor}`,
                  ["--card-shadow-peak" as any]: `0 0 0 1px ${card.color}60, 0 12px 56px ${card.glowColor}, 0 0 60px ${card.glowColor}`,
                  minHeight: 260,
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={() => setSelectedVector(card.id)}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                role="button"
                aria-pressed={isSelected}
                aria-label={`Select ${card.theme}`}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedVector(card.id)}
              >
                {/* Inner glow on hover/select */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 20,
                  background: `radial-gradient(ellipse 70% 60% at 30% 30%, ${card.color}12 0%, transparent 70%)`,
                  opacity: isSelected || isHovered ? 1 : 0,
                  transition: "opacity 0.28s",
                  pointerEvents: "none",
                }} />

                {/* Check indicator */}
                <div
                  className="ob-card-check"
                  style={{
                    position: "absolute", top: 16, right: 16,
                    width: 24, height: 24, borderRadius: "50%",
                    background: card.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: isSelected ? 1 : 0,
                    transform: isSelected ? "scale(1)" : "scale(0.4)",
                    transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                    boxShadow: `0 0 12px ${card.color}80`,
                    zIndex: 1,
                  }}
                >
                  <CheckCircle2 size={14} color="#fff" />
                </div>

                {/* Card content */}
                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Icon + theme label */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: 14,
                      background: `${card.color}15`,
                      border: `1px solid ${card.color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: isSelected ? `0 0 16px ${card.color}30` : "none",
                      transition: "box-shadow 0.28s",
                    }}>
                      {card.icon}
                    </div>
                    <div>
                      <div style={{
                        fontSize: "0.62rem", fontWeight: 700,
                        color: card.color,
                        letterSpacing: "0.12em", textTransform: "uppercase",
                        opacity: 0.8, marginBottom: 2,
                      }}>
                        {card.theme}
                      </div>
                      <div style={{
                        fontSize: "1.15rem", fontWeight: 800,
                        color: "#ffffff",
                        fontFamily: "'DM Sans', sans-serif",
                        letterSpacing: "-0.02em",
                      }}>
                        {card.title}
                      </div>
                    </div>
                  </div>

                  {/* Subtitle */}
                  <div style={{
                    fontSize: "0.72rem", fontWeight: 500,
                    color: "rgba(255,255,255,0.35)",
                    marginBottom: 18,
                    letterSpacing: "0.02em",
                  }}>
                    {card.subtitle}
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {card.tags.map(tag => (
                      <span
                        key={tag}
                        className="ob-tag"
                        style={{
                          background: `${card.color}12`,
                          border: `1px solid ${card.color}25`,
                          color: isSelected ? card.color : "rgba(255,255,255,0.45)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom active indicator bar */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: 2, borderRadius: "0 0 20px 20px",
                  background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
                  opacity: isSelected ? 1 : 0,
                  transition: "opacity 0.28s",
                }} />
              </div>
            );
          })}
        </div>

        {/* Error message */}
        {error && (
          <div
            className="ob-error"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 12,
              padding: "12px 18px",
              marginBottom: 20,
              maxWidth: 480, width: "100%",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#fca5a5" }}>{error}</span>
          </div>
        )}

        {/* CTA Button */}
        <div className="ob-cta-wrap" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <button
            className="ob-cta-btn"
            disabled={!selectedVector || pageState === "loading"}
            onClick={handleLockIn}
            aria-disabled={!selectedVector || pageState === "loading"}
          >
            {pageState === "loading" ? (
              <>
                <Cpu size={17} className="spin" />
                Saving vector...
              </>
            ) : (
              <>
                <Sparkles size={17} />
                Lock In Priority Vector
              </>
            )}
          </button>

          {/* Helper text */}
          <div style={{
            fontSize: "0.72rem",
            color: "rgba(255,255,255,0.2)",
            fontWeight: 500,
            letterSpacing: "0.02em",
            textAlign: "center",
          }}>
            {selectedVector
              ? `${VECTOR_CARDS.find(c => c.id === selectedVector)?.theme} selected — ready to calibrate`
              : "Select a vector above to continue"}
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{
          marginTop: 48,
          display: "flex", alignItems: "center", gap: 8,
          color: "rgba(255,255,255,0.12)",
          fontSize: "0.7rem",
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>
          <div style={{ width: 24, height: 1, background: "rgba(255,255,255,0.12)" }} />
          Your selection can be updated in profile settings
          <div style={{ width: 24, height: 1, background: "rgba(255,255,255,0.12)" }} />
        </div>

      </div>
    </div>
  );
}