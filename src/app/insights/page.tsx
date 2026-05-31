"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import {
  ArrowLeft,
  BrainCircuit,
  HeartPulse,
  Wallet,
  Briefcase,
  Zap,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Loader2,
  Activity,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Target,
  BarChart3,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

/* ── Left Panel Nav Items ── */
const NAV_ITEMS = [
  { label: "Twin Prediction", icon: BrainCircuit },
  { label: "Domain Analysis", icon: BarChart3 },
  { label: "Behavioral Snapshot", icon: Activity },
  { label: "AI Reasoning Log", icon: Lightbulb },
];

/* ── Confidence Ring ── */
function ConfidenceRing({ value }: { value: number }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  const color = value >= 70 ? "#22c55e" : value >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ position: "relative", width: 84, height: 84, flexShrink: 0 }}>
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="7" />
        <circle
          cx="42" cy="42" r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 42 42)"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{value}%</span>
        <span style={{ fontSize: "0.58rem", fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 1 }}>Conf.</span>
      </div>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ icon: Icon, title, sub }: { icon: any; title: string; sub: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={18} style={{ color: "#0044DD" }} />
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: "0.97rem", color: "#0f172a", letterSpacing: "-0.01em" }}>{title}</div>
        <div style={{ fontSize: "0.73rem", color: "#94a3b8", fontWeight: 500, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{sub}</div>
      </div>
    </div>
  );
}

/* ── Animated Stat Pill ── */
function StatPill({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 3, padding: "12px 16px",
      background: "#fff", borderRadius: 14, border: "1px solid #e8ebf4",
      boxShadow: "0 2px 8px rgba(0,68,221,0.05)", flex: "1 1 auto",
    }}>
      <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#94a3b8" }}>{label}</span>
      <span style={{ fontSize: "1.05rem", fontWeight: 800, color: accent, letterSpacing: "-0.02em" }}>{value}</span>
    </div>
  );
}

