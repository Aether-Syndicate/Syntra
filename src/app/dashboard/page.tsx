"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  TrendingUp,
  Brain,
  Activity,
  AlertTriangle,
  Zap,
  TrendingDown,
  CheckCircle2,
  RefreshCw,
  Layers,
  Database,
  History,
} from "lucide-react";

type LogType = {
  domain: string;
  date: string;
  domainData?: any;
};

type GoalType = {
  _id?: string;
  title: string;
  domain: string;
  priority: string;
  targetDate?: string;
  milestones?: { text: string; completed: boolean }[];
};

type DashboardData = {
  user?: {
    name?: string;
    email?: string;
    avatarId?: number;
    personalMission?: string;
    healthConstraints?: string;
    optimizationVector?: string;
    age?: number;
  };
  syntraCore?: number;
  scorecards?: {
    health?: number;
    finance?: number;
    career?: number;
  };
  gamification?: {
    totalPoints?: number;
    currentStreak?: number;
    badges?: string[];
  };
  goals?: GoalType[];
  timeline?: LogType[];
};

function TypewriterGreeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("");
  const hour = new Date().getHours();
  let timeText = "Good Night";
  if (hour >= 5 && hour < 12) timeText = "Good Morning";
  else if (hour >= 12 && hour < 17) timeText = "Good Afternoon";
  else if (hour >= 17 && hour < 21) timeText = "Good Evening";

  const fullText = `${timeText.toUpperCase()}, ${name.toUpperCase()}`;

  useEffect(() => {
    let i = 0;
    const interval = window.setInterval(() => {
      setGreeting(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) {
        window.clearInterval(interval);
      }
    }, 50);
    return () => window.clearInterval(interval);
  }, [name, fullText]);

  return (
    <h2 className="greeting-text">
      {greeting}
      <span className="typewriter-cursor" />
    </h2>
  );
}

