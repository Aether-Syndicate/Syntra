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

const NAV_LINKS = [
  { href: "/dashboard", label: "Twin OS" },
  { href: "/ingestion", label: "Calibrate Logs" },
  { href: "/goals", label: "Milestones" },
  { href: "/simulator", label: "Predictive Simulator" },
  { href: "/insights", label: "Twin Insights" },
  { href: "/profile", label: "Neural Identity" },
];

/* ── Confidence Ring ── */
function ConfidenceRing({ value }: { value: number }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  const color = value >= 70 ? "var(--success)" : value >= 40 ? "#f59e0b" : "var(--warning)";
  return (
    <div style={{ position: "relative", width: 84, height: 84, flexShrink: 0 }}>
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="42" cy="42" r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
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
        <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff", lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>{value}%</span>
        <span style={{ fontSize: "0.54rem", fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginTop: 2 }}>Accuracy</span>
      </div>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ icon: Icon, title, sub }: { icon: any; title: string; sub: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--primary-glow)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={18} style={{ color: "var(--primary)" }} />
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-main)", letterSpacing: "-0.01em", fontFamily: "'Sora', sans-serif" }}>{title}</div>
        <div style={{ fontSize: "0.68rem", color: "var(--text-sub)", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  );
}

/* ── Animated Stat Pill ── */
function StatPill({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 4, padding: "14px 18px",
      background: "var(--card-bg)", borderRadius: 16, border: "1.5px solid var(--border)",
      boxShadow: "0 4px 20px rgba(0, 85, 238, 0.015)", flex: "1 1 auto",
    }}>
      <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "var(--text-sub)", fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
      <span style={{ fontSize: "1.1rem", fontWeight: 800, color: accent, letterSpacing: "-0.02em", fontFamily: "'Sora', sans-serif" }}>{value}</span>
    </div>
  );
}