export default function InsightsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [typedTitle, setTypedTitle] = useState("");
  const [activeSection, setActiveSection] = useState(0);
  const [domainSubTab, setDomainSubTab] = useState<"health" | "finance" | "career">("health");
  const [animating, setAnimating] = useState(false);
  const fullTitle = "Twin Verdict";

  useEffect(() => {
    setMounted(true);
    let currentIdx = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;
    const tick = () => {
      if (!isDeleting) {
        setTypedTitle(fullTitle.substring(0, currentIdx + 1));
        currentIdx++;
        if (currentIdx === fullTitle.length) { isDeleting = true; timeoutId = setTimeout(tick, 3500); }
        else timeoutId = setTimeout(tick, 110);
      } else {
        setTypedTitle(fullTitle.substring(0, currentIdx - 1));
        currentIdx--;
        if (currentIdx === 0) { isDeleting = false; timeoutId = setTimeout(tick, 600); }
        else timeoutId = setTimeout(tick, 50);
      }
    };
    timeoutId = setTimeout(tick, 200);
    return () => clearTimeout(timeoutId);
  }, []);

  const { data, isLoading, mutate } = useSWR<any>("/api/ai/recommend", fetcher, {
    dedupingInterval: 300000,
    revalidateOnFocus: false,
    errorRetryCount: 1,
  });

  useEffect(() => {
    const refreshInsights = () => mutate();
    window.addEventListener("syntra-refresh", refreshInsights);
    return () => window.removeEventListener("syntra-refresh", refreshInsights);
  }, [mutate]);

  const ai: AIResponse | null = data?.ai || null;
  const isCalibrationMode = (ai?.confidence || 0) <= 10;

  const goToSection = (idx: number) => {
    if (animating || idx === activeSection) return;
    setAnimating(true);
    setTimeout(() => { setActiveSection(idx); setAnimating(false); }, 280);
  };

  if (!mounted) return null;

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div style={pageWrap}>
        <style>{css}</style>
        <div style={splitLeft}>
          <LeftPanel activeSection={activeSection} onNav={goToSection} confidence={null} isCalibration={false} typedTitle={typedTitle} />
        </div>
        <div style={splitRight}>
          <div style={loadingBox}>
            <Loader2 size={34} style={{ color: "#0044DD", animation: "spin 1s linear infinite" }} />
            <p style={loadTitle}>Generating Behavioral Intelligence…</p>
            <p style={loadSub}>Analyzing your behavioral trajectory across all domains</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (!ai) {
    return (
      <div style={pageWrap}>
        <style>{css}</style>
        <div style={splitLeft}>
          <LeftPanel activeSection={activeSection} onNav={goToSection} confidence={null} isCalibration={false} typedTitle={typedTitle} />
        </div>
        <div style={splitRight}>
          <div style={loadingBox}>
            <ShieldAlert size={34} style={{ color: "#ef4444" }} />
            <p style={loadTitle}>Failed to load insights.</p>
            <p style={loadSub}>Check your connection and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const domainCards = [
    {
      title: "Health", icon: HeartPulse,
      accent: "#ef4444", accentBg: "#fee2e2",
      gradFrom: "#ef4444", gradTo: "#f97316",
      items: ai.recommendations?.health || [],
      trend: ai.recommendations?.health?.length > 0 ? "Behavioral Optimization Active" : "No active recommendations",
    },
    {
      title: "Finance", icon: Wallet,
      accent: "#16a34a", accentBg: "#dcfce7",
      gradFrom: "#16a34a", gradTo: "#059669",
      items: ai.riskAlerts?.length > 0 ? ai.riskAlerts : ai.recommendations?.finance || [],
      trend: ai.riskAlerts?.length > 0 ? "Risk Signals Detected" : "Financial Stability Maintained",
    },
    {
      title: "Career", icon: Briefcase,
      accent: "#0044DD", accentBg: "#dbeafe",
      gradFrom: "#0044DD", gradTo: "#3322EE",
      items: ai.recommendations?.career || [],
      trend: ai.recommendations?.career?.length > 0 ? "Productivity Momentum Active" : "Stable Progression",
    },
  ];

  /* ── Section Content ── */
  const renderSection = () => {
    switch (activeSection) {
      /* ── 0: Twin Prediction ── */
      case 0:
        return (
          <div className={`section-content ${animating ? "section-exit" : "section-enter"}`}>
            <SectionHeader icon={BrainCircuit} title="Twin Prediction" sub="Syntra AI behavioral forecast" />

            {/* Hero prediction card */}
            <div className="insight-card" style={{ marginBottom: 16 }}>
              <div style={{ height: 3, background: "linear-gradient(90deg,#0044DD,#3322EE,#0066FF)", borderRadius: "20px 20px 0 0" }} />
              <div style={{ padding: "22px 24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 18 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: "#eff4ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <TrendingUp size={20} style={{ color: "#0044DD" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#0044DD", marginBottom: 6 }}>Behavioral Trajectory Forecast</div>
                    <p style={{ margin: 0, fontSize: "0.95rem", color: "#0f172a", lineHeight: 1.7, fontStyle: "italic" }}>
                      {isCalibrationMode
                        ? "Your Twin is currently calibrating behavioral baselines. Continue logging daily patterns to unlock predictive intelligence."
                        : `"${ai.twinPrediction}"`}
                    </p>
                  </div>
                </div>
                <div style={{ height: 1, background: "#f1f5f9", marginBottom: 16 }} />
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
                  <StatPill label="AI Confidence" value={`${ai.confidence}%`} accent="#0044DD" />
                  <StatPill label="Domains Analyzed" value="3" accent="#16a34a" />
                  <StatPill label="Risk Alerts" value={`${ai.riskAlerts?.length ?? 0}`} accent={ai.riskAlerts?.length > 0 ? "#ef4444" : "#16a34a"} />
                </div>
              </div>
            </div>

            {/* Daily challenge */}
            <div className="insight-card" style={{ background: "linear-gradient(135deg,#eff4ff 0%,#f0fdf4 100%)", borderColor: "#c7d7fb" }}>
              <div style={{ padding: "20px 24px" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#0044DD", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  <Zap size={13} /> Actionable Intelligence Directive
                </div>
                <p style={{ margin: "0 0 18px", fontSize: "0.93rem", color: "#0f172a", lineHeight: 1.7 }}>{ai.dailyChallenge}</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
                  <button className="primary-btn" onClick={() => router.push("/ingestion")}>
                    <Zap size={14} /> Log Today's Data
                  </button>
                  <button className="outline-btn" onClick={() => router.push("/goals")}>
                    <Target size={14} /> Add to Goals
                  </button>
                </div>
              </div>
            </div>

            {/* Calibration banner */}
            {isCalibrationMode && (
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, background: "#fef9c3", border: "1px solid #fde68a", color: "#854d0e", fontSize: "0.82rem", fontWeight: 600 }}>
                <Activity size={15} />
                Calibration Mode Active — Syntra needs more behavioral telemetry to generate reliable predictions.
              </div>
            )}
          </div>
        );

      /* ── 1: Domain Analysis ── */
      case 1: {
        const healthData = data?.health || {};
        const financeData = data?.finance || {};
        const careerData = data?.career || {};

        const currentRecs = 
          domainSubTab === "health" 
            ? ai.recommendations?.health || [] 
            : domainSubTab === "finance" 
            ? ai.recommendations?.finance || [] 
            : ai.recommendations?.career || [];

        return (
          <div className={`section-content ${animating ? "section-exit" : "section-enter"}`}>
            <SectionHeader icon={BarChart3} title="Cross-Domain Ripple Analysis" sub="Dynamic systemic feedback tracking" />

            {/* Sub-tab Navigation */}
            <div className="subtab-nav">
              <button className={`subtab-btn ${domainSubTab === "health" ? "subtab-active health" : ""}`} onClick={() => setDomainSubTab("health")}>
                <HeartPulse size={14} /> Health Board
              </button>
              <button className={`subtab-btn ${domainSubTab === "finance" ? "subtab-active finance" : ""}`} onClick={() => setDomainSubTab("finance")}>
                <Wallet size={14} /> Finance Board
              </button>
              <button className={`subtab-btn ${domainSubTab === "career" ? "subtab-active career" : ""}`} onClick={() => setDomainSubTab("career")}>
                <Briefcase size={14} /> Career Board
              </button>
            </div>

            {/* Sub-tab content boards */}
            {domainSubTab === "health" && (
              <div className="domain-detail-board animate-fade-in">
                {/* Visual meal planner grid */}
                <div className="board-widget">
                  <div className="widget-header">
                    <Sparkles size={14} style={{ color: "#ef4444" }} />
                    <span>Dynamic Daily Meal Planner & Nutrients</span>
                  </div>
                  <div className="meal-grid">
                    {(healthData.todaysMealPlan || []).map((meal: any, mIdx: number) => (
                      <div key={mIdx} className="meal-card">
                        <div className="meal-time">
                          <span className="meal-name">{meal.meal}</span>
                          <span className="meal-cal">{meal.calories} kcal</span>
                        </div>
                        <div className="meal-desc">{meal.items}</div>
                        <div className="meal-footer">
                          <span className="meal-time-tag">⏱️ {meal.prepTime}</span>
                          <span className="meal-fix-tag">✨ {meal.fix}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI recommendations card */}
                <div className="board-widget">
                  <div className="widget-header">
                    <Lightbulb size={14} style={{ color: "#ef4444" }} />
                    <span>Twin Health Directives</span>
                  </div>
                  <div className="recs-list">
                    {currentRecs.map((rec: string, rIdx: number) => (
                      <div key={rIdx} className="rec-item-bullet health">
                        <CheckCircle2 size={14} className="bullet-icon" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {domainSubTab === "finance" && (
              <div className="domain-detail-board animate-fade-in">
                {/* Wealth roadmap card */}
                <div className="board-widget highlight-finance">
                  <div className="widget-header">
                    <TrendingUp size={14} style={{ color: "#10b981" }} />
                    <span>Pre-Computation Wealth Runway</span>
                  </div>
                  <div className="wealth-roadmap-container">
                    {(financeData.wealthGoals || []).length > 0 ? (
                      (financeData.wealthGoals || []).map((goal: any, gIdx: number) => (
                        <div key={gIdx} className="wealth-goal-card" style={{ marginBottom: 12 }}>
                          <div className="wealth-goal-header">
                            <span className="goal-title">{goal.goalLabel}</span>
                            <span className="goal-deficit-badge" style={{ color: goal.deficit > 0 ? "#ef4444" : "#10b981" }}>
                              {goal.deficit > 0 ? "Deficit Alert" : "On Track"}
                            </span>
                          </div>
                          <div className="wealth-stats-grid">
                            <div className="stat-box">
                              <span className="stat-lbl">Required Monthly Savings</span>
                              <span className="stat-num">Rs. {goal.requiredMonthlySavings.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="stat-box">
                              <span className="stat-lbl">Months Remaining</span>
                              <span className="stat-num">{goal.monthsRemaining} months</span>
                            </div>
                          </div>
                          <div className="deficit-status-box" style={{ background: goal.deficit > 0 ? "#fef2f2" : "#f0fdf4", marginTop: 8 }}>
                            <AlertTriangle size={14} style={{ color: goal.deficit > 0 ? "#ef4444" : "#10b981" }} />
                            <span className="deficit-text">{goal.deficitText}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="wealth-goal-card empty">
                        <span className="goal-title">No Active Wealth Goals</span>
                        <p className="deficit-text">Set up your target downpayment goals inside the Goals console to sync calculations.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Investment checklist */}
                <div className="board-widget">
                  <div className="widget-header">
                    <CheckCircle2 size={14} style={{ color: "#10b981" }} />
                    <span>Investment Portfolio Optimization</span>
                  </div>
                  <div className="portfolio-checklist">
                    <div className="checklist-item done">
                      <input type="checkbox" checked readOnly />
                      <div>
                        <strong>Broad Index Fund (Savings Rate Allocation)</strong>
                        <p>Diverting savings into low-cost index tracker weekly</p>
                      </div>
                    </div>
                    <div className="checklist-item done">
                      <input type="checkbox" checked readOnly />
                      <div>
                        <strong>Emergency Runway (3x monthly budget)</strong>
                        <p>Stable capital buffer parked inside liquid vault</p>
                      </div>
                    </div>
                    <div className="checklist-item">
                      <input type="checkbox" readOnly />
                      <div>
                        <strong>Section 80C ELSS Optimization</strong>
                        <p>Tax-efficient mutual funds lockup to optimize monthly tax burden</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="board-widget">
                  <div className="widget-header">
                    <Lightbulb size={14} style={{ color: "#10b981" }} />
                    <span>Twin Finance Directives</span>
                  </div>
                  <div className="recs-list">
                    {currentRecs.map((rec: string, rIdx: number) => (
                      <div key={rIdx} className="rec-item-bullet finance">
                        <CheckCircle2 size={14} className="bullet-icon" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {domainSubTab === "career" && (
              <div className="domain-detail-board animate-fade-in">
                {/* Pareto Skill Matrix */}
                <div className="board-widget">
                  <div className="widget-header">
                    <Target size={14} style={{ color: "#0055EE" }} />
                    <span>Pareto Upskilling Matrix (80/20 Leverage)</span>
                  </div>
                  <table className="pareto-table">
                    <thead>
                      <tr>
                        <th>High-Leverage Skill</th>
                        <th>Impact</th>
                        <th>Target Time</th>
                        <th>Curated Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(careerData.paretoSkills || []).map((skill: any, sIdx: number) => (
                        <tr key={sIdx}>
                          <td><strong>{skill.skill}</strong></td>
                          <td><span className={`priority-badge ${skill.priority.toLowerCase()}`}>{skill.priority}</span></td>
                          <td>{skill.hoursRequired}</td>
                          <td><span className="source-link">{skill.source}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Weekly Study block timeline */}
                <div className="board-widget">
                  <div className="widget-header">
                    <Briefcase size={14} style={{ color: "#0055EE" }} />
                    <span>Curated Weekly Study Blocks</span>
                  </div>
                  <div className="study-timeline">
                    {(careerData.studyBlocks || []).map((block: any, bIdx: number) => (
                      <div key={bIdx} className="timeline-block">
                        <div className="block-time">{block.time}</div>
                        <div className="block-details">
                          <strong className="block-day">{block.day}</strong>
                          <p className="block-focus">{block.focus}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="board-widget">
                  <div className="widget-header">
                    <Lightbulb size={14} style={{ color: "#0055EE" }} />
                    <span>Twin Career Directives</span>
                  </div>
                  <div className="recs-list">
                    {currentRecs.map((rec: string, rIdx: number) => (
                      <div key={rIdx} className="rec-item-bullet career">
                        <CheckCircle2 size={14} className="bullet-icon" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      /* ── 2: Behavioral Snapshot ── */
      case 2:
        return (
          <div className={`section-content ${animating ? "section-exit" : "section-enter"}`}>
            <SectionHeader icon={Activity} title="Behavioral Reflection Snapshot" sub="Live adaptive intelligence summary" />

            {/* Main reflection */}
            <div className="insight-card" style={{ marginBottom: 14 }}>
              <div style={{ height: 3, background: "linear-gradient(90deg,#0044DD,#6366f1)", borderRadius: "20px 20px 0 0" }} />
              <div style={{ padding: "22px 24px" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#0044DD", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  <Sparkles size={13} /> Twin Reflection
                </div>
                <p style={{ margin: "0 0 18px", color: "#334155", lineHeight: 1.75, fontSize: "0.93rem" }}>
                  {isCalibrationMode
                    ? "Syntra has not yet gathered enough behavioral telemetry to generate reliable predictive insights. Continue logging health, finance, and career data consistently to improve Twin accuracy."
                    : ai.dailyReflection}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, background: "#eff4ff", border: "1px solid #c7d7fb" }}>
                  <BrainCircuit size={17} style={{ color: "#0044DD", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.84rem", color: "#1e3a8a", lineHeight: 1.6 }}>
                    Syntra confidence currently stands at <strong>{ai.confidence}%</strong> based on your recent behavioral telemetry.
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Alerts */}
            {!isCalibrationMode && ai.riskAlerts?.length > 0 && (
              <div className="insight-card" style={{ borderColor: "#fecaca" }}>
                <div style={{ height: 3, background: "linear-gradient(90deg,#ef4444,#f97316)", borderRadius: "20px 20px 0 0" }} />
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#ef4444", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <AlertTriangle size={13} /> Active Risk Signals
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                    {ai.riskAlerts.map((alert, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 10, padding: "11px 14px", background: "#fef2f2", borderRadius: 10, border: "1px solid #fecaca" }}>
                        <ShieldAlert size={15} style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: "0.87rem", color: "#7f1d1d", lineHeight: 1.55 }}>{alert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      /* ── 3: AI Reasoning Log ── */
      case 3:
        return (
          <div className={`section-content ${animating ? "section-exit" : "section-enter"}`}>
            <SectionHeader icon={Lightbulb} title="AI Reasoning Log" sub="Deep explainability metrics" />

            <div className="insight-card">
              <div style={{ height: 3, background: "linear-gradient(90deg,#3322EE,#0066FF)", borderRadius: "20px 20px 0 0" }} />
              <div style={{ padding: "22px 24px" }}>
                <p style={{ fontSize: "0.84rem", color: "#64748b", lineHeight: 1.75, marginBottom: 16, fontStyle: "italic", borderLeft: "3px solid #c7d7fb", paddingLeft: 12 }}>
                  {isCalibrationMode
                    ? "Your Twin is establishing baseline behavioral patterns. Predictive reasoning and cross-domain analysis will improve as more telemetry is collected."
                    : "Syntra analyzed your behavioral trajectory across health, finance, and career. Multi-domain correlations, consistency drift, and productivity momentum were evaluated."}
                </p>
                <div style={{ height: 1, background: "#f1f5f9", marginBottom: 16 }} />

                <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                  {ai.explainability?.length > 0 ? (
                    ai.explainability.map((item, idx) => (
                      <div
                        key={idx}
                        className="reasoning-item"
                        style={{ display: "flex", gap: 12, padding: "12px 14px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e8ebf4", animationDelay: `${idx * 0.06}s` }}
                      >
                        <div style={{ width: 24, height: 24, borderRadius: 8, background: "#eff4ff", border: "1px solid #c7d7fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.68rem", fontWeight: 800, color: "#0044DD" }}>
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <span style={{ fontSize: "0.86rem", color: "#334155", lineHeight: 1.65 }}>{item}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: "0.85rem", color: "#94a3b8", textAlign: "center" as const, padding: "20px 0" }}>
                      Syntra requires more behavioral data for deep explainability analysis.
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 18, padding: "14px 16px", background: "#f0fdf4", borderRadius: 12, border: "1px solid #bbf7d0", display: "flex", gap: 10 }}>
                  <CheckCircle2 size={16} style={{ color: "#16a34a", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: "0.83rem", color: "#14532d", lineHeight: 1.55 }}>
                    Analysis complete. Twin Intelligence models updated with latest behavioral data.
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={pageWrap}>
      <style>{css}</style>

      {/* ── Left Panel ── */}
      <div style={splitLeft}>
        <LeftPanel
          activeSection={activeSection}
          onNav={goToSection}
          confidence={ai.confidence}
          isCalibration={isCalibrationMode}
          typedTitle={typedTitle}
        />
      </div>

      {/* ── Right Panel ── */}
      <div style={splitRight}>
        <div style={rightInner}>
          {/* Exit bar */}
          <button className="exit-bar" onClick={() => router.push("/dashboard")}>
            <ArrowLeft size={14} /> Return to Dashboard
          </button>

          {/* Title */}
          <div style={{ marginBottom: 22 }}>
            <h1 className="dynamic-title">
              <span className="title-accent">{typedTitle}</span>
              <span className="cursor" />
            </h1>
            <p className="dynamic-sub">Behavioral intelligence across health, finance, and career — decoded by your Twin.</p>
          </div>

          {/* Mobile nav tabs */}
          <div className="mobile-tabs">
            {NAV_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  className={`mobile-tab ${i === activeSection ? "tab-active" : ""}`}
                  onClick={() => goToSection(i)}
                >
                  <Icon size={13} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Refresh button */}
          <div style={{ display: "flex", justifyContent: "flex-end" as const, marginBottom: 14 }}>
            <button className="outline-btn" onClick={() => mutate()} style={{ fontSize: "0.78rem", padding: "7px 14px" }}>
              <RefreshCw size={12} /> Refresh Insights
            </button>
          </div>

          {/* Section content */}
          {renderSection()}

          <div style={{ textAlign: "center" as const, marginTop: 44, fontSize: "0.76rem", color: "#94a3b8" }}>
            Syntra — your health, money, and career in one view.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Left Panel Component ── */
function LeftPanel({
  activeSection,
  onNav,
  confidence,
  isCalibration,
  typedTitle,
}: {
  activeSection: number;
  onNav: (i: number) => void;
  confidence: number | null;
  isCalibration: boolean;
  typedTitle: string;
}) {
  return (
    <div className="page-left">
      <div className="brand-badge">
        <Sparkles size={11} /> Syntra AI
      </div>
      <h2 className="left-title">
        Understand your <span>behavioral</span> trajectory.
      </h2>
      <p className="left-sub">
        Your digital Twin analyzes patterns across health, finance, and career to surface predictive intelligence and hidden correlations.
      </p>

      {/* Nav items */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 32 }}>
        {NAV_ITEMS.map((item, i) => {
          const Icon = item.icon;
          const isActive = i === activeSection;
          return (
            <button
              key={i}
              className={`left-nav-item ${isActive ? "left-nav-active" : ""}`}
              onClick={() => onNav(i)}
            >
              <div className={`left-nav-icon ${isActive ? "left-nav-icon-active" : ""}`}>
                <Icon size={15} />
              </div>
              <span className={`left-nav-label ${isActive ? "left-nav-label-active" : ""}`}>{item.label}</span>
              {isActive && <ChevronRight size={13} style={{ color: "rgba(255,255,255,0.7)", marginLeft: "auto" }} />}
            </button>
          );
        })}
      </div>

      {/* Confidence ring */}
      {confidence !== null && (
        <div className="left-confidence-card">
          <ConfidenceRing value={confidence} />
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>AI Confidence Score</span>
            <span style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
              {isCalibration
                ? "Calibration in progress…"
                : confidence >= 70
                ? "High predictive accuracy"
                : confidence >= 40
                ? "Moderate accuracy"
                : "Building baseline data"}
            </span>
            {isCalibration && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4, fontSize: "0.7rem", fontWeight: 700, color: "#fde68a" }}>
                <Activity size={11} /> Calibration Mode Active
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────── Styles ────────── */
const pageWrap: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f7f8fc",
  fontFamily: '"Inter","DM Sans",-apple-system,sans-serif',
  display: "flex",
  alignItems: "stretch",
};

const splitLeft: React.CSSProperties = {
  width: 320,
  minHeight: "100vh",
  flexShrink: 0,
};

const splitRight: React.CSSProperties = {
  flex: 1,
  background: "#f7f8fc",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "40px 32px",
  minHeight: "100vh",
  overflowY: "auto",
};

const rightInner: React.CSSProperties = {
  width: "100%",
  maxWidth: 680,
};

const loadingBox: React.CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "center",
  justifyContent: "center", gap: 12, minHeight: "100vh", textAlign: "center", padding: 32,
};

const loadTitle: React.CSSProperties = { fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", margin: 0 };
const loadSub: React.CSSProperties = { fontSize: "0.86rem", color: "#64748b", margin: 0 };

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes blink { 50% { opacity: 0; } }
  @keyframes slideInRight { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
  @keyframes slideOutLeft { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(-24px); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

  /* ── Left Panel ── */
  .page-left {
    width: 100%; min-height: 100vh; flex-shrink: 0;
    background: linear-gradient(140deg,#0044DD 0%,#0066FF 55%,#3322EE 100%);
    display: flex; flex-direction: column; justify-content: center;
    padding: 48px 36px; position: relative; overflow: hidden;
  }
  .page-left::before {
    content: ''; position: absolute; top: -80px; left: -80px;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle,rgba(255,255,255,0.12) 0%,transparent 70%); pointer-events: none;
  }
  .page-left::after {
    content: ''; position: absolute; bottom: -60px; right: -60px;
    width: 260px; height: 260px; border-radius: 50%;
    background: radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 70%); pointer-events: none;
  }
  .brand-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
    border-radius: 9999px; padding: 5px 13px;
    font-size: 0.7rem; font-weight: 700; color: #fff;
    letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 24px;
  }
  .left-title {
    font-family: 'DM Sans', sans-serif; font-size: 1.85rem; font-weight: 800;
    color: #fff; line-height: 1.2; letter-spacing: -0.04em; margin-bottom: 12px;
  }
  .left-title span { color: rgba(255,255,255,0.72); font-weight: 300; }
  .left-sub {
    font-size: 0.82rem; color: rgba(255,255,255,0.65); line-height: 1.7; margin-bottom: 28px;
  }

  /* ── Left Nav Items ── */
  .left-nav-item {
    display: flex; align-items: center; gap: 11px;
    padding: 10px 14px; border-radius: 12px;
    background: transparent; border: 1px solid transparent;
    cursor: pointer; transition: all 0.2s ease; width: 100%; text-align: left;
  }
  .left-nav-item:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
  .left-nav-active { background: rgba(255,255,255,0.18) !important; border-color: rgba(255,255,255,0.35) !important; }
  .left-nav-icon {
    width: 30px; height: 30px; border-radius: 9px;
    background: rgba(255,255,255,0.15); display: flex; align-items: center;
    justify-content: center; color: rgba(255,255,255,0.7); flex-shrink: 0;
    transition: all 0.2s;
  }
  .left-nav-icon-active { background: rgba(255,255,255,0.25); color: #fff; }
  .left-nav-label { font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.6); transition: color 0.2s; }
  .left-nav-label-active { color: #fff; }

  /* ── Confidence Card ── */
  .left-confidence-card {
    display: flex; align-items: center; gap: 14px;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    border-radius: 16px; padding: 16px 18px;
  }

  /* ── Right Panel Typography ── */
  .exit-bar {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 600;
    color: #64748b; margin-bottom: 24px; padding: 7px 14px;
    border-radius: 9999px; background: #fff; border: 1px solid #e2e8f0;
    transition: all 0.2s ease; cursor: pointer; width: fit-content;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }
  .exit-bar:hover { color: #0044DD; border-color: #0044DD; background: #eff4ff; transform: translateX(-2px); }
  .dynamic-title {
    font-family: 'DM Sans', sans-serif; font-size: clamp(1.7rem,3.5vw,2.3rem);
    font-weight: 800; color: #111; letter-spacing: -0.04em;
    margin: 0 0 6px; display: flex; align-items: center; gap: 2px;
  }
  .title-accent { color: #0044DD; }
  .cursor {
    display: inline-block; width: 3px; height: 2.1rem;
    background-color: #0044DD; margin-left: 4px; animation: blink 0.7s infinite;
  }
  .dynamic-sub { font-family: 'Inter', sans-serif; font-size: 0.86rem; color: #5a5a6a; line-height: 1.6; margin: 0; }

  /* ── Mobile tabs ── */
  .mobile-tabs {
    display: none; gap: 6px; flex-wrap: wrap; margin-bottom: 16px;
  }
  .mobile-tab {
    display: flex; align-items: center; gap: 5px; padding: 6px 12px;
    border-radius: 9999px; border: 1px solid #e2e8f0; background: #fff;
    font-family: 'Inter', sans-serif; font-size: 0.75rem; font-weight: 600;
    color: #64748b; cursor: pointer; transition: all 0.18s;
  }
  .mobile-tab:hover { border-color: #0044DD; color: #0044DD; background: #eff4ff; }
  .tab-active { background: #0044DD !important; color: #fff !important; border-color: #0044DD !important; }

  /* ── Insight Cards ── */
  .insight-card {
    background: #fff; border-radius: 20px; border: 1px solid #e8ebf4;
    overflow: hidden; transition: box-shadow 0.2s, transform 0.2s;
    box-shadow: 0 2px 12px rgba(0,68,221,0.06), 0 1px 3px rgba(0,0,0,0.03);
  }
  .insight-card:hover { box-shadow: 0 6px 24px rgba(0,68,221,0.1); transform: translateY(-2px); }
  .domain-card { transition: box-shadow 0.2s, transform 0.2s; }

  /* ── Reasoning items fade-up ── */
  .reasoning-item { animation: fadeUp 0.4s ease both; }

  /* ── Section animations ── */
  .section-content { animation: slideInRight 0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
  .section-exit { animation: slideOutLeft 0.28s ease forwards; }

  /* ── Buttons ── */
  .primary-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 18px; border-radius: 11px; border: none;
    background: linear-gradient(135deg,#0044DD,#3322EE); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 0.85rem; font-weight: 600;
    cursor: pointer; transition: all 0.18s;
    box-shadow: 0 4px 14px rgba(0,68,221,0.28);
  }
  .primary-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
  .outline-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 18px; border-radius: 11px;
    border: 1px solid #cbd5e1; background: #f8fafc;
    color: #475569; font-family: 'Inter', sans-serif;
    font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.18s;
  }
  .outline-btn:hover { background: #fff; border-color: #0044DD; color: #0044DD; transform: translateY(-1px); }

  /* Domain Sub-tabs & boards */
  .subtab-nav {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    background: #0f1520;
    border-radius: 14px;
    padding: 6px;
  }
  .subtab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: #94a3b8;
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .subtab-btn:hover {
    color: #fff;
    background: rgba(255,255,255,0.05);
  }
  .subtab-active {
    color: #fff !important;
  }
  .subtab-active.health { background: #ef4444; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }
  .subtab-active.finance { background: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
  .subtab-active.career { background: #0055EE; box-shadow: 0 4px 12px rgba(0, 85, 238, 0.3); }

  .domain-detail-board {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .board-widget {
    background: #fff;
    border: 1px solid #e8ebf4;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 18px rgba(0,68,220,0.04);
    text-align: left;
  }
  .board-widget.highlight-finance {
    border-left: 4px solid #10b981;
  }
  .widget-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #475569;
    margin-bottom: 16px;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 8px;
  }
  
  /* Meal Grid */
  .meal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  @media(max-width: 640px) {
    .meal-grid { grid-template-columns: 1fr; }
  }
  .meal-card {
    background: #f8fafc;
    border: 1px solid #eef1f8;
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: transform 0.2s;
  }
  .meal-card:hover {
    transform: translateY(-2px);
    border-color: #ef4444;
  }
  .meal-time {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .meal-name {
    font-weight: 700;
    font-size: 0.86rem;
    color: #0f172a;
  }
  .meal-cal {
    font-size: 0.72rem;
    font-weight: 700;
    color: #ef4444;
    background: #fee2e2;
    padding: 2px 8px;
    border-radius: 9999px;
  }
  .meal-desc {
    font-size: 0.8rem;
    color: #475569;
    line-height: 1.5;
    flex: 1;
  }
  .meal-footer {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    font-weight: 600;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
    padding-top: 6px;
    margin-top: 4px;
  }
  .meal-time-tag { color: #f97316; }
  .meal-fix-tag { color: #0044DD; }

  /* Wealth Goal Card */
  .wealth-goal-card {
    background: #f8fafc;
    border: 1px solid #eef1f8;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .wealth-goal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .goal-title {
    font-weight: 800;
    font-size: 0.95rem;
    color: #0f172a;
  }
  .goal-deficit-badge {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .wealth-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .stat-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 12px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
  }
  .stat-lbl {
    font-size: 0.68rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
  }
  .stat-num {
    font-weight: 800;
    font-size: 0.95rem;
    color: #0f172a;
  }
  .deficit-status-box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 600;
  }
  .deficit-text {
    line-height: 1.4;
  }

  /* Portfolio Checklist */
  .portfolio-checklist {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .checklist-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px;
    background: #f8fafc;
    border: 1px solid #eef1f8;
    border-radius: 10px;
  }
  .checklist-item.done {
    border-left: 3px solid #10b981;
  }
  .checklist-item input[type="checkbox"] {
    margin-top: 4px;
    cursor: pointer;
  }
  .checklist-item strong {
    font-size: 0.84rem;
    color: #0f172a;
    display: block;
    margin-bottom: 2px;
  }
  .checklist-item p {
    font-size: 0.76rem;
    color: #64748b;
    margin: 0;
  }

  /* Pareto Table */
  .pareto-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
    text-align: left;
  }
  .pareto-table th {
    padding: 10px 12px;
    font-weight: 700;
    color: #475569;
    border-bottom: 1.5px solid #cbd5e1;
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.05em;
  }
  .pareto-table td {
    padding: 12px;
    border-bottom: 1px solid #e2e8f0;
    color: #334155;
  }
  .priority-badge {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
  }
  .priority-badge.high { background: #fee2e2; color: #dc2626; }
  .priority-badge.medium { background: #fef3c7; color: #d97706; }
  .source-link {
    color: #0055EE;
    font-weight: 600;
  }

  /* Study Timeline */
  .study-timeline {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .timeline-block {
    display: flex;
    gap: 16px;
    padding: 12px;
    background: #f8fafc;
    border-radius: 10px;
    border: 1px solid #eef1f8;
  }
  .block-time {
    font-size: 0.74rem;
    font-weight: 700;
    color: #0055EE;
    width: 130px;
    flex-shrink: 0;
    border-right: 1px solid #cbd5e1;
    padding-right: 8px;
    display: flex;
    align-items: center;
  }
  .block-details {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .block-day {
    font-size: 0.84rem;
    color: #0f172a;
  }
  .block-focus {
    font-size: 0.76rem;
    color: #64748b;
    margin: 0;
  }

  /* Bullets for recommendations */
  .recs-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .rec-item-bullet {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 0.84rem;
    line-height: 1.5;
  }
  .rec-item-bullet.health { background: #fff5f5; border: 1px solid #fee2e2; color: #991b1b; }
  .rec-item-bullet.health .bullet-icon { color: #ef4444; flex-shrink: 0; margin-top: 2px; }
  .rec-item-bullet.finance { background: #f0fdf4; border: 1px solid #dcfce7; color: #166534; }
  .rec-item-bullet.finance .bullet-icon { color: #10b981; flex-shrink: 0; margin-top: 2px; }
  .rec-item-bullet.career { background: #f0f4ff; border: 1px solid #dbeafe; color: #1e40af; }
  .rec-item-bullet.career .bullet-icon { color: #0055EE; flex-shrink: 0; margin-top: 2px; }

  @media (max-width: 860px) {
    .page-left { display: none; }
    .mobile-tabs { display: flex; }
  }
  @media (max-width: 600px) {
    .mobile-tab span { display: none; }
  }
`;