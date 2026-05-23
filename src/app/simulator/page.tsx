"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUp,
  Briefcase,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  HeartPulse,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Domain = "health" | "finance" | "career";

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
  riskLevel: "low" | "medium" | "high" | "critical";
  recommendedPath: string;
  confidence: number;
};

type SimulationResponse = {
  success: boolean;
  simulation: any;
  aiAnalysis: AIAnalysis;
};

export default function SimulatorPage() {
  // Prevent hydration mismatch (match GoalsPage pattern)
  const [mounted, setMounted] = useState(false);

  // Theme toggle to mirror GoalsPage theming
  const [isLight, setIsLight] = useState(false);

  // Controls
  const [domain, setDomain] = useState<Domain>("career");
  const [percentageChange, setPercentageChange] = useState(30);

  // Feedback and results
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<SimulationResponse | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const runSimulation = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          scenario: {
            domain,
            percentageChange: percentageChange / 100,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        setMessage(data.error || "Simulation failed.");
      }
    } catch (error) {
      setMessage("Twin simulation failed.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    const baseHealth = 58;
    const baseFinance = 64;
    const baseCareer = 71;

    const modifier = percentageChange;
    return [
      {
        month: "Month 1",
        health:
          domain === "health"
            ? baseHealth + modifier * 0.25
            : baseHealth - modifier * 0.08,
        finance:
          domain === "finance"
            ? baseFinance + modifier * 0.25
            : baseFinance - modifier * 0.04,
        career:
          domain === "career"
            ? baseCareer + modifier * 0.28
            : baseCareer - modifier * 0.06,
      },
      {
        month: "Month 2",
        health:
          domain === "health"
            ? baseHealth + modifier * 0.4
            : baseHealth - modifier * 0.12,
        finance:
          domain === "finance"
            ? baseFinance + modifier * 0.4
            : baseFinance - modifier * 0.08,
        career:
          domain === "career"
            ? baseCareer + modifier * 0.45
            : baseCareer - modifier * 0.1,
      },
      {
        month: "Month 3",
        health:
          domain === "health"
            ? baseHealth + modifier * 0.55
            : baseHealth - modifier * 0.14,
        finance:
          domain === "finance"
            ? baseFinance + modifier * 0.52
            : baseFinance - modifier * 0.1,
        career:
          domain === "career"
            ? baseCareer + modifier * 0.62
            : baseCareer - modifier * 0.12,
      },
      {
        month: "Month 4",
        health:
          domain === "health"
            ? baseHealth + modifier * 0.68
            : baseHealth - modifier * 0.16,
        finance:
          domain === "finance"
            ? baseFinance + modifier * 0.64
            : baseFinance - modifier * 0.12,
        career:
          domain === "career"
            ? baseCareer + modifier * 0.74
            : baseCareer - modifier * 0.14,
      },
      {
        month: "Month 5",
        health:
          domain === "health"
            ? baseHealth + modifier * 0.8
            : baseHealth - modifier * 0.18,
        finance:
          domain === "finance"
            ? baseFinance + modifier * 0.75
            : baseFinance - modifier * 0.14,
        career:
          domain === "career"
            ? baseCareer + modifier * 0.86
            : baseCareer - modifier * 0.18,
      },
      {
        month: "Month 6",
        health:
          domain === "health"
            ? baseHealth + modifier * 0.9
            : baseHealth - modifier * 0.2,
        finance:
          domain === "finance"
            ? baseFinance + modifier * 0.9
            : baseFinance - modifier * 0.16,
        career:
          domain === "career"
            ? baseCareer + modifier * 1
            : baseCareer - modifier * 0.2,
      },
    ];
  }, [domain, percentageChange]);

  const riskStyles = {
    low: {
      background: "rgba(16,185,129,0.15)",
      color: "#6ee7b7",
      border: "1px solid rgba(16,185,129,0.25)",
    },
    medium: {
      background: "rgba(245,158,11,0.15)",
      color: "#fbbf24",
      border: "1px solid rgba(245,158,11,0.25)",
    },
    high: {
      background: "rgba(239,68,68,0.15)",
      color: "#f87171",
      border: "1px solid rgba(239,68,68,0.25)",
    },
    critical: {
      background: "rgba(220,38,38,0.2)",
      color: "#ff6b6b",
      border: "1px solid rgba(220,38,38,0.35)",
    },
  } as const;

  if (!mounted) return null;

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
        .inputs-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          margin-bottom: 20px;
        }
        @media (min-width: 1024px) {
          .inputs-row {
            grid-template-columns: 2fr 1fr 1fr;
          }
        }
        .label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .input {
          width: 100%;
          background: var(--input-bg);
          border: 1px solid var(--stroke);
          border-radius: 12px;
          padding: 14px;
          color: var(--text-main);
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .input:focus {
          outline: none;
          border-color: var(--text-main);
          background: var(--input-focus);
        }
        /* Style fixes for drop-down options background and text contrast visibility */
        .input option {
          background-color: #141414;
          color: #ffffff;
        }
        .light-theme .input option {
          background-color: #ffffff;
          color: #000000;
        }
        .btn {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          border: none;
          background: var(--text-main);
          color: #000;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        .btn:hover {
          transform: translateY(-2px);
        }
        .btn:disabled {
          opacity: 0.4;
          transform: none;
          cursor: not-allowed;
        }
        .message {
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 14px;
          padding: 12px 14px;
          font-size: 0.9rem;
          margin: 18px 0 24px;
          border: 1px solid;
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
            grid-template-columns: 1.4fr .6fr;
          }
        }
        .divider {
          height: 1px;
          width: 100%;
          background: var(--stroke);
          margin: 14px 0;
        }
      ` }} />

      <div className="viewport">
        <div className="grain" />
        <div className="container">
          {/* HEADER */}
          <section className="header-card">
            <div className="tag">Syntra Predictive Engine</div>
            <h1 className="title">What-If Simulator</h1>
            <p className="subtitle">
              Simulate behavioral trade-offs across health, finance, and career. Syntra visualizes
              ripple effects and proposes an execution roadmap aligned to your optimal trajectory.
            </p>
          </section>

          {/* GLOBAL FEEDBACK MESSAGE */}
          {message && (
            <div
              className="message"
              style={{
                borderColor:
                  message.includes("failed") || message.includes("Failed")
                    ? "rgba(255,107,107,0.25)"
                    : "rgba(124,255,178,0.25)",
                background:
                  message.includes("failed") || message.includes("Failed")
                    ? "rgba(255,107,107,0.12)"
                    : "rgba(124,255,178,0.12)",
                color:
                  message.includes("failed") || message.includes("Failed")
                    ? "#ff9a9a"
                    : "#b9ffd6",
              }}
            >
              {message.includes("failed") || message.includes("Failed") ? (
                <ShieldAlert size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
              <span>{message}</span>
            </div>
          )}

          {/* CONTROLS + INSIGHT LAYOUT */}
          <section className="grid">
            {/* LEFT: Controls Card */}
            <div className="card">
              <div className="card-header">
                <div className="icon-wrap" style={{ background: "rgba(155, 140, 255, 0.18)" }}>
                  <Target color="#9B8CFF" />
                </div>
                <div>
                  <div className="card-title">Configure Scenario</div>
                  <div className="card-sub">Adjust domain and magnitude</div>
                </div>
              </div>
              <div className="inputs-row">
                <div>
                  <label className="label">Vector Domain</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value as Domain)}
                    className="input"
                    style={{ height: 50 }}
                  >
                    <option value="health">Health</option>
                    <option value="finance">Finance</option>
                    <option value="career">Career</option>
                  </select>
                </div>
                <div>
                  <label className="label">Behavioral Shift (%)</label>
                  <input
                    type="number"
                    min={-50}
                    max={50}
                    value={percentageChange}
                    onChange={(e) => setPercentageChange(Number(e.target.value))}
                    className="input"
                    style={{ height: 50 }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    className="btn"
                    disabled={loading}
                    onClick={runSimulation}
                    style={{ height: 50 }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} style={{ marginRight: 8 }} />
                        Twin Syncing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} style={{ marginRight: 8 }} />
                        Simulate Future
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick-pick domain buttons for engaging UX */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  className="btn"
                  style={{
                    width: "auto",
                    padding: "12px 14px",
                    background: domain === "health" ? "var(--text-main)" : "rgba(248,113,113,0.12)",
                    color: domain === "health" ? "#000" : "#f87171",
                    border: domain === "health" ? "none" : "1px solid rgba(248,113,113,0.35)",
                  }}
                  onClick={() => setDomain("health")}
                  type="button"
                >
                  <HeartPulse size={16} style={{ marginRight: 8 }} />
                  Increase Workout Frequency
                </button>
                <button
                  className="btn"
                  style={{
                    width: "auto",
                    padding: "12px 14px",
                    background: domain === "finance" ? "var(--text-main)" : "rgba(52,211,153,0.12)",
                    color: domain === "finance" ? "#000" : "#34d399",
                    border: domain === "finance" ? "none" : "1px solid rgba(52,211,153,0.35)",
                  }}
                  onClick={() => setDomain("finance")}
                  type="button"
                >
                  <Wallet size={16} style={{ marginRight: 8 }} />
                  Cut Food Delivery Budget
                </button>
                <button
                  className="btn"
                  style={{
                    width: "auto",
                    padding: "12px 14px",
                    background: domain === "career" ? "var(--text-main)" : "rgba(168,85,247,0.12)",
                    color: domain === "career" ? "#000" : "#a855f7",
                    border: domain === "career" ? "none" : "1px solid rgba(168,85,247,0.35)",
                  }}
                  onClick={() => setDomain("career")}
                  type="button"
                >
                  <Briefcase size={16} style={{ marginRight: 8 }} />
                  Increase Study Time
                </button>
              </div>

              {/* Range slider mirrors numeric input for playfulness */}
              <div style={{ marginTop: 18 }}>
                <label className="label">Fine-Tune Shift</label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="badge" style={{ background: "rgba(255,255,255,0.08)" }}>
                    -50%
                  </span>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={percentageChange}
                    onChange={(e) => setPercentageChange(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#9B8CFF", cursor: "pointer" }}
                  />
                  <span className="badge" style={{ background: "rgba(255,255,255,0.08)" }}>
                    +50%
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: Results Overview */}
            <div className="card">
              <div className="card-header" style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div className="icon-wrap" style={{ background: "rgba(155, 140, 255, 0.18)" }}>
                    <TrendingUp color="#9B8CFF" />
                  </div>
                  <div>
                    <div className="card-title">Predictive Outcome</div>
                    <div className="card-sub">Six-month projection</div>
                  </div>
                </div>
                {result && (
                  <div
                    className="badge"
                    style={{
                      ...riskStyles[result.aiAnalysis.riskLevel],
                      borderRadius: 999,
                    }}
                  >
                    {result.aiAnalysis.riskLevel} Risk
                  </div>
                )}
              </div>

              {/* Chart */}
              <div style={{ width: "100%", height: 360 }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="healthFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="financeFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="careerFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,.06)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,.35)" />
                    <YAxis domain={[0, 100]} stroke="rgba(255,255,255,.35)" />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0,0,0,.95)",
                        border: "1px solid var(--stroke)",
                        borderRadius: 14,
                        color: "white",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="health"
                      stroke="#34d399"
                      fill="url(#healthFill)"
                      strokeWidth={3}
                    />
                    <Area
                      type="monotone"
                      dataKey="finance"
                      stroke="#60a5fa"
                      fill="url(#financeFill)"
                      strokeWidth={3}
                    />
                    <Area
                      type="monotone"
                      dataKey="career"
                      stroke="#a855f7"
                      fill="url(#careerFill)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Scenario summary */}
              <div className="divider" />
              <div
                style={{
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid var(--stroke)",
                  borderRadius: 14,
                  padding: 16,
                  color: "rgba(255,255,255,.75)",
                  lineHeight: 1.7,
                  fontSize: ".98rem",
                }}
              >
                {result ? (
                  <>
                    <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--text-main)" }}>
                      {result.aiAnalysis.scenarioTitle}
                    </div>
                    {result.aiAnalysis.primaryOutcome}
                  </>
                ) : (
                  "Run a simulation to generate your personalized outcome narrative."
                )}
              </div>
            </div>
          </section>

          {/* TRADE-OFFS + ROADMAP GRID */}
          {result ? (
            <section className="grid" style={{ marginTop: 20 }}>
              {/* Trade-Off Matrix */}
              <div className="card">
                <div className="card-header">
                  <div className="icon-wrap" style={{ background: "rgba(155, 140, 255, 0.18)" }}>
                    <Activity color="#9B8CFF" />
                  </div>
                  <div>
                    <div className="card-title">Trade-Off Matrix</div>
                    <div className="card-sub">Cross-domain impacts</div>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                    gap: 14,
                  }}
                >
                  {result.aiAnalysis.tradeOffs.map((item, index) => {
                    const positive = item.impact === "positive";
                    const negative = item.impact === "negative";
                    return (
                      <div
                        key={index}
                        className="card"
                        style={{
                          padding: 18,
                          borderRadius: 16,
                          background: positive
                            ? "rgba(16,185,129,.08)"
                            : negative
                            ? "rgba(239,68,68,.08)"
                            : "rgba(255,255,255,.03)",
                          border: positive
                            ? "1px solid rgba(16,185,129,.3)"
                            : negative
                            ? "1px solid rgba(239,68,68,.3)"
                            : "1px solid var(--stroke)",
                          boxShadow: "0 0 20px var(--glow)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            className="badge"
                            style={{
                              background: "rgba(255,255,255,0.06)",
                              color: "var(--text-muted)",
                            }}
                          >
                            {item.domain}
                          </div>
                          {positive ? (
                            <ArrowUp color="#34d399" size={18} />
                          ) : negative ? (
                            <AlertTriangle color="#f87171" size={18} />
                          ) : (
                            <Sparkles color="#9B8CFF" size={18} />
                          )}
                        </div>
                        <div
                          style={{
                            marginTop: 12,
                            fontSize: "2.2rem",
                            fontWeight: 800,
                            letterSpacing: "0.01em",
                          }}
                        >
                          {item.magnitude}
                        </div>
                        <p
                          style={{
                            marginTop: 10,
                            color: "var(--text-muted)",
                            lineHeight: 1.7,
                            fontSize: ".92rem",
                          }}
                        >
                          {item.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Execution Roadmap */}
              <div className="card">
                <div className="card-header">
                  <div className="icon-wrap" style={{ background: "rgba(155, 140, 255, 0.18)" }}>
                    <Sparkles color="#9B8CFF" />
                  </div>
                  <div>
                    <div className="card-title">Execution Roadmap</div>
                    <div className="card-sub">Sequenced weekly initiatives</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {result.aiAnalysis.timelineProjection.map((step, index) => (
                    <div key={index} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div
                        className="badge"
                        style={{
                          background: "linear-gradient(135deg,#9AE6FF,#9B8CFF)",
                          color: "#000",
                          borderRadius: 999,
                          padding: "8px 12px",
                          fontWeight: 800,
                        }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: 6 }}>{step.week}</div>
                        <div style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
                          {step.projection}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 20,
                    borderTop: "1px solid var(--stroke)",
                    paddingTop: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: ".78rem",
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                      }}
                    >
                      Confidence
                    </span>
                    <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                      {result.aiAnalysis.confidence}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 10,
                      background: "rgba(255,255,255,.08)",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${result.aiAnalysis.confidence}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: "linear-gradient(90deg,#9AE6FF,#9B8CFF,#FF7AE6)",
                      }}
                    />
                  </div>
                  <p
                    style={{
                      marginTop: 14,
                      color: "var(--text-muted)",
                      lineHeight: 1.7,
                      fontSize: ".95rem",
                    }}
                  >
                    {result.aiAnalysis.recommendedPath}
                  </p>
                </div>
              </div>
            </section>
          ) : (
            <section className="card" style={{ marginTop: 20 }}>
              <div className="card-title">Awaiting Simulation</div>
              <p style={{ color: "var(--text-muted)", marginTop: 10, lineHeight: 1.6 }}>
                Configure your scenario and press “Simulate Future” to populate the predictive
                engine, trade-off matrix, and roadmap.
              </p>
            </section>
          )}

          {/* Footer baseline branding */}
          <div className="footer-note" style={{ marginTop: 48, textAlign: "center", fontSize: ".75rem", color: "var(--text-muted)" }}>
            Syntra: Your health, money, and career in one view.
          </div>
        </div>
      </div>
    </div>
  );
}