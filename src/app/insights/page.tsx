"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  BrainCircuit,
  ShieldAlert,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

interface AIResponse {
  twinPrediction: string;
  dailyReflection: string;
  explainability: string[];
  dailyChallenge: string;
  recommendations: {
    health: string[];
    finance: string[];
    career: string[];
  };
  riskAlerts: string[];
  confidence: number;
}

export default function InsightsPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ai, setAI] = useState<AIResponse | null>(null);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ai/recommend");
      const data = await res.json();
      if (data?.ai) {
        setAI(data.ai);
      }
    } catch (error) {
      console.error("Insights fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="viewport flex items-center justify-center" style={{ minHeight: "screen", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style dangerouslySetInnerHTML={{ __html: `
          body { background: #000; font-family: sans-serif; }
          .loading-text { font-size: 1.25rem; font-weight: 600; letter-spacing: 0.05em; color: #fff; text-align: center; }
        `}} />
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="loading-text"
        >
          <Loader2 className="animate-spin" style={{ margin: "0 auto 16px", color: "#9B8CFF" }} size={32} />
          Twin Intelligence Syncing...
        </motion.div>
      </div>
    );
  }

  if (!ai) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
        <div className="text-center">
          <ShieldAlert size={40} color="#ff6b6b" style={{ margin: "0 auto 16px" }} />
          <p>Failed to load insights. Please check connection.</p>
        </div>
      </div>
    );
  }

  const rippleCards = [
    {
      title: "Health",
      impact: "+6",
      status: "positive",
      text: ai.recommendations.health?.[0] || "Health systems stabilizing positively.",
    },
    {
      title: "Finance",
      impact: "-9",
      status: "negative",
      text: ai.riskAlerts?.[0] || ai.recommendations.finance?.[0] || "Financial pressure detected.",
    },
    {
      title: "Career",
      impact: "+7",
      status: "positive",
      text: ai.recommendations.career?.[0] || "Career momentum accelerating.",
    },
  ];

  return (
    <div className={isLight ? "light-theme" : ""}>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg-gradient: radial-gradient(1200px 800px at 10% -10%, rgba(255,255,255,0.06), transparent 50%), radial-gradient(1400px 900px at 110% 10%, rgba(255,255,255,0.05), transparent 55%), #000;
          --text-main: #fff;
          --text-muted: rgba(255,255,255,0.5);
          --accent-grad: linear-gradient(90deg, #9AE6FF, #9B8CFF 45%, #FF7AE6 90%);
          --glass: rgba(15, 15, 15, 0.7);
          --stroke: rgba(255, 255, 255, 0.12);
          --input-bg: rgba(255, 255, 255, 0.03);
          --input-focus: rgba(255, 255, 255, 0.08);
          --glow: rgba(154, 230, 255, 0.15);
          --success: #7CFFB2;
          --danger: #ff6b6b;
        }
        .light-theme {
          --bg-gradient: radial-gradient(1200px 800px at 10% -10%, rgba(0,0,0,0.04), transparent 50%), #fff;
          --text-main: #000;
          --text-muted: rgba(0,0,0,0.5);
          --accent-grad: linear-gradient(90deg, #005A78, #3B2D99 45%, #991682 90%);
          --glass: rgba(0, 0, 0, 0.04);
          --stroke: rgba(0, 0, 0, 0.1);
          --input-bg: rgba(0, 0, 0, 0.05);
          --input-focus: rgba(0, 0, 0, 0.08);
          --glow: rgba(0, 0, 0, 0.05);
        }
        body {
          background: #000;
          margin: 0;
          font-family: sans-serif;
          color: var(--text-main);
          overflow-x: hidden;
        }
        .viewport {
          min-height: 100vh;
          background: var(--bg-gradient);
          padding: 32px 20px 56px;
          position: relative;
        }
        .grain::after {
          content: '';
          position: fixed;
          inset: -50%;
          width: 200%;
          height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 5;
          opacity: 0.18;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 20;
        }
        .header-card {
          background: var(--glass);
          border: 1px solid var(--stroke);
          border-radius: 24px;
          padding: 36px;
          backdrop-filter: blur(24px);
          box-shadow: 0 0 40px var(--glow);
          margin-bottom: 28px;
          position: relative;
        }
        .tag {
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .title {
          font-size: 3.4rem;
          line-height: 1;
          letter-spacing: 0.04em;
          background: var(--accent-grad);
          -webkit-background-clip: text;
          color: transparent;
          margin: 6px 0 14px;
        }
        .subtitle {
          color: var(--text-muted);
          font-size: 1rem;
          max-width: 800px;
          line-height: 1.7;
        }
        .card {
          background: var(--glass);
          border: 1px solid var(--stroke);
          border-radius: 20px;
          padding: 24px;
          backdrop-filter: blur(24px);
          box-shadow: 0 0 30px var(--glow);
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }
        .icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card-title {
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--text-main);
        }
        .card-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .input option {
          background-color: #141414;
          color: #ffffff;
        }
        .light-theme .input option {
          background-color: #ffffff;
          color: #000000;
        }
        .btn {
          padding: 16px 24px;
          border-radius: 12px;
          border: none;
          background: var(--text-main);
          color: #000;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        .btn:hover {
          transform: translateY(-2px);
        }
        .btn-outline {
          background: transparent;
          border: 1px solid var(--stroke);
          color: var(--text-main);
        }
        .btn-outline:hover {
          background: rgba(255,255,255,0.05);
        }
        .badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 8px;
          text-transform: uppercase;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 1100px) {
          .grid {
            grid-template-columns: 1.3fr .7fr;
          }
        }
        .ripple-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .ripple-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .divider {
          height: 1px;
          width: 100%;
          background: var(--stroke);
          margin: 14px 0;
        }
        .progress-container {
          margin-top: 18px;
        }
        .progress-bar-wrap {
          width: 100%;
          height: 12px;
          background: rgba(255,255,255,.08);
          border-radius: 999px;
          overflow: hidden;
          margin-top: 8px;
        }
        .progress-fill {
          height: 100%;
          border-radius: 999px;
        }
      ` }} />

      <div className="viewport">
        <div className="grain" />
        <div className="container">
          
          {/* HERO HEADER */}
          <motion.section 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="header-card"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div className="tag">Syntra Twin Intelligence Verdict</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <BrainCircuit className="text-cyan-400" size={36} style={{ color: "#9AE6FF" }} />
                  <h1 className="title" style={{ margin: 0 }}>Twin Verdict</h1>
                </div>
              </div>
              <div 
                className="badge" 
                style={{ 
                  background: "rgba(16,185,129,0.15)", 
                  color: "#6ee7b7", 
                  border: "1px solid rgba(16,185,129,0.25)",
                  borderRadius: "999px",
                  padding: "8px 16px",
                  fontSize: "0.85rem"
                }}
              >
                {ai.confidence}% AI Confidence
              </div>
            </div>
            
            <p className="subtitle" style={{ marginTop: 20, fontSize: "1.15rem", color: "var(--text-main)" }}>
              {ai.twinPrediction}
            </p>
            
            <div style={{ marginTop: 16, fontSize: "0.9rem", color: "#9AE6FF", fontWeight: 500, letterSpacing: "0.02em" }}>
              ✦ {ai.dailyReflection}
            </div>
          </motion.section>

          {/* CROSS DOMAIN RIPPLE ANALYSIS */}
          <section style={{ marginBottom: 28 }}>
            <div className="card-header" style={{ marginBottom: 20 }}>
              <div className="icon-wrap" style={{ background: "rgba(155, 140, 255, 0.15)" }}>
                <Sparkles color="#9B8CFF" size={22} />
              </div>
              <div>
                <div className="card-title" style={{ fontSize: "1.5rem" }}>Cross-Domain Ripple Analysis</div>
                <div className="card-sub">Dynamic systemic feedback tracking</div>
              </div>
            </div>

            <div className="ripple-grid">
              {rippleCards.map((card, idx) => {
                const isPositive = card.status === "positive";
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="card"
                    style={{
                      background: isPositive ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
                      borderColor: isPositive ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <span className="badge" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-main)" }}>
                        {card.title}
                      </span>
                      {isPositive ? (
                        <TrendingUp color="#7CFFB2" size={20} />
                      ) : (
                        <AlertTriangle color="#ff6b6b" size={20} />
                      )}
                    </div>
                    
                    <div style={{ fontSize: "2.8rem", fontWeight: 800, color: isPositive ? "#7CFFB2" : "#ff6b6b", marginBottom: 10 }}>
                      {card.impact}
                    </div>
                    
                    <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>
                      {card.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* MAIN INSIGHT LAYOUT ROW */}
          <section className="grid">
            
            {/* LEFT SIDE: ACTIONABLE INTELLIGENCE & TRAJECTORY */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              
              {/* ACTION PANEL */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card" 
                style={{
                  background: "linear-gradient(135deg, rgba(154,230,255,0.08) 0%, rgba(155,140,255,0.05) 100%)",
                  borderColor: "rgba(154,230,255,0.2)"
                }}
              >
                <div className="card-header">
                  <div className="icon-wrap" style={{ background: "rgba(154, 230, 255, 0.15)" }}>
                    <Activity color="#9AE6FF" />
                  </div>
                  <div>
                    <div className="card-title">Actionable Intelligence Directive</div>
                    <div className="card-sub">Immediate ecosystem operations</div>
                  </div>
                </div>
                
                <p style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "var(--text-main)", marginBottom: 24 }}>
                  {ai.dailyChallenge}
                </p>
                
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button className="btn">
                    Execute Plan
                  </button>
                  <button className="btn btn-outline">
                    Add to Goals
                  </button>
                </div>
              </motion.div>

              {/* TRAJECTORY MAP */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card"
              >
                <div className="card-header">
                  <div className="icon-wrap" style={{ background: "rgba(255, 107, 107, 0.15)" }}>
                    <TrendingDown color="#ff6b6b" />
                  </div>
                  <div>
                    <div className="card-title">Current Trajectory vs AI Path</div>
                    <div className="card-sub">Optimized acceleration modeling</div>
                  </div>
                </div>

                <div className="progress-container">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "#ff6b6b", fontWeight: 600 }}>Current Baseline Trajectory</span>
                    <span style={{ color: "var(--text-muted)" }}>Goal reached in 12-16 months</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-fill" style={{ width: "35%", background: "#ff6b6b" }} />
                  </div>
                </div>

                <div className="progress-container" style={{ marginTop: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "#7CFFB2", fontWeight: 600 }}>Optimized AI Vector Path</span>
                    <span style={{ color: "var(--text-muted)" }}>4-6 months (+150% velocity)</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-fill" style={{ width: "82%", background: "linear-gradient(90deg, #9AE6FF, #7CFFB2)" }} />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT SIDE: AI REASONING LOGS */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card" 
              style={{ background: "rgba(5, 5, 5, 0.85)", borderColor: "var(--stroke)" }}
            >
              <div className="card-header">
                <div className="icon-wrap" style={{ background: "rgba(251, 191, 36, 0.15)" }}>
                  <ShieldAlert color="#fbbf24" />
                </div>
                <div>
                  <div className="card-title">AI Reasoning Log</div>
                  <div className="card-sub">Deep explainability metrics</div>
                </div>
              </div>

              <div style={{ fontFamily: "monospace", fontSize: "0.88rem", color: "#7CFFB2", lineHeight: 1.8 }}>
                <p style={{ marginBottom: 16, color: "var(--text-muted)" }}>
                  Syntra Twin Intelligence Engine analyzed your behavioral trajectory across health, finance, and career systems. Multi-domain correlations, consistency drift, and productivity momentum were evaluated to output the explainability chain below:
                </p>
                <div className="divider" />
                <ul style={{ paddingLeft: 20, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  {ai.explainability.map((item, idx) => (
                    <li key={idx} style={{ listStyleType: "square" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

          </section>

          {/* FOOTER */}
          <div style={{ marginTop: 56, textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Syntra: Your health, money, and career in one view.
          </div>

        </div>
      </div>
    </div>
  );
}