function TerminalLoading() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ position: "relative", width: 80, height: 80, marginBottom: 24 }}>
        <div className="pulse-ring" style={{ position: "absolute", inset: 0, border: "3px solid #3b82f6", borderRadius: "50%", animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
        <div style={{ position: "absolute", inset: 12, background: "linear-gradient(135deg, #3b82f6, #6366f1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
          <Activity size={24} style={{ color: "#fff" }} />
        </div>
      </div>
      <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>Synergizing Twin OS...</div>
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Action completion states for dynamic dashboard gamification
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [localXp, setLocalXp] = useState<number | null>(null);

  const navLinks = [
    { href: "/dashboard", label: "Twin OS" },
    { href: "/ingestion", label: "Calibrate Logs" },
    { href: "/goals", label: "Milestones" },
    { href: "/simulator", label: "Predictive Simulator" },
    { href: "/insights", label: "Twin Insights" },
    { href: "/profile", label: "Neural Identity" },
  ];

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };


  const fetchAllData = async () => {
    setSyncing(true);
    try {
      const [res, aiRes] = await Promise.all([
        fetch("/api/dashboard", { cache: "no-store", credentials: "include" }),
        fetch("/api/ai/recommend", { cache: "no-store", credentials: "include" }),
      ]);

      if (res.ok) {
        const d = await res.json();
        setData(d.dashboard);
      }
      if (aiRes.ok) {
        const ai = await aiRes.json();
        setAiData(ai.ai);
      }
    } catch (e) {
      console.error("Dashboard hydration error:", e);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    fetchAllData();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading || !data) return <TerminalLoading />;

  // Extract variables
  const name = data.user?.name || "AANA";
  const rawMission = data.user?.personalMission || "Achieve Personal Optimization";
  const mission = rawMission.replace(/^["']|["']$/g, "");
  const healthScore = data.scorecards?.health ?? 72;
  const financeScore = data.scorecards?.finance ?? 82;
  const careerScore = data.scorecards?.career ?? 88;
  const twinSync = data.syntraCore ?? 82;
  const streak = data.gamification?.currentStreak ?? 0;
  const totalPoints = data.gamification?.totalPoints ?? 0;

  // Process logs for calculations
  const logs = data.timeline || [];
  const totalLogs = Math.max(38, logs.length * 3 + streak * 5 + 14);
  const daysTracked = Math.max(12, Math.round(totalLogs / 3.4));

  const latestHealthLog = logs.find((l) => l.domain === "health")?.domainData || {};
  const currentSleep = latestHealthLog.sleepHours || 6.1;
  const currentStudy = logs.find((l) => l.domain === "career")?.domainData?.hoursStudied || 3.4;
  const currentSavingsVal = logs.find((l) => l.domain === "finance")?.domainData?.amountSaved * 30 || 24000;
  const displaySavings = currentSavingsVal.toLocaleString("en-IN");

  // Physiological Age logic
  const chronologicalAge = data.user?.age || 20;
  let physiologicalAge = chronologicalAge + 0.4;
  if (currentSleep < 6.5) {
    physiologicalAge = chronologicalAge + 2.4;
  } else if (currentSleep >= 7.5 && healthScore > 80) {
    physiologicalAge = chronologicalAge - 1.8;
  }
  const recoveryCapacityPercentile = Math.round(Math.min(99, Math.max(10, healthScore * 1.15)));

  // Twin State
  let twinState = "Stable";
  let twinStateColor = "var(--primary)";
  let twinStateBg = "rgba(37, 99, 235, 0.05)";
  if (currentSleep < 6.3) {
    twinState = "Recovery Mode";
    twinStateColor = "var(--warning)";
    twinStateBg = "var(--warning-glow)";
  } else if (streak >= 4 && healthScore >= 75 && careerScore >= 75) {
    twinState = "Accelerating";
    twinStateColor = "var(--success)";
    twinStateBg = "var(--success-glow)";
  } else if (healthScore < 60 || financeScore < 60) {
    twinState = "Drifting";
    twinStateColor = "#f59e0b";
    twinStateBg = "rgba(245, 158, 11, 0.08)";
  }

  // Goal
  const activeGoal: GoalType | null = data.goals && data.goals.length > 0 ? data.goals[0] : null;
  const goalTitle = activeGoal ? activeGoal.title : mission;

  // Days remaining calculation
  let daysRemaining = 412;
  if (activeGoal?.targetDate) {
    const target = new Date(activeGoal.targetDate);
    const diffTime = target.getTime() - new Date().getTime();
    if (diffTime > 0) {
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }

  const handleActionClick = (actionText: string) => {
    if (completedActions.includes(actionText)) return;
    setCompletedActions((prev) => [...prev, actionText]);
    setLocalXp((prev) => (prev !== null ? prev : totalPoints) + 50);
  };

  return (
    <div className="twin-os-theme">
      {/* Dynamic Styling and Typography */}
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

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background-color: var(--bg-light);
          color: var(--text-main);
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        .twin-os-theme {
          background: radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 40%),
                      radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.04) 0%, transparent 40%);
          min-height: 100vh;
          padding-bottom: 80px;
        }

        /* ── HEADER ── */
        .nav-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }
        .nav-wrapper.scrolled {
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
          padding: 0 2rem;
        }
        .logo {
          font-family: 'Sora', sans-serif;
          font-size: 1.45rem;
          font-weight: 400;
          color: var(--primary);
          text-decoration: none;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .logo strong {
          font-weight: 800;
          letter-spacing: 0.05em;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-link-item {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-sub);
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 9999px;
          transition: all 0.25s;
          letter-spacing: 0.01em;
        }
        .nav-link-item:hover {
          color: var(--primary);
          background: rgba(37, 99, 235, 0.05);
        }
        .nav-link-active {
          background: var(--primary) !important;
          color: #fff !important;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
        }
        .hamburger-btn {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          border: none;
          background: none;
        }
        .hamburger-btn span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--text-main);
          border-radius: 2px;
        }
        .mobile-menu {
          display: none;
          flex-direction: column;
          gap: 6px;
          position: absolute;
          top: 71px;
          right: 20px;
          width: 240px;
          padding: 16px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
        }
        .mobile-menu.open {
          display: flex;
        }
        .mobile-nav-link {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-sub);
          text-decoration: none;
          padding: 10px 16px;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .mobile-nav-link:hover {
          background: rgba(37, 99, 235, 0.05);
          color: var(--primary);
        }

        /* ── HERO PANEL ── */
        .hero-panel {
          padding: 110px 0 35px;
          background: linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(248,250,252,0) 100%);
        }
        .hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.95fr 1fr;
          gap: 30px;
          align-items: stretch;
        }
        .hero-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.025);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .greeting-wrap {
          margin-bottom: 14px;
        }
        .greeting-tagline {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .greeting-text {
          font-family: 'Sora', sans-serif;
          font-size: 1.65rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
          line-height: 1.25;
        }
        .typewriter-cursor {
          display: inline-block;
          width: 3px;
          height: 1em;
          background: var(--primary);
          margin-left: 5px;
          animation: blink 0.8s step-end infinite;
          vertical-align: middle;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }

        /* MISSION STATUS */
        .mission-status-box {
          background: rgba(37, 99, 235, 0.025);
          border: 1.5px solid rgba(37, 99, 235, 0.07);
          border-radius: 18px;
          padding: 16px 20px;
          margin-bottom: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .msb-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(37, 99, 235, 0.07);
          padding-bottom: 8px;
        }
        .msb-header-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--text-sub);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .msb-header-title {
          font-family: 'Sora', sans-serif;
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--primary);
        }
        .msb-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.78rem;
        }
        .msb-row-label {
          font-weight: 600;
          color: var(--text-sub);
        }
        .msb-row-val {
          font-weight: 800;
          color: var(--text-main);
        }

        .trajectory-metrics {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .trajectory-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .trajectory-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-sub);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .trajectory-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--success);
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--success);
          box-shadow: 0 0 10px var(--success);
          animation: glow 1.8s infinite ease-in-out;
        }
        @keyframes glow {
          0%, 100% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 1; }
        }

        /* Center Ring */
        .center-ring-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }
        .ring-breath-outer {
          position: relative;
          width: 165px;
          height: 165px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: scaleBreath 6s ease-in-out infinite;
        }
        @keyframes scaleBreath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .ring-svg {
          position: absolute;
          inset: 0;
          transform: rotate(-90deg);
        }
        .ring-core-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }
        .ring-core-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-sub);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .ring-core-num {
          font-family: 'Sora', sans-serif;
          font-size: 2.3rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.04em;
          line-height: 1;
          background: linear-gradient(135deg, var(--text-main), var(--primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .twin-state-pulsar {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 99px;
          margin-top: 16px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 6px;
          animation: badgePulse 2s infinite ease-in-out;
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(0.98); box-shadow: 0 0 0 0px var(--primary-glow); }
          50% { transform: scale(1.03); box-shadow: 0 0 12px 2px var(--primary-glow); }
        }

        /* TOP 3 CONSTRAINTS LIST */
        .constraint-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .constraint-pill {
          background: var(--warning-glow);
          color: var(--warning);
          font-size: 0.65rem;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 99px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .constraints-title-main {
          font-family: 'Sora', sans-serif;
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }
        .constraints-visual-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .constraint-row-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(15, 23, 42, 0.02);
          border: 1px solid rgba(15, 23, 42, 0.04);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 0.8rem;
          font-weight: 600;
          transition: transform 0.2s;
        }
        .constraint-row-item:hover {
          transform: translateX(-3px);
          background: #fff;
          border-color: rgba(239, 68, 68, 0.2);
        }
        .cri-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cri-num {
          font-family: 'JetBrains Mono', monospace;
          color: var(--warning);
          font-weight: 700;
        }
        .cri-name {
          color: var(--text-main);
        }
        .cri-impact {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          color: var(--warning);
        }

        /* ── CENTERED INTERACTIVE SCORECARDS ── */
        .centered-scorecards-container {
          max-width: 1200px;
          margin: 0 auto 40px;
          padding: 0 2rem;
          text-align: center;
        }
        .centered-scorecards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 900px;
          margin: 0 auto;
        }
        .scorecard-interactive {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 20px 24px;
          box-shadow: 0 4px 18px rgba(0, 68, 220, 0.01);
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
          color: inherit;
        }
        .scorecard-interactive:hover {
          transform: translateY(-4px);
          border-color: rgba(37, 99, 235, 0.2);
          box-shadow: 0 10px 28px rgba(37, 99, 235, 0.08);
        }
        .sc-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sc-icon-bubble {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        .scorecard-interactive:hover .sc-icon-bubble {
          transform: scale(1.08);
        }
        .sc-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-sub);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          text-align: left;
        }
        .sc-title {
          font-family: 'Sora', sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-main);
          text-align: left;
        }
        .sc-num-display {
          font-family: 'Sora', sans-serif;
          font-size: 1.9rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .sc-denom {
          font-size: 0.72rem;
          color: var(--text-sub);
          font-weight: 500;
        }

        /* ── SECTION STRUCTURING ── */
        .dashboard-body-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .widget-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.015);
        }

        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 16px;
        }
        .widget-header-title {
          font-family: 'Sora', sans-serif;
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .widget-header-icon {
          color: var(--primary);
        }
        .widget-header-badge {
          background: rgba(37, 99, 235, 0.06);
          color: var(--primary);
          font-size: 0.65rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 99px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ── CURRENT SELF VS FUTURE SELF ── */
        .trajectory-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          align-items: center;
        }
        .self-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .self-col-header {
          font-family: 'Sora', sans-serif;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-sub);
          border-bottom: 2px solid var(--border);
          padding-bottom: 8px;
        }
        .self-metric-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 14px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: transform 0.2s;
        }
        .self-metric-card:hover {
          transform: translateX(4px);
        }
        .sm-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-sub);
        }
        .sm-val {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--text-main);
        }
        .trajectory-visualizer {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.03), rgba(139, 92, 246, 0.03));
          border: 1px solid var(--border);
          border-radius: 20px;
          height: 100%;
        }
        .tv-glow-text {
          font-family: 'Sora', sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1.1;
          margin-bottom: 4px;
        }
        .tv-subtext {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-sub);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }
        .tv-outcome-box {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 10px 16px;
          text-align: center;
          width: 100%;
        }
        .tv-outcome-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-sub);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 2px;
        }
        .tv-outcome-val {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--primary);
        }

        /* ── DIGITAL TWIN REASONING ── */
        .reasoning-split {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .reasoning-block {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .rb-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-sub);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .rb-bullet {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 8px 12px;
          background: var(--bg-light);
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .rb-desc-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text-sub);
        }

        .daily-reflection-quote {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.015) 0%, rgba(139, 92, 246, 0.015) 100%);
          border: 1px solid rgba(37, 99, 235, 0.08);
          border-radius: 18px;
          padding: 22px 26px 22px 42px;
          margin-bottom: 24px;
          font-size: 0.94rem;
          font-style: italic;
          line-height: 1.6;
          color: var(--text-main);
          position: relative;
        }
        .daily-reflection-quote::before {
          content: '“';
          position: absolute;
          top: 6px;
          left: 14px;
          font-size: 3.5rem;
          color: rgba(37, 99, 235, 0.15);
          font-family: 'Sora', sans-serif;
          line-height: 1;
        }

        /* Twin Memory Timeline Console (Section 9) */
        .twin-memory-console {
          background: #ffffff;
          border: 1.5px solid var(--border);
          border-radius: 20px;
          padding: 24px;
        }
        .tm-title {
          font-family: 'Sora', sans-serif;
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tm-timeline {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          padding-left: 20px;
          border-left: 2px solid rgba(139, 92, 246, 0.15);
          margin-left: 8px;
        }
        .tm-node {
          position: relative;
        }
        .tm-node::before {
          content: '';
          position: absolute;
          left: -27px;
          top: 4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--accent);
          border: 2px solid #ffffff;
          box-shadow: 0 0 6px var(--accent);
        }
        .tm-node-time {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--accent);
          text-transform: uppercase;
        }
        .tm-node-desc {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          margin-top: 2px;
        }
        .tm-root-cause-banner {
          background: var(--warning-glow);
          border: 1px dashed rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          padding: 12px 18px;
          margin-top: 16px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--warning);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .daily-challenge-box {
          background: rgba(139, 92, 246, 0.03);
          border: 1px solid rgba(139, 92, 246, 0.12);
          border-radius: 14px;
          padding: 14px 20px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-main);
          margin-top: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .daily-challenge-box strong {
          color: var(--accent);
          text-transform: uppercase;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          background: rgba(139, 92, 246, 0.08);
          padding: 4px 10px;
          border-radius: 6px;
          white-space: nowrap;
        }

        .recomms-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 24px;
          border-top: 1px solid var(--border);
          padding-top: 24px;
        }
        .recomm-card {
          background: var(--bg-light);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .recomm-card-title {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-sub);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .recomm-card-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          list-style: none;
        }
        
        /* Interactive Actionable Feed item */
        .recomm-card-item-actionable {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: all 0.22s;
        }
        .recomm-card-item-actionable:hover {
          border-color: rgba(37, 99, 235, 0.15);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.04);
        }
        .recomm-card-item-text {
          font-size: 0.8rem;
          line-height: 1.45;
          color: var(--text-main);
          font-weight: 500;
        }
        .recomm-action-btn {
          align-self: flex-start;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary);
          background: rgba(37, 99, 235, 0.05);
          border: 1px solid rgba(37, 99, 235, 0.12);
          border-radius: 8px;
          padding: 5px 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .recomm-action-btn:hover {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
        }
        .recomm-action-btn.completed {
          background: var(--success-glow);
          color: var(--success);
          border-color: rgba(16, 185, 129, 0.2);
          cursor: not-allowed;
        }

        /* ── SECTION 6: ANATOMICAL TWIN ── */
        .anatomical-grid {
          display: grid;
          grid-template-columns: 1.1fr 1.05fr;
          gap: 30px;
          align-items: center;
        }
        .silhouette-visualizer {
          display: flex;
          justify-content: center;
          align-items: center;
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          height: 290px;
          position: relative;
        }
        .silhouette-svg {
          height: 100%;
          filter: drop-shadow(0 4px 12px rgba(37,99,235,0.06));
        }
        .silhouette-svg path {
          transition: all 0.3s ease;
        }
        .silhouette-svg path:hover {
          fill: var(--primary-glow);
          stroke: var(--primary);
          stroke-width: 1.5px;
          filter: drop-shadow(0 0 8px rgba(37,99,235,0.5));
        }
        .biometrics-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .biometric-bar-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 14px 18px;
        }
        .bbc-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 6px;
        }
        .bbc-bar-track {
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          overflow: hidden;
        }
        .bbc-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          border-radius: 3px;
        }

        .physiological-comparison-card {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.015) 0%, rgba(37, 99, 235, 0.015) 100%);
          border: 1.5px solid rgba(16, 185, 129, 0.15);
          border-radius: 18px;
          padding: 16px 20px;
          margin-top: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pcc-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .pcc-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-sub);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .pcc-val {
          font-family: 'Sora', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--success);
        }

        /* ── SECTION 7: FINANCIAL TWIN ── */
        .financial-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 30px;
        }
        .finance-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .finance-stat-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 105px;
        }
        .fsc-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-sub);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .fsc-val {
          font-family: 'Sora', sans-serif;
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--text-main);
          margin-top: 4px;
        }
        .finance-projection-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 20px;
          justify-content: center;
        }
        .fpc-title {
          font-family: 'Sora', sans-serif;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-sub);
          border-bottom: 1px solid var(--border);
          padding-bottom: 8px;
          margin-bottom: 4px;
        }
        .fpc-trajectory-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-sub);
          padding: 4px 0;
        }
        .fpc-trajectory-val {
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.78rem;
        }

        /* ── SECTION 8: BEHAVIORAL TWIN & EXPLAINABILITY ── */
        .behavioral-grid-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .behavioral-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .behavior-scorecard {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          transition: transform 0.2s;
        }
        .behavior-scorecard:hover {
          transform: translateY(-2px);
        }
        .bsc-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-sub);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 8px;
        }
        .bsc-num {
          font-family: 'Sora', sans-serif;
          font-size: 2.1rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
        }
        .bsc-desc {
          font-size: 0.72rem;
          color: var(--text-sub);
          margin-top: 6px;
          font-weight: 600;
        }

        .explainability-accuracy-card {
          background: #ffffff;
          border: 1.5px solid var(--border);
          border-radius: 20px;
          padding: 22px 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }
        .eac-left {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .eac-badge {
          background: rgba(139, 92, 246, 0.08);
          color: var(--accent);
          font-size: 0.65rem;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 99px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          max-width: fit-content;
        }
        .eac-title {
          font-family: 'Sora', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.01em;
        }
        .eac-desc {
          font-size: 0.85rem;
          line-height: 1.5;
          color: var(--text-sub);
        }
        .eac-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          min-width: 320px;
        }
        .eac-metric-box {
          background: var(--bg-light);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 10px 14px;
          text-align: center;
        }
        .emb-num {
          font-family: 'Sora', sans-serif;
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--primary);
        }
        .emb-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-sub);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        /* ── MISSION CONTROL & VELOCITY ── */
        .mission-control-box {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 40px;
          align-items: center;
        }
        .mc-left {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .mc-mission-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }
        .mc-mission-title {
          font-family: 'Sora', sans-serif;
          font-size: 1.65rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
          line-height: 1.25;
        }
        .mc-progress-section {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px 20px;
        }
        .mc-progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 8px;
        }
        .mc-progress-track {
          height: 8px;
          background: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
        }
        .mc-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          border-radius: 4px;
        }

        .mission-velocity-console {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mvc-row-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
        }
        .mvc-label {
          font-weight: 600;
          color: var(--text-sub);
        }
        .mvc-val {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          color: var(--primary);
        }
        .mvc-pace-box {
          background: var(--primary-glow);
          border-left: 3.5px solid var(--primary);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--primary);
          margin-top: 6px;
          display: flex;
          justify-content: space-between;
        }

        .mc-milestones-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mc-milestone-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 10px;
          border-radius: 10px;
          transition: background 0.2s;
        }
        .mc-milestone-row:hover {
          background: var(--bg-light);
        }
        .mc-milestone-bullet {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
        }
        .mc-milestone-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .mc-milestone-text.completed {
          color: var(--text-sub);
          text-decoration: line-through;
          opacity: 0.7;
        }

        .sync-refresh-wrap {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .sync-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--primary);
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 99px;
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.025);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .sync-btn:hover {
          background: var(--primary);
          color: #fff;
          border-color: var(--primary);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.15);
        }
        .sync-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .spin {
          animation: rotate 1s linear infinite;
        }
        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr; gap: 20px; }
          .centered-scorecards-grid { grid-template-columns: 1fr; max-width: 100%; }
          .trajectory-grid { grid-template-columns: 1fr; }
          .reasoning-split { grid-template-columns: 1fr; }
          .ripple-grid { grid-template-columns: 1fr; }
          .anatomical-grid { grid-template-columns: 1fr; }
          .financial-grid { grid-template-columns: 1fr; }
          .behavioral-grid { grid-template-columns: repeat(2, 1fr); }
          .mission-control-box { grid-template-columns: 1fr; gap: 20px; }
          .nav-links-desktop { display: none; }
          .hamburger-btn { display: flex; }
          .explainability-accuracy-card { flex-direction: column; align-items: stretch; gap: 20px; }
          .eac-metrics-grid { min-width: 100%; }
        }
        @media (max-width: 640px) {
          .behavioral-grid { grid-template-columns: 1fr; }
.eac-metrics-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── TOP NAV BAR ── */}
      <div className={`nav-wrapper${scrolled ? " scrolled" : ""}`}>
        <div className="nav-container">
          <Link href="/" className="logo">syn<strong>tra</strong></Link>
          <nav className="nav-links-desktop">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className={`nav-link-item${l.href === "/dashboard" ? " nav-link-active" : ""}`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <button className="hamburger-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            <span /><span style={{ margin: "4px 0" }} /><span />
          </button>
        </div>
        <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── SECTION 1: HERO PANEL (Combined with Mission Status, Sync & State, Top 3 Constraints) ── */}
      <section className="hero-panel">
        <div className="hero-inner">
          <div className="hero-grid">

            {/* Left Block: Mission Status & Greeting */}
            <div className="hero-card">
              <div className="greeting-wrap">
                <div className="greeting-tagline">Syntra Digital Twin OS</div>
                <TypewriterGreeting name={name} />
              </div>

              {/* MISSION STATUS */}
              <div className="mission-status-box">
                <div className="msb-header">
                  <span className="msb-header-label">Mission Status</span>
                  <span className="msb-header-title">{goalTitle}</span>
                </div>
                <div className="msb-row">
                  <span className="msb-row-label">Trajectory Alignment</span>
                  <span className="msb-row-val" style={{ color: "var(--primary)" }}>
                    {aiData?.confidence != null ? `${aiData.confidence}% Aligned` : `${twinSync}% Aligned`}
                  </span>
                </div>
                <div className="msb-row">
                  <span className="msb-row-label">Days Remaining</span>
                  <span className="msb-row-val">{daysRemaining} Days</span>
                </div>
                <div className="msb-row">
                  <span className="msb-row-label">Lead Indicator</span>
                  <span className="msb-row-val" style={{ color: "var(--success)" }}>
                    {aiData?.leadIndicator || "—"}
                  </span>
                </div>
                <div className="msb-row">
                  <span className="msb-row-label">Primary Risk</span>
                  <span className="msb-row-val" style={{ color: "var(--warning)" }}>
                    {aiData?.primaryRisk || "—"}
                  </span>
                </div>
              </div>

              <div className="trajectory-metrics">
                <div className="trajectory-item">
                  <span className="trajectory-label">Status</span>
                  <span className="trajectory-badge">
                    <span className="pulse-dot" />ON TRACK
                  </span>
                </div>
                <div className="trajectory-item">
                  <span className="trajectory-label">Confidence</span>
                  <span className="trajectory-badge" style={{ color: "var(--accent)" }}>
                    {aiData?.confidence || 84}%
                  </span>
                </div>
              </div>
            </div>

            {/* Center Block: Twin Sync Ring & Dynamic Twin States */}
            <div className="hero-card">
              <div className="center-ring-wrap">
                <div className="ring-breath-outer">
                  <svg className="ring-svg" viewBox="0 0 100 100">
                    {/* Background track circle */}
                    <circle cx="50" cy="50" r="44" stroke="#f1f5f9" strokeWidth="6.5" fill="none" />
                    {/* Animated dynamic circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      stroke="url(#syncGlow)"
                      strokeWidth="6.5"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 44}`}
                      strokeDashoffset={`${2 * Math.PI * 44 * (1 - twinSync / 100)}`}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 1s ease" }}
                    />
                    <defs>
                      <linearGradient id="syncGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="ring-core-info">
                    <span className="ring-core-label">Twin Sync</span>
                    <span className="ring-core-num">{twinSync}%</span>
                    <span className="ring-core-pct">Live Synthesis</span>
                  </div>
                </div>

                {/* TWIN STATE Pulse Badge */}
                <div
                  className="twin-state-pulsar"
                  style={{
                    background: twinStateBg,
                    color: twinStateColor,
                    border: `1.5px solid ${twinStateColor}`
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: twinStateColor
                    }}
                  />
                  Twin State: {twinState}
                </div>
              </div>
            </div>

            {/* Right Block: TOP 3 CONSTRAINTS Engine */}
            <div className="hero-card" style={{ borderColor: "rgba(239, 68, 68, 0.15)", background: "rgba(255, 255, 255, 0.95)" }}>
              <div>
                <div className="constraint-top">
                  <span className="constraint-pill">
                    <AlertTriangle size={11} />Analytical Engine
                  </span>
                </div>
                <h3 className="constraints-title-main">Top 3 Constraints</h3>

                <div className="constraints-visual-list">

                  <div className="constraint-row-item">
                    <div className="cri-left">
                      <span className="cri-num">1.</span>
                      <span className="cri-name">Sleep Consistency</span>
                    </div>
                    <span className="cri-impact">-18%</span>
                  </div>

                  <div className="constraint-row-item">
                    <div className="cri-left">
                      <span className="cri-num">2.</span>
                      <span className="cri-name">Focus Variability</span>
                    </div>
                    <span className="cri-impact">-11%</span>
                  </div>

                  <div className="constraint-row-item">
                    <div className="cri-left">
                      <span className="cri-num">3.</span>
                      <span className="cri-name">Financial Leakage</span>
                    </div>
                    <span className="cri-impact">-7%</span>
                  </div>

                </div>
              </div>
              <div className="constraint-meta" style={{ borderTop: "1px solid rgba(239, 68, 68, 0.08)", paddingTop: "10px", marginTop: "12px" }}>
                <span style={{ color: "var(--warning)" }}>DIAGNOSTIC ACTIVE</span>
                <span style={{ color: "var(--text-sub)" }}>CALIBRATED</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CENTERED INTERACTIVE SCORECARDS ── */}
      <div className="centered-scorecards-container">
        <div className="centered-scorecards-grid">

          {/* Health Scorecard */}
          <div className="scorecard-interactive" onClick={() => handleScrollTo("anatomical-twin")}>
            <div className="sc-left">
              <div className="sc-icon-bubble" style={{ background: "rgba(16, 185, 129, 0.08)", color: "var(--success)" }}>
                <Heart size={20} />
              </div>
              <div>
                <div className="sc-label">Health Score</div>
                <div className="sc-title">Anatomical Twin</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className="sc-num-display" style={{ color: "var(--success)" }}>{healthScore}</span>
              <span className="sc-denom">/100</span>
            </div>
          </div>

          {/* Finance Scorecard */}
          <div className="scorecard-interactive" onClick={() => handleScrollTo("financial-twin")}>
            <div className="sc-left">
              <div className="sc-icon-bubble" style={{ background: "rgba(37, 99, 235, 0.08)", color: "var(--primary)" }}>
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="sc-label">Finance Score</div>
                <div className="sc-title">Financial Twin</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className="sc-num-display" style={{ color: "var(--primary)" }}>{financeScore}</span>
              <span className="sc-denom">/100</span>
            </div>
          </div>

          {/* Career Scorecard */}
          <div className="scorecard-interactive" onClick={() => handleScrollTo("behavioral-twin")}>
            <div className="sc-left">
              <div className="sc-icon-bubble" style={{ background: "rgba(139, 92, 246, 0.08)", color: "var(--accent)" }}>
                <Brain size={20} />
              </div>
              <div>
                <div className="sc-label">Career Score</div>
                <div className="sc-title">Behavioral Twin</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className="sc-num-display" style={{ color: "var(--accent)" }}>{careerScore}</span>
              <span className="sc-denom">/100</span>
            </div>
          </div>

        </div>

        {/* Sync Manual Trigger */}
        <div className="sync-refresh-wrap">
          <button className="sync-btn" onClick={fetchAllData} disabled={syncing}>
            <RefreshCw size={12} className={syncing ? "spin" : ""} />
            {syncing ? "Syncing..." : "Manual Calibrate Sync"}
          </button>
        </div>
      </div>

      {/* ── MAIN DASHBOARD CONTAINER ── */}
      <div className="dashboard-body-container">

        {/* SECTION 2: CURRENT SELF VS FUTURE SELF */}
        <div className="widget-card">
          <div className="widget-header">
            <h3 className="widget-header-title">
              <Layers className="widget-header-icon" size={18} />Current Self vs Future Self
            </h3>
            <span className="widget-header-badge">Aspirational Projection</span>
          </div>

          <div className="trajectory-grid">

            {/* Today Column */}
            <div className="self-col">
              <div className="self-col-header">Today</div>

              <div className="self-metric-card">
                <span className="sm-name">Daily Sleep</span>
                <span className="sm-val" style={{ color: "var(--warning)" }}>{currentSleep}h</span>
              </div>
              <div className="self-metric-card">
                <span className="sm-name">Savings</span>
                <span className="sm-val">₹{displaySavings}</span>
              </div>
              <div className="self-metric-card">
                <span className="sm-name">Study Time</span>
                <span className="sm-val">{currentStudy}h/day</span>
              </div>
              <div className="self-metric-card">
                <span className="sm-name">Health Score</span>
                <span className="sm-val" style={{ color: "var(--success)" }}>{healthScore}</span>
              </div>
              <div className="self-metric-card">
                <span className="sm-name">Career Score</span>
                <span className="sm-val" style={{ color: "var(--accent)" }}>{careerScore}</span>
              </div>
            </div>

            {/* Future Projection Column */}
            <div className="self-col">
              <div className="self-col-header">12-Month Projection</div>

              <div className="self-metric-card">
                <span className="sm-name">Target Sleep</span>
                <span className="sm-val" style={{ color: "var(--success)" }}>7.6h</span>
              </div>
              <div className="self-metric-card">
                <span className="sm-name">Projected Savings</span>
                <span className="sm-val" style={{ color: "var(--primary)" }}>₹1.1L</span>
              </div>
              <div className="self-metric-card">
                <span className="sm-name">Projected Study</span>
                <span className="sm-val" style={{ color: "var(--accent)" }}>5.2h/day</span>
              </div>
              <div className="self-metric-card">
                <span className="sm-name">Projected Health</span>
                <span className="sm-val" style={{ color: "var(--success)" }}>88</span>
              </div>
              <div className="self-metric-card">
                <span className="sm-name">Projected Career</span>
                <span className="sm-val" style={{ color: "var(--accent)" }}>94</span>
              </div>
            </div>

            {/* Visualizer Column */}
            <div className="trajectory-visualizer">
              <div className="tv-glow-text">{twinSync}%</div>
              <div className="tv-subtext">{activeGoal ? `${activeGoal.title} Readiness` : "Digital Twin Synchronization"}</div>
              <div className="tv-outcome-box">
                <div className="tv-outcome-label">Projected Outcome</div>
                <div className="tv-outcome-val">Career Acceleration Likely in 4-6 months</div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 4: DIGITAL TWIN REASONING & GUIDANCE FEED WITH ACTION BUTTONS */}
        <div className="widget-card">
          <div className="widget-header">
            <h3 className="widget-header-title">
              <Brain className="widget-header-icon" size={18} />Digital Twin Reasoning & Guidance
            </h3>
            <span className="widget-header-badge">AI Calibration Console</span>
          </div>

          {/* Daily Reflection Quote */}
          <div className="daily-reflection-quote">
            <p>
              "{aiData?.dailyReflection || `You are actively navigating towards your personal mission "${mission}". Your twin is monitoring metabolic patterns and study consistency to keep you optimized.`}"
            </p>
          </div>

          <div className="reasoning-split">
            {/* Detected */}
            <div className="reasoning-block" style={{ borderLeft: "3px solid var(--warning)" }}>
              <div className="rb-label" style={{ color: "var(--warning)" }}>
                <Activity size={12} />Detected Patterns
              </div>
              {aiData?.explainability && aiData.explainability.length > 0 ? (
                aiData.explainability.map((exp: string, idx: number) => (
                  <div key={idx} className="rb-bullet" style={{ fontSize: "0.76rem", lineHeight: "1.4" }}>
                    <span>{exp}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="rb-bullet">
                    <span>Sleep Deficit</span>
                    <span style={{ color: "var(--warning)" }}>↓ 11%</span>
                  </div>
                  <div className="rb-bullet">
                    <span>Focus Duration</span>
                    <span style={{ color: "var(--warning)" }}>↓ 8%</span>
                  </div>
                  <div className="rb-bullet">
                    <span>Cortisol Load</span>
                    <span style={{ color: "var(--warning)" }}>↑ 15%</span>
                  </div>
                </>
              )}
            </div>

            {/* Result */}
            <div className="reasoning-block" style={{ borderLeft: "3px solid var(--accent)" }}>
              <div className="rb-label" style={{ color: "var(--accent)" }}>
                <TrendingDown size={12} />Projected Result
              </div>
              <p className="rb-desc-text" style={{ fontStyle: "italic", marginTop: 4 }}>
                {aiData?.twinPrediction || `"Career study block productivity is projected to decline by 6% within 14 days due to sleep-debt cognitive limits."`}
              </p>
            </div>

            {/* Recommended Intervention */}
            <div className="reasoning-block" style={{ borderLeft: "3px solid var(--success)" }}>
              <div className="rb-label" style={{ color: "var(--success)" }}>
                <CheckCircle2 size={12} />Twin Intervention
              </div>
              <p className="rb-desc-text" style={{ fontWeight: 600, color: "var(--text-main)", marginTop: 4 }}>
                {aiData?.recommendations?.health?.[0] || "Increase sleep to 7.8 hours+ for 5 consecutive days to restore metabolic and synaptic baseline."}
              </p>
            </div>
          </div>

          {/* Daily Challenge with Actionable completion */}
          <div className="daily-challenge-box">
            <strong>Daily Challenge</strong>
            <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{aiData?.dailyChallenge || "Log all three domains today to expand your Twin Sync calibration index."}</span>
              <button
                className={`recomm-action-btn ${completedActions.includes(aiData?.dailyChallenge || "log-all") ? "completed" : ""}`}
                onClick={() => handleActionClick(aiData?.dailyChallenge || "log-all")}
                disabled={completedActions.includes(aiData?.dailyChallenge || "log-all")}
              >
                {completedActions.includes(aiData?.dailyChallenge || "log-all") ? "✓ Calibrated (+50 XP)" : "Calibrate"}
              </button>
            </div>
          </div>

          {/* Actionable AI Recommendations Roadmap */}
          <div className="recomms-grid">

            {/* Health Recs */}
            <div className="recomm-card" style={{ borderTop: "3px solid var(--success)" }}>
              <div className="recomm-card-title" style={{ color: "var(--success)" }}>
                <Heart size={13} />Health Recommendations
              </div>
              <ul className="recomm-card-list">
                {(aiData?.recommendations?.health || [
                  "Aim for 7.5h+ sleep tonight",
                  "Eat high protein meal post workout",
                  "Stay hydrated during intense study blocks"
                ]).map((rec: string, idx: number) => (
                  <li key={idx} className="recomm-card-item-actionable">
                    <span className="recomm-card-item-text">{rec}</span>
                    <button
                      className={`recomm-action-btn ${completedActions.includes(rec) ? "completed" : ""}`}
                      onClick={() => handleActionClick(rec)}
                      disabled={completedActions.includes(rec)}
                    >
                      {completedActions.includes(rec) ? "✓ Done (+50 XP)" : "Mark Complete"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Finance Recs */}
            <div className="recomm-card" style={{ borderTop: "3px solid var(--primary)" }}>
              <div className="recomm-card-title" style={{ color: "var(--primary)" }}>
                <TrendingUp size={13} />Finance Recommendations
              </div>
              <ul className="recomm-card-list">
                {(aiData?.recommendations?.finance || [
                  "Cap impulse Swiggy spend under ₹300",
                  "Save ₹500 today to cover budget drift",
                  "Review subscription expenses this week"
                ]).map((rec: string, idx: number) => (
                  <li key={idx} className="recomm-card-item-actionable">
                    <span className="recomm-card-item-text">{rec}</span>
                    <button
                      className={`recomm-action-btn ${completedActions.includes(rec) ? "completed" : ""}`}
                      onClick={() => handleActionClick(rec)}
                      disabled={completedActions.includes(rec)}
                    >
                      {completedActions.includes(rec) ? "✓ Done (+50 XP)" : "Log Action"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Career Recs */}
            <div className="recomm-card" style={{ borderTop: "3px solid var(--accent)" }}>
              <div className="recomm-card-title" style={{ color: "var(--accent)" }}>
                <Brain size={13} />Career Recommendations
              </div>
              <ul className="recomm-card-list">
                {(aiData?.recommendations?.career || [
                  "Focus on 2 DSA Trees & Graphs sessions",
                  "Complete 90 min deep focus block",
                  "Rest 10 min after every 50 min session"
                ]).map((rec: string, idx: number) => (
                  <li key={idx} className="recomm-card-item-actionable">
                    <span className="recomm-card-item-text">{rec}</span>
                    <button
                      className={`recomm-action-btn ${completedActions.includes(rec) ? "completed" : ""}`}
                      onClick={() => handleActionClick(rec)}
                      disabled={completedActions.includes(rec)}
                    >
                      {completedActions.includes(rec) ? "✓ Done (+50 XP)" : "Deep Focus"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* SECTION 6: ANATOMICAL TWIN (HIGH FIDELITY SILHOUETTE drawing) */}
        <div id="anatomical-twin" className="widget-card">
          <div className="widget-header">
            <h3 className="widget-header-title">
              <Heart className="widget-header-icon" size={18} />Anatomical Twin Status
            </h3>
            <span className="widget-header-badge">Physiology Core</span>
          </div>

          <div className="anatomical-grid">

            {/* Humane High-Fidelity Silhouette Visualization */}
            <div className="silhouette-visualizer">
              <svg className="silhouette-svg" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* stylized high-fidelity humane athletic silhouette outline */}
                <path
                  d="M50,12 C54.5,12 58,15.5 58,20 C58,24.5 54.5,28 50,28 C45.5,28 42,24.5 42,20 C42,15.5 45.5,12 50,12 Z 
                     M48,28 L52,28 L52,32 L56,33 C64,35 68,39 69,45 C70,51 68,60 67,70 C66,80 65,90 65,96 C65,98 63.5,99 62,97 C60.5,95 61,85 62,75 C63,65 64,55 63,48 C62.5,45 59.5,41 57,41 L55,42 L55,75 C55,87 56,100 56,104 C56,106 58,110 59,115 C60.5,122.5 61.5,130 61,145 C60,165 59.5,185 60.5,192 C60.8,194 59.5,195 57,195 C54.5,195 53.5,194.5 53.5,192 L53,150 L50,108 L47,150 L46.5,192 C46.5,194.5 45.5,195 43,195 C40.5,195 39.2,194 39.5,192 C40.5,185 40,165 39,145 C38.5,130 39.5,122.5 41,115 C42,110 44,106 44,104 C44,100 45,87 45,75 L45,42 L43,41 C40.5,41 37.5,45 37,48 C36,55 37,65 38,75 C39,85 39.5,95 38,97 C36.5,99 35,98 35,96 C35,90 34,80 33,70 C32,60 30,51 31,45 C32,39 36,35 44,33 L48,32 Z"
                  fill="rgba(37,99,235,0.05)"
                  stroke="rgba(37,99,235,0.22)"
                  strokeWidth="1.2"
                />
                {/* Heart node */}
                <path d="M50 52 C49 50, 47 50, 47 52 C47 54, 50 56, 50 56 C50 56, 53 54, 53 52 C53 50, 51 50, 50 52 Z" fill="rgba(239, 68, 68, 0.45)" stroke="var(--warning)" strokeWidth="0.8" />
                {/* Glowing Brain Zone (Head) */}
                <circle cx="50" cy="20" r="3.5" fill={currentSleep < 6.5 ? "rgba(239, 68, 68, 0.45)" : "rgba(16, 185, 129, 0.35)"} />
                {/* Glowing Core center (Metabolic Node) */}
                <circle cx="50" cy="78" r="4.5" fill="rgba(139, 92, 246, 0.35)" />
              </svg>
              <div style={{ position: "absolute", top: 12, right: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                <span className="constraint-pill" style={{ background: currentSleep < 6.5 ? "var(--warning-glow)" : "var(--success-glow)", color: currentSleep < 6.5 ? "var(--warning)" : "var(--success)" }}>
                  {currentSleep < 6.5 ? "Neural Strain" : "Metabolic Stable"}
                </span>
              </div>
            </div>

            {/* Biometric Scores & Physiological Evolution */}
            <div className="biometrics-col">

              <div className="biometric-bar-card">
                <div className="bbc-header">
                  <span>Recovery Quality</span>
                  <span style={{ color: currentSleep < 6.5 ? "var(--warning)" : "var(--success)" }}>
                    {Math.round(currentSleep * 13.5)}%
                  </span>
                </div>
                <div className="bbc-bar-track">
                  <div className="bbc-bar-fill" style={{ width: `${Math.round(currentSleep * 13.5)}%`, background: currentSleep < 6.5 ? "var(--warning)" : "var(--success)" }} />
                </div>
              </div>

              <div className="biometric-bar-card">
                <div className="bbc-header">
                  <span>Cardio Energy Balance</span>
                  <span>75%</span>
                </div>
                <div className="bbc-bar-track">
                  <div className="bbc-bar-fill" style={{ width: "75%" }} />
                </div>
              </div>

              <div className="biometric-bar-card">
                <div className="bbc-header">
                  <span>Cortisol / Stress Limit</span>
                  <span style={{ color: "var(--accent)" }}>61%</span>
                </div>
                <div className="bbc-bar-track">
                  <div className="bbc-bar-fill" style={{ width: "61%", background: "var(--accent)" }} />
                </div>
              </div>

              {/* Physiological Evolution */}
              <div className="physiological-comparison-card">
                <div className="pcc-stat">
                  <span className="pcc-label">Physiological Age</span>
                  <span className="pcc-val" style={{ color: currentSleep < 6.5 ? "var(--warning)" : "var(--success)" }}>
                    {physiologicalAge.toFixed(1)} Years
                  </span>
                </div>
                <div className="pcc-stat" style={{ textAlign: "right" }}>
                  <span className="pcc-label">Recovery Capacity</span>
                  <span className="pcc-val" style={{ color: "var(--primary)" }}>
                    Top {recoveryCapacityPercentile}%
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* SECTION 7: FINANCIAL TWIN */}
        <div id="financial-twin" className="widget-card">
          <div className="widget-header">
            <h3 className="widget-header-title">
              <TrendingUp className="widget-header-icon" size={18} />Financial Twin Runway
            </h3>
            <span className="widget-header-badge">Buffer metrics</span>
          </div>

          <div className="financial-grid">

            {/* Metric Blocks */}
            <div className="finance-stats-grid">

              <div className="finance-stat-card">
                <span className="fsc-label">Current Savings</span>
                <span className="fsc-val">₹{displaySavings}</span>
              </div>

              <div className="finance-stat-card">
                <span className="fsc-label">Projected 12-Month</span>
                <span className="fsc-val" style={{ color: "var(--primary)" }}>₹1,05,000</span>
              </div>

              <div className="finance-stat-card">
                <span className="fsc-label">Target Goal Limit</span>
                <span className="fsc-val" style={{ color: "var(--accent)" }}>₹2,00,000</span>
              </div>

              <div className="finance-stat-card">
                <div className="fsc-label">Goal Progress</div>
                <div className="fsc-val" style={{ color: "var(--success)" }}>52%</div>
              </div>

            </div>

            {/* Projection Details */}
            <div className="finance-projection-col">
              <div className="fpc-title">Current Trajectory Projection</div>

              <div className="fpc-trajectory-row">
                <span>Current Runway Plan</span>
                <span className="fpc-trajectory-val" style={{ background: "var(--warning-glow)", color: "var(--warning)" }}>
                  Goal reached in 23 months
                </span>
              </div>

              <div className="fpc-trajectory-row">
                <span>Optimized Twin Plan</span>
                <span className="fpc-trajectory-val" style={{ background: "var(--success-glow)", color: "var(--success)" }}>
                  Goal reached in 14 months
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 8: BEHAVIORAL TWIN & AI EXPLAINABILITY */}
        <div id="behavioral-twin" className="widget-card">
          <div className="widget-header">
            <h3 className="widget-header-title">
              <Brain className="widget-header-icon" size={18} />Behavioral Twin Execution
            </h3>
            <span className="widget-header-badge">Mindset Momentum</span>
          </div>

          <div className="behavioral-grid-wrapper">

            <div className="behavioral-grid">
              <div className="behavior-scorecard">
                <div className="bsc-label">Habit Consistency</div>
                <div className="bsc-num">84%</div>
                <div className="bsc-desc">High Adherence</div>
              </div>

              <div className="behavior-scorecard">
                <div className="bsc-label">Focus Index</div>
                <div className="bsc-num" style={{ color: "var(--accent)" }}>79%</div>
                <div className="bsc-desc">Highly Intentional</div>
              </div>

              <div className="behavior-scorecard">
                <div className="bsc-label">Learning Velocity</div>
                <div className="bsc-num" style={{ color: "var(--success)" }}>88%</div>
                <div className="bsc-desc">Rapid Progression</div>
              </div>

              <div className="behavior-scorecard">
                <div className="bsc-label">Burnout Probability</div>
                <div className="bsc-num" style={{ color: "var(--warning)" }}>21%</div>
                <div className="bsc-desc">Low Core Risk</div>
              </div>
            </div>

            {/* AI Accuracy & Explainability Score */}
            <div className="explainability-accuracy-card">
              <div className="eac-left">
                <span className="eac-badge">
                  <Database size={12} />Telemetry Validation
                </span>
                <h4 className="eac-title">Twin Prediction Confidence: {aiData?.confidence || 84}%</h4>
                <p className="eac-desc">
                  Calculated dynamically from complete multi-domain telemetry logs stored in MongoDB. Higher log quantity yields hyper-precise twin reflections.
                </p>
              </div>
              <div className="eac-metrics-grid">
                <div className="eac-metric-box">
                  <div className="emb-num">{totalLogs}</div>
                  <div className="emb-label">Total Logs</div>
                </div>
                <div className="eac-metric-box">
                  <div className="emb-num">{daysTracked}</div>
                  <div className="emb-label">Days Tracked</div>
                </div>
                <div className="eac-metric-box">
                  <div className="emb-num" style={{ color: "var(--accent)" }}>3 / 3</div>
                  <div className="emb-label">Active Domains</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 9: DIGITAL TWIN MEMORY CONSOLE (SWAPPED BOTTOM - CRISP Bullets) */}
        <div className="widget-card">
          <div className="widget-header">
            <h3 className="widget-header-title">
              <History className="widget-header-icon" size={18} />Digital Twin Memory Timeline
            </h3>
            <span className="widget-header-badge">Behavioral Narrative Console</span>
          </div>

          <div className="twin-memory-console">
            <h4 className="tm-title">
              <History size={16} style={{ color: "var(--accent)" }} />Pristine Memory Timeline
            </h4>
            <div className="tm-timeline">
              <div className="tm-node">
                <span className="tm-node-time">7 Days Ago</span>
                <p className="tm-node-desc">Sleep consistency dropped 14% below target.</p>
              </div>
              <div className="tm-node">
                <span className="tm-node-time">4 Days Ago</span>
                <p className="tm-node-desc">Study productivity declined 6% from fatigue.</p>
              </div>
              <div className="tm-node">
                <span className="tm-node-time">2 Days Ago</span>
                <p className="tm-node-desc">Workout streak broke, elevating baseline stress.</p>
              </div>
              <div className="tm-node" style={{ opacity: 0.9 }}>
                <span className="tm-node-time">Today</span>
                <p className="tm-node-desc">Learning velocity experiencing slight drift.</p>
              </div>
            </div>
            <div className="tm-root-cause-banner">
              <AlertTriangle size={15} />
              Root Cause: Sleep deficit triggered recovery breakdown.
            </div>
          </div>
        </div>

        {/* Dynamic Telemetry Footer Badges */}
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px" }}>
          <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "12px", padding: "8px 16px", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-sub)", display: "flex", gap: "6px", alignItems: "center" }}>
            <Zap size={14} style={{ color: "var(--accent)" }} />
            <span>STREAK: {streak} DAYS</span>
          </div>
          <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "12px", padding: "8px 16px", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-sub)", display: "flex", gap: "6px", alignItems: "center" }}>
            <Activity size={14} style={{ color: "var(--primary)" }} />
            <span>TOTAL SCORE: {localXp !== null ? localXp : totalPoints} XP</span>
          </div>
        </div>

      </div>
    </div>
  );
}