export default function InsightsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [typedTitle, setTypedTitle] = useState("");
  const [activeSection, setActiveSection] = useState(0);
  const [domainSubTab, setDomainSubTab] = useState<"health" | "finance" | "career" >("health");
  const [animating, setAnimating] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
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
      <div className="twin-os-theme" style={pageWrap}>
        <style>{css}</style>
        
        {/* ══════════════ MASTER HEADER ══════════════ */}
        <div className={`nav-wrapper ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-container">
            <a className="logo" href="/dashboard">
              SYN<strong>TRA</strong>
            </a>
            <div className="nav-links-desktop">
              {NAV_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`nav-link-item ${link.href === "/insights" ? "nav-link-active" : ""}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, height: "calc(100vh - 70px)", marginTop: "70px", overflow: "hidden", width: "100%" }}>
          <div style={splitLeft}>
            <LeftPanel activeSection={activeSection} onNav={goToSection} confidence={null} isCalibration={false} typedTitle={typedTitle} />
          </div>
          <div style={splitRight}>
            <div style={loadingBox}>
              <Loader2 size={38} style={{ color: "var(--primary)", animation: "spin 1.2s linear infinite" }} />
              <p style={loadTitle}>Generating Behavioral Intelligence…</p>
              <p style={loadSub}>Analyzing your behavioral trajectory across all domains</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (!ai) {
    return (
      <div className="twin-os-theme" style={pageWrap}>
        <style>{css}</style>

        {/* ══════════════ MASTER HEADER ══════════════ */}
        <div className={`nav-wrapper ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-container">
            <a className="logo" href="/dashboard">
              SYN<strong>TRA</strong>
            </a>
            <div className="nav-links-desktop">
              {NAV_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`nav-link-item ${link.href === "/insights" ? "nav-link-active" : ""}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, height: "calc(100vh - 70px)", marginTop: "70px", overflow: "hidden", width: "100%" }}>
          <div style={splitLeft}>
            <LeftPanel activeSection={activeSection} onNav={goToSection} confidence={null} isCalibration={false} typedTitle={typedTitle} />
          </div>
          <div style={splitRight}>
            <div style={loadingBox}>
              <ShieldAlert size={38} style={{ color: "var(--warning)" }} />
              <p style={loadTitle}>Failed to load insights.</p>
              <p style={loadSub}>Check your connection and try again.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const domainStyles = {
    health:  { color: "var(--warning)", bg: "rgba(239,68,68,0.04)", border: "rgba(239,68,68,0.15)" },
    finance: { color: "var(--success)", bg: "rgba(16,185,129,0.04)", border: "rgba(16,185,129,0.15)" },
    career:  { color: "var(--primary)", bg: "rgba(37,99,235,0.04)", border: "rgba(37,99,235,0.15)" },
  };

  /* ── Section Content ── */
  const renderSection = () => {
    switch (activeSection) {
      /* ── 0: Twin Prediction ── */
      case 0:
        return (
          <div className={`section-content ${animating ? "section-exit" : "section-enter"}`}>
            <SectionHeader icon={BrainCircuit} title="Twin Prediction" sub="Syntra AI behavioral forecast" />

            {/* Hero prediction card */}
            <div className="insight-card" style={{ marginBottom: 20 }}>
              <div className="card-stripe" style={{ background: "linear-gradient(90deg, var(--primary), var(--accent))" }} />
              <div className="card-inner" style={{ padding: "24px 28px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--primary-glow)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <TrendingUp size={20} style={{ color: "var(--primary)" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "var(--primary)", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>Behavioral Trajectory Forecast</div>
                    <p style={{ margin: 0, fontSize: "0.98rem", color: "var(--text-main)", lineHeight: 1.7, fontStyle: "italic", fontWeight: 500 }}>
                      {isCalibrationMode
                        ? "Your Twin is currently calibrating behavioral baselines. Continue logging daily patterns to unlock predictive intelligence."
                        : `"${ai.twinPrediction}"`}
                    </p>
                  </div>
                </div>
                <div style={{ height: 1.5, background: "var(--border)", marginBottom: 18 }} />
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
                  <StatPill label="AI Confidence" value={`${ai.confidence}%`} accent="var(--primary)" />
                  <StatPill label="Domains Analyzed" value="3" accent="var(--success)" />
                  <StatPill label="Risk Alerts" value={`${ai.riskAlerts?.length ?? 0}`} accent={ai.riskAlerts?.length > 0 ? "var(--warning)" : "var(--success)"} />
                </div>
              </div>
            </div>

            {/* Daily challenge */}
            <div className="insight-card challenge-gradient" style={{ border: "1.5px solid rgba(37,99,235,0.18)" }}>
              <div className="card-inner" style={{ padding: "24px 28px" }}>
                <div style={{ fontSize: "0.74rem", fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "var(--primary)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                  <Zap size={14} /> Actionable Intelligence Directive
                </div>
                <p style={{ margin: "0 0 20px", fontSize: "0.95rem", color: "var(--text-main)", lineHeight: 1.7, fontWeight: 500 }}>{ai.dailyChallenge}</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
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
              <div style={{ marginTop: 16, display: "flex", gap: 10, padding: "14px 18px", borderRadius: 16, background: "rgba(245, 158, 11, 0.05)", border: "1.5px solid rgba(245, 158, 11, 0.22)", color: "#b45309", fontSize: "0.84rem", fontWeight: 700, alignItems: "center" }}>
                <Activity size={15} style={{ animation: "pulse 2s infinite" }} />
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
              <div className="domain-detail-board">
                {/* Visual meal planner grid */}
                <div className="board-widget">
                  <div className="card-stripe" style={{ background: "var(--warning)" }} />
                  <div className="widget-header">
                    <Sparkles size={14} style={{ color: "var(--warning)" }} />
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
                  <div className="card-stripe" style={{ background: "var(--warning)" }} />
                  <div className="widget-header">
                    <Lightbulb size={14} style={{ color: "var(--warning)" }} />
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
              <div className="domain-detail-board">
                {/* Wealth roadmap card */}
                <div className="board-widget highlight-finance">
                  <div className="card-stripe" style={{ background: "var(--success)" }} />
                  <div className="widget-header">
                    <TrendingUp size={14} style={{ color: "var(--success)" }} />
                    <span>Pre-Computation Wealth Runway</span>
                  </div>
                  <div className="wealth-roadmap-container">
                    {(financeData.wealthGoals || []).length > 0 ? (
                      (financeData.wealthGoals || []).map((goal: any, gIdx: number) => (
                        <div key={gIdx} className="wealth-goal-card" style={{ marginBottom: 12 }}>
                          <div className="wealth-goal-header">
                            <span className="goal-title">{goal.goalLabel}</span>
                            <span className="goal-deficit-badge" style={{ color: goal.deficit > 0 ? "var(--warning)" : "var(--success)" }}>
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
                          <div className="deficit-status-box" style={{ background: goal.deficit > 0 ? "var(--warning-glow)" : "var(--success-glow)", marginTop: 8 }}>
                            <AlertTriangle size={14} style={{ color: goal.deficit > 0 ? "var(--warning)" : "var(--success)" }} />
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
                  <div className="card-stripe" style={{ background: "var(--success)" }} />
                  <div className="widget-header">
                    <CheckCircle2 size={14} style={{ color: "var(--success)" }} />
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
                  <div className="card-stripe" style={{ background: "var(--success)" }} />
                  <div className="widget-header">
                    <Lightbulb size={14} style={{ color: "var(--success)" }} />
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
              <div className="domain-detail-board">
                {/* Pareto Skill Matrix */}
                <div className="board-widget">
                  <div className="card-stripe" style={{ background: "var(--primary)" }} />
                  <div className="widget-header">
                    <Target size={14} style={{ color: "var(--primary)" }} />
                    <span>Pareto Upskilling Matrix (80/20 Leverage)</span>
                  </div>
                  <div className="table-responsive">
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
                </div>

                {/* Weekly Study block timeline */}
                <div className="board-widget">
                  <div className="card-stripe" style={{ background: "var(--primary)" }} />
                  <div className="widget-header">
                    <Briefcase size={14} style={{ color: "var(--primary)" }} />
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
                  <div className="card-stripe" style={{ background: "var(--primary)" }} />
                  <div className="widget-header">
                    <Lightbulb size={14} style={{ color: "var(--primary)" }} />
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
            <div className="insight-card" style={{ marginBottom: 20 }}>
              <div className="card-stripe" style={{ background: "linear-gradient(90deg, var(--primary), var(--accent))" }} />
              <div className="card-inner" style={{ padding: "24px 28px" }}>
                <div style={{ fontSize: "0.74rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "var(--primary)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                  <Sparkles size={13} /> Twin Reflection
                </div>
                <p style={{ margin: "0 0 20px", color: "var(--text-main)", lineHeight: 1.75, fontSize: "0.95rem", fontWeight: 500 }}>
                  {isCalibrationMode
                    ? "Syntra has not yet gathered enough behavioral telemetry to generate reliable predictive insights. Continue logging health, finance, and career data consistently to improve Twin accuracy."
                    : ai.dailyReflection}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRadius: 14, background: "var(--primary-glow)", border: "1.5px solid rgba(37,99,235,0.08)" }}>
                  <BrainCircuit size={17} style={{ color: "var(--primary)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.85rem", color: "var(--text-main)", lineHeight: 1.6, fontWeight: 500 }}>
                    Syntra confidence currently stands at <strong style={{ color: "var(--primary)" }}>{ai.confidence}%</strong> based on your recent behavioral telemetry.
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Alerts */}
            {!isCalibrationMode && ai.riskAlerts?.length > 0 && (
              <div className="insight-card" style={{ borderColor: "rgba(239,68,68,0.18)" }}>
                <div className="card-stripe" style={{ background: "var(--warning)" }} />
                <div className="card-inner" style={{ padding: "24px 28px" }}>
                  <div style={{ fontSize: "0.74rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "var(--warning)", marginBottom: 14, display: "flex", alignItems: "center", gap: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                    <AlertTriangle size={13} /> Active Risk Signals
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                    {ai.riskAlerts.map((alert, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 10, padding: "12px 16px", background: "var(--warning-glow)", borderRadius: 12, border: "1px solid rgba(239,68,68,0.15)" }}>
                        <ShieldAlert size={15} style={{ color: "var(--warning)", flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: "0.87rem", color: "#7f1d1d", lineHeight: 1.6, fontWeight: 500 }}>{alert}</span>
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
              <div className="card-stripe" style={{ background: "linear-gradient(90deg, var(--accent), var(--primary))" }} />
              <div className="card-inner" style={{ padding: "24px 28px" }}>
                <p style={{ fontSize: "0.86rem", color: "var(--text-sub)", lineHeight: 1.75, marginBottom: 20, fontStyle: "italic", borderLeft: "3.5px solid var(--primary)", paddingLeft: 12 }}>
                  {isCalibrationMode
                    ? "Your Twin is establishing baseline behavioral patterns. Predictive reasoning and cross-domain analysis will improve as more telemetry is collected."
                    : "Syntra analyzed your behavioral trajectory across health, finance, and career. Multi-domain correlations, consistency drift, and productivity momentum were evaluated."}
                </p>
                <div style={{ height: 1.5, background: "var(--border)", marginBottom: 18 }} />

                <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                  {ai.explainability?.length > 0 ? (
                    ai.explainability.map((item, idx) => (
                      <div
                        key={idx}
                        className="reasoning-item"
                        style={{ display: "flex", gap: 14, padding: "14px 16px", background: "var(--bg-light)", borderRadius: 16, border: "1.5px solid var(--border)", animationDelay: `${idx * 0.06}s`, alignItems: "flex-start" }}
                      >
                        <div style={{ width: 24, height: 24, borderRadius: 8, background: "var(--primary-glow)", border: "1px solid rgba(37,99,235,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.7rem", fontWeight: 800, color: "var(--primary)", fontFamily: "'JetBrains Mono', monospace" }}>
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <span style={{ fontSize: "0.88rem", color: "var(--text-main)", lineHeight: 1.65, fontWeight: 500 }}>{item}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: "0.85rem", color: "var(--text-sub)", textAlign: "center" as const, padding: "20px 0" }}>
                      Syntra requires more behavioral data for deep explainability analysis.
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 20, padding: "14px 16px", background: "var(--success-glow)", borderRadius: 14, border: "1px solid rgba(16,185,129,0.18)", display: "flex", gap: 10, alignItems: "center" }}>
                  <CheckCircle2 size={16} style={{ color: "var(--success)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.83rem", color: "var(--success)", fontWeight: 700, lineHeight: 1.5 }}>
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
    <div className="twin-os-theme" style={pageWrap}>
      <style>{css}</style>

      {/* ══════════════ MASTER HEADER ══════════════ */}
      <div className={`nav-wrapper ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <a className="logo" href="/dashboard">
            SYN<strong>TRA</strong>
          </a>
          <div className="nav-links-desktop">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link-item ${link.href === "/insights" ? "nav-link-active" : ""}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════ SPLIT WORKSPACE INTERFACE ══════════════ */}
      <div style={{ display: "flex", flex: 1, height: "calc(100vh - 70px)", marginTop: "70px", overflow: "hidden", width: "100%" }}>
        
        {/* LEFT SIDEBAR PANEL: Static Dark Telemetry Center */}
        <div style={splitLeft}>
          <LeftPanel
            activeSection={activeSection}
            onNav={goToSection}
            confidence={ai.confidence}
            isCalibration={isCalibrationMode}
            typedTitle={typedTitle}
          />
        </div>

        {/* RIGHT WORKSPACE: Content panel */}
        <div style={splitRight}>
          <div style={rightInner}>
            
            {/* Exit bar */}
            <button className="exit-bar" onClick={() => router.push("/dashboard")}>
              <ArrowLeft size={14} /> Return to Dashboard
            </button>

            {/* Title Section */}
            <div style={{ marginBottom: 28, borderBottom: "1.5px solid var(--border)", paddingBottom: "24px" }}>
              <h1 className="dynamic-title">
                <span className="title-accent">{typedTitle}</span>
                <span className="cursor" />
              </h1>
              <p className="dynamic-sub">Behavioral intelligence across health, finance, and career — decoded by your Twin.</p>
            </div>

            {/* Mobile Nav Tabs */}
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

            {/* Refresh Button */}
            <div style={{ display: "flex", justifyContent: "flex-end" as const, marginBottom: 14 }}>
              <button className="outline-btn" onClick={() => mutate()} style={{ fontSize: "0.78rem", padding: "8px 14px", height: "auto" }}>
                <RefreshCw size={12} /> Refresh Insights
              </button>
            </div>

            {/* Section Content */}
            {renderSection()}

            <div style={{ textAlign: "center" as const, marginTop: 48, fontSize: "0.76rem", color: "var(--text-sub)", fontWeight: 600 }}>
              Syntra — your health, money, and career in one view.
            </div>
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
    <div className="page-left" style={{ height: "100%", justifyContent: "flex-start", paddingTop: "40px" }}>
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
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 32 }}>
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

      {/* Confidence Ring */}
      {confidence !== null && (
        <div className="left-confidence-card" style={{ marginTop: "auto" }}>
          <ConfidenceRing value={confidence} />
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 4, flex: 1 }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>AI Confidence Score</span>
            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5, fontWeight: 500 }}>
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
  fontFamily: '"Plus Jakarta Sans","Inter",-apple-system,sans-serif',
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  overflow: "hidden"
};

const splitLeft: React.CSSProperties = {
  width: 340,
  height: "100%",
  flexShrink: 0,
};

const splitRight: React.CSSProperties = {
  flex: 1,
  background: "transparent",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "40px 48px 80px",
  height: "100%",
  overflowY: "auto",
};

const rightInner: React.CSSProperties = {
  width: "100%",
  maxWidth: 720,
};

const loadingBox: React.CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "center",
  justifyContent: "center", gap: 14, height: "100%", textAlign: "center", padding: 32,
  flex: 1
};

const loadTitle: React.CSSProperties = { fontSize: "1.05rem", fontWeight: 800, color: "var(--text-main)", margin: 0, fontFamily: "'Sora', sans-serif" };
const loadSub: React.CSSProperties = { fontSize: "0.86rem", color: "var(--text-sub)", margin: 0, fontWeight: 500 };

const css = `
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

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes blink { 50% { opacity: 0; } }
  @keyframes slideInRight { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }
  @keyframes slideOutLeft { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(-20px); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

  .twin-os-theme {
    background: radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.04) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 40%),
                #f8fafc;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  /* ── HEADER ── */
  .nav-wrapper {
    position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    background: rgba(255, 255, 255, 0.35);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }
  .nav-wrapper.scrolled {
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
  }
  .nav-container {
    max-width: 1200px; margin: 0 auto;
    display: flex; justify-content: space-between; align-items: center;
    height: 70px; padding: 0 2rem;
  }
  .logo {
    font-family: 'Sora', sans-serif; font-size: 1.45rem; font-weight: 400;
    color: var(--primary); text-decoration: none;
    letter-spacing: 0.15em; text-transform: uppercase;
  }
  .logo strong {
    font-weight: 800; letter-spacing: 0.05em;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .nav-links-desktop { display: flex; align-items: center; gap: 4px; }
  .nav-link-item {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.82rem; font-weight: 600; color: var(--text-sub);
    text-decoration: none; padding: 8px 16px; border-radius: 9999px;
    transition: all 0.25s; letter-spacing: 0.01em;
  }
  .nav-link-item:hover { color: var(--primary); background: rgba(37, 99, 235, 0.05); }
  .nav-link-active {
    background: var(--primary) !important; color: #fff !important;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
  }

  /* ── Left Panel ── */
  .page-left {
    width: 100%; height: 100%; flex-shrink: 0;
    background: linear-gradient(135deg, #0b0f19 0%, #111827 50%, #030712 100%);
    display: flex; flex-direction: column; justify-content: flex-start;
    padding: 40px; position: relative; overflow: hidden;
    border-right: 1px solid rgba(255,255,255,0.06);
  }
  .page-left::before {
    content: ''; position: absolute; top: -80px; left: -80px;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle,rgba(59, 130, 246, 0.1) 0%,transparent 70%); pointer-events: none;
  }
  .page-left::after {
    content: ''; position: absolute; bottom: -60px; right: -60px;
    width: 260px; height: 260px; border-radius: 50%;
    background: radial-gradient(circle,rgba(139, 92, 246, 0.08) 0%,transparent 70%); pointer-events: none;
  }
  .brand-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 9999px; padding: 6px 14px;
    font-size: 0.72rem; font-weight: 700; color: #60a5fa;
    letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 24px;
    font-family: 'JetBrains Mono', monospace;
    width: fit-content;
  }
  .left-title {
    font-family: 'Sora', sans-serif; font-size: 1.85rem; font-weight: 800;
    color: #fff; line-height: 1.25; letter-spacing: -0.04em; margin-bottom: 14px;
  }
  .left-title span {
    background: linear-gradient(135deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
  }
  .left-sub {
    font-size: 0.82rem; color: #94a3b8; line-height: 1.65; margin-bottom: 32px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* ── Left Nav Items ── */
  .left-nav-item {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 16px; border-radius: 14px;
    background: transparent; border: 1px solid transparent;
    cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); width: 100%; text-align: left;
  }
  .left-nav-item:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); }
  .left-nav-active { background: rgba(255,255,255,0.07) !important; border-color: rgba(255,255,255,0.12) !important; }
  .left-nav-icon {
    width: 34px; height: 34px; border-radius: 10px;
    background: rgba(255,255,255,0.06); display: flex; align-items: center;
    justify-content: center; color: rgba(255,255,255,0.5); flex-shrink: 0;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .left-nav-icon-active {
    background: linear-gradient(135deg, var(--primary), var(--accent)) !important;
    color: #fff !important;
    box-shadow: 0 0 16px rgba(37, 99, 235, 0.35) !important;
  }
  .left-nav-label { font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.45); transition: color 0.2s; font-family: 'Plus Jakarta Sans', sans-serif; }
  .left-nav-label-active { color: #fff !important; font-weight: 700 !important; }

  /* ── Confidence Card ── */
  .left-confidence-card {
    display: flex; align-items: center; gap: 16px;
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 18px 20px;
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    transition: all 0.3s ease;
  }
  .left-confidence-card:hover {
    border-color: rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.04);
  }

  /* ── Right Panel Typography ── */
  .exit-bar {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.8rem; font-weight: 700;
    color: var(--text-sub); margin-bottom: 24px; padding: 8px 16px;
    border-radius: 9999px; background: rgba(255,255,255,0.7); border: 1.5px solid var(--border);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; width: fit-content;
    box-shadow: 0 4px 12px rgba(0,0,0,0.01);
  }
  .exit-bar:hover { color: var(--primary); border-color: var(--primary); background: rgba(37, 99, 235, 0.05); transform: translateX(-3px); box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08); }
  .dynamic-title {
    font-family: 'Sora', sans-serif; font-size: clamp(1.8rem,3.5vw,2.3rem);
    font-weight: 800; color: var(--text-main); letter-spacing: -0.04em;
    margin: 0 0 6px; display: flex; align-items: center; gap: 2px;
  }
  .title-accent {
    background: linear-gradient(135deg, var(--primary), var(--accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .cursor {
    display: inline-block; width: 3px; height: 1.8rem;
    background-color: var(--primary); margin-left: 4px; animation: blink 0.7s infinite;
  }
  .dynamic-sub { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.86rem; color: var(--text-sub); line-height: 1.6; margin: 0; }

  /* ── Mobile tabs ── */
  .mobile-tabs {
    display: none; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;
  }
  .mobile-tab {
    display: flex; align-items: center; gap: 8px; padding: 10px 18px;
    border-radius: 9999px; border: 1px solid var(--border); background: rgba(255,255,255,0.7);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.8rem; font-weight: 700;
    color: var(--text-sub); cursor: pointer; transition: all 0.25s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.01);
  }
  .mobile-tab:hover { border-color: var(--primary); color: var(--primary); background: rgba(37, 99, 235, 0.05); }
  .tab-active { background: var(--primary) !important; color: #fff !important; border-color: var(--primary) !important; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.2) !important; }

  /* ── Insight Cards ── */
  .insight-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-radius: 24px; border: 1px solid rgba(0, 85, 238, 0.08);
    overflow: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 30px rgba(0, 85, 238, 0.015), 0 1px 2px rgba(0, 0, 0, 0.01);
    position: relative;
  }
  .insight-card:hover {
    transform: translateY(-2px);
    border-color: rgba(37, 99, 235, 0.18);
    box-shadow: 0 12px 40px rgba(37, 99, 235, 0.06);
  }
  .card-stripe {
    height: 4px; width: 100%; position: absolute; top: 0; left: 0;
  }
  
  .challenge-gradient {
    background: linear-gradient(135deg, rgba(37,99,235,0.02) 0%, rgba(16,185,129,0.02) 100%);
  }

  .stat-pill-hover {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .stat-pill-hover:hover {
    transform: translateY(-2px);
    border-color: rgba(37, 99, 235, 0.18) !important;
    background: rgba(255, 255, 255, 0.95) !important;
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.04) !important;
  }

  /* ── Reasoning items fade-up ── */
  .reasoning-item {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeUp 0.4s ease both;
  }
  .reasoning-item:hover {
    transform: translateY(-2px);
    border-color: rgba(37, 99, 235, 0.18) !important;
    background: rgba(255, 255, 255, 0.95) !important;
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.04);
  }

  /* ── Section animations ── */
  .section-content { animation: slideInRight 0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
  .section-exit { animation: slideOutLeft 0.28s ease forwards; }

  /* ── Buttons ── */
  .primary-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px 22px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.86rem; font-weight: 700;
    cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 18px rgba(37, 99, 235, 0.2);
    white-space: nowrap; height: 44px;
  }
  .primary-btn:hover { filter: brightness(1.06); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3); }
  
  .outline-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px 22px; border-radius: 12px;
    border: 1.5px solid var(--border); background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    color: var(--text-sub); font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.86rem; font-weight: 700; cursor: pointer; transition: all 0.2s;
    height: 44px; box-shadow: 0 4px 12px rgba(0,0,0,0.01);
  }
  .outline-btn:hover { background: #fff; border-color: var(--primary); color: var(--primary); transform: translateY(-1px); }

  /* Domain Sub-tabs & boards */
  .subtab-nav {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(0, 85, 238, 0.06);
    border-radius: 16px;
    padding: 6px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);
  }
  .subtab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 16px;
    border-radius: 12px;
    border: none;
    background: transparent;
    color: var(--text-sub);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .subtab-btn:hover {
    color: var(--primary);
    background: rgba(37, 99, 235, 0.05);
  }
  .subtab-active {
    color: #fff !important;
  }
  .subtab-active.health { background: rgba(239, 68, 68, 0.1); color: #dc2626 !important; border: 1px solid rgba(239, 68, 68, 0.2); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.05); }
  .subtab-active.finance { background: rgba(16, 185, 129, 0.1); color: #059669 !important; border: 1px solid rgba(16, 185, 129, 0.2); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.05); }
  .subtab-active.career { background: rgba(37, 99, 235, 0.1); color: var(--primary) !important; border: 1px solid rgba(37, 99, 235, 0.2); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.05); }

  .domain-detail-board {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .board-widget {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1.5px solid rgba(0, 85, 238, 0.08);
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 4px 30px rgba(0, 85, 238, 0.015), 0 1px 2px rgba(0, 0, 0, 0.01);
    text-align: left;
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .board-widget:hover {
    transform: translateY(-2px);
    border-color: rgba(37, 99, 235, 0.18);
    box-shadow: 0 12px 40px rgba(37, 99, 235, 0.06);
  }
  .board-widget.highlight-finance {
    border-left: 4px solid #10b981;
  }
  .widget-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.74rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-sub);
    margin-bottom: 20px;
    border-bottom: 1.5px solid var(--border);
    padding-bottom: 10px;
    font-family: 'JetBrains Mono', monospace;
  }
  
  /* Meal Grid */
  .meal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media(max-width: 640px) {
    .meal-grid { grid-template-columns: 1fr; }
  }
  .meal-card {
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(0, 85, 238, 0.06);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: all 0.25s ease;
  }
  .meal-card:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(239, 68, 68, 0.25);
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.05);
  }
  .meal-time {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .meal-name {
    font-weight: 800;
    font-size: 0.88rem;
    color: var(--text-main);
    font-family: 'Sora', sans-serif;
  }
  .meal-cal {
    font-size: 0.7rem;
    font-weight: 800;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.15);
    padding: 3px 10px;
    border-radius: 9999px;
    font-family: 'JetBrains Mono', monospace;
  }
  .meal-desc {
    font-size: 0.82rem;
    color: var(--text-sub);
    line-height: 1.55;
    flex: 1;
    font-weight: 500;
  }
  .meal-footer {
    display: flex;
    justify-content: space-between;
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--text-sub);
    border-top: 1px solid var(--border);
    padding-top: 8px;
    margin-top: 4px;
  }
  .meal-time-tag { color: #f97316; }
  .meal-fix-tag { color: var(--primary); }

  /* Wealth Goal Card */
  .wealth-goal-card {
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(0, 85, 238, 0.06);
    border-radius: 16px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: all 0.25s ease;
  }
  .wealth-goal-card:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(16, 185, 129, 0.25);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.05);
  }
  .wealth-goal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .goal-title {
    font-weight: 800;
    font-size: 0.95rem;
    color: var(--text-main);
    font-family: 'Sora', sans-serif;
  }
  .goal-deficit-badge {
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: 'JetBrains Mono', monospace;
  }
  .wealth-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .stat-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 14px;
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(0, 85, 238, 0.06);
    border-radius: 12px;
  }
  .stat-lbl {
    font-size: 0.64rem;
    font-weight: 700;
    color: var(--text-sub);
    text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
  }
  .stat-num {
    font-weight: 800;
    font-size: 0.98rem;
    color: var(--text-main);
    font-family: 'Sora', sans-serif;
  }
  .deficit-status-box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 14px;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 700;
  }
  .deficit-text {
    line-height: 1.45;
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
    gap: 12px;
    padding: 14px;
    background: rgba(255, 255, 255, 0.55);
    border: 1px solid rgba(0, 85, 238, 0.06);
    border-radius: 14px;
    transition: all 0.25s ease;
  }
  .checklist-item:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.85);
    border-color: rgba(16, 185, 129, 0.2);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.03);
  }
  .checklist-item.done {
    border-left: 3.5px solid #10b981;
  }
  .checklist-item input[type="checkbox"] {
    margin-top: 4px;
    cursor: pointer;
  }
  .checklist-item strong {
    font-size: 0.86rem;
    color: var(--text-main);
    display: block;
    margin-bottom: 2px;
    font-family: 'Sora', sans-serif;
  }
  .checklist-item p {
    font-size: 0.78rem;
    color: var(--text-sub);
    margin: 0;
    font-weight: 500;
  }

  /* Pareto Table */
  .pareto-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.84rem;
    text-align: left;
  }
  .table-responsive {
    overflow-x: auto;
    width: 100%;
  }
  .pareto-table th {
    padding: 12px 14px;
    font-weight: 800;
    color: var(--text-sub);
    border-bottom: 2px solid rgba(0, 85, 238, 0.08);
    text-transform: uppercase;
    font-size: 0.68rem;
    letter-spacing: 0.05em;
    font-family: 'JetBrains Mono', monospace;
  }
  .pareto-table td {
    padding: 14px;
    border-bottom: 1.5px solid rgba(0, 85, 238, 0.04);
    color: var(--text-main);
    font-weight: 500;
  }
  .priority-badge {
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
  }
  .priority-badge.high { background: #fee2e2; color: #dc2626; }
  .priority-badge.medium { background: #fef3c7; color: #d97706; }
  .source-link {
    color: var(--primary);
    font-weight: 700;
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
    padding: 14px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 14px;
    border: 1px solid rgba(0, 85, 238, 0.06);
    transition: all 0.25s ease;
  }
  .timeline-block:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(37, 99, 235, 0.2);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.04);
  }
  .block-time {
    font-size: 0.76rem;
    font-weight: 800;
    color: var(--primary);
    width: 130px;
    flex-shrink: 0;
    border-right: 1.5px solid rgba(0, 85, 238, 0.06);
    padding-right: 10px;
    display: flex;
    align-items: center;
    font-family: 'JetBrains Mono', monospace;
  }
  .block-details {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .block-day {
    font-size: 0.86rem;
    color: var(--text-main);
    font-family: 'Sora', sans-serif;
  }
  .block-focus {
    font-size: 0.78rem;
    color: var(--text-sub);
    margin: 0;
    font-weight: 500;
    line-height: 1.45;
  }

  /* Bullets for recommendations */
  .recs-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .rec-item-bullet {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 14px 16px;
    border-radius: 14px;
    font-size: 0.86rem;
    line-height: 1.6;
    font-weight: 500;
    border: 1.5px solid transparent;
    transition: all 0.25s ease;
  }
  .rec-item-bullet:hover {
    transform: translateX(4px);
  }
  .rec-item-bullet.health { background: rgba(239,68,68,0.03); border-color: rgba(239,68,68,0.1); color: #7f1d1d; }
  .rec-item-bullet.health .bullet-icon { color: var(--warning); flex-shrink: 0; margin-top: 2px; }
  .rec-item-bullet.finance { background: rgba(16,185,129,0.03); border-color: rgba(16,185,129,0.1); color: #064e3b; }
  .rec-item-bullet.finance .bullet-icon { color: var(--success); flex-shrink: 0; margin-top: 2px; }
  .rec-item-bullet.career { background: rgba(37,99,235,0.03); border-color: rgba(37,99,235,0.1); color: #1e3a8a; }
  .rec-item-bullet.career .bullet-icon { color: var(--primary); flex-shrink: 0; margin-top: 2px; }

  /* Scrollbar customizers */
  .goals-control-right::-webkit-scrollbar { width: 6px; }
  .goals-control-right::-webkit-scrollbar-track { background: transparent; }
  .goals-control-right::-webkit-scrollbar-thumb { background: rgba(37, 99, 235, 0.15); border-radius: 999px; }

  @media (max-width: 1100px) {
    .page-left { display: none; }
    .mobile-tabs { display: flex; }
  }
  @media (max-width: 600px) {
    .mobile-tab span { display: none; }
  }
`;