"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Wallet,
  HeartPulse,
  Briefcase,
  Activity,
  BrainCircuit,
  Clock,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

type DashboardData = {
  dashboard?: {
    user?: { name?: string };

    scorecards?: {
      health?: number;
      finance?: number;
      career?: number;
    };

    syntraCore?: number;

    gamification?: {
      badges?: string[];
      totalPoints?: number;
      currentStreak?: number;
    };
    goals?: any[];
    timeline?: any[];
  };

  insights?: { tag: string; text: string }[];

  success?: boolean;
};

// ——— Shared Typewriter (matches HomePage feel) ———
function TypewriterGreeting({ name, isLight }: { name: string; isLight: boolean }) {
  const [greeting, setGreeting] = useState("");
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    let timeText = "GOOD NIGHT";

    if (hour >= 5 && hour < 12) {
      timeText = "GOOD MORNING";
    } else if (hour >= 12 && hour < 17) {
      timeText = "GOOD AFTERNOON";
    } else if (hour >= 17 && hour < 21) {
       timeText = "GOOD EVENING";
    }
    const phrases = [ `${timeText}, ${name || "User"}`,
  "Tracking your growth in real time",];

    const current = phrases[phase];
    let i = 0;

    const interval = window.setInterval(() => {
      setGreeting(current.slice(0, i + 1));
      i++;
      if (i === current.length) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          setVisible(false);
          window.setTimeout(() => {
            setPhase((p) => (p + 1) % phrases.length);
            setGreeting("");
            setVisible(true);
          }, 500);
        }, 1500);
      }
    }, 32);

    timerRef.current = interval;
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [phase, name]);

  return (
    <h1
      className="dash-greeting"
      style={{
        opacity: visible ? 1 : 0,
        color: isLight ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.95)",
      }}
    >
      {greeting}
      <span className="dash-cursor" />
    </h1>
  );
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightMode, setLightMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);

    const fetchDashboard = async () => {

  try {

    const res = await fetch("/api/dashboard", {
      cache: "no-store",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch dashboard");
    }

    const data = await res.json();
    const aiRes = await fetch("/api/ai/recommend", {
  cache: "no-store",
  credentials: "include",
    });

const aiData = await aiRes.json();

    console.log("BACKEND DATA:", data);

    setDashboard({
  dashboard: data.dashboard,
  success: data.success,

  insights: [
    {
      tag: "Twin Prediction",
      text: aiData.ai?.twinPrediction || "AI analysis initializing.",
    },
    {
      tag: "Daily Reflection",
      text: aiData.ai?.dailyReflection || "Reflection unavailable.",
    },
    {
      tag: "Daily Challenge",
      text: aiData.ai?.dailyChallenge || "No challenge generated.",
    },
  ],
});

  } catch (error) {

    console.error("Dashboard Fetch Error:", error);

  } finally {

    setLoading(false);
  }
};

    fetchDashboard();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading || !dashboard) return <TerminalLoading />;

  const scores = [
  {
    label: "Health.Score",
    value: dashboard.dashboard?.scorecards?.health ?? 0,
    icon: <HeartPulse size={18} />,
    color: "#ff7676",
  },
  {
    label: "Finance.Score",
    value: dashboard.dashboard?.scorecards?.finance ?? 0,
    icon: <Wallet size={18} />,
    color: "#47e6a1",
  },
  {
    label: "Career.Score",
    value: dashboard.dashboard?.scorecards?.career ?? 0,
    icon: <Briefcase size={18} />,
    color: "#68a8ff",
  },
  {
     label: "Twin.Sync",
  value: dashboard.dashboard?.syntraCore ?? 0,
  icon: <Activity size={18} />,
  color: "#ffffff",
  },
  {
  label: "XP.Points",
  value: dashboard.dashboard?.gamification?.totalPoints ?? 0,
  icon: <BrainCircuit size={18} />,
  color: "#facc15",
},

{
  label: "Daily.Streak",
  value: dashboard.dashboard?.gamification?.currentStreak ?? 0,
  icon: <Clock size={18} />,
  color: "#fb7185",
},
];

  return (
    <div className={lightMode ? "light-theme" : ""}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        /* Inherit same variable system from HomePage */
        :root {
          --bg-gradient: radial-gradient(1200px 800px at 10% -10%, rgba(255,255,255,0.06), transparent 50%),
                         radial-gradient(1400px 900px at 110% 10%, rgba(255,255,255,0.05), transparent 55%),
                         #000;
          --text-main: #fff;
          --text-muted: rgba(255,255,255,0.64);
          --text-semi: rgba(255,255,255,0.78);
          --text-invisible: rgba(255,255,255,0.5);
          --glass: rgba(15,15,15,0.55);
          --glass-strong: rgba(15,15,15,0.72);
          --stroke: rgba(255,255,255,0.14);
          --stroke-weak: rgba(255,255,255,0.08);
          --accent: #9AE6FF;
          --accent-2: #9B8CFF;
          --accent-grad: linear-gradient(90deg, #9AE6FF, #9B8CFF 45%, #FF7AE6 90%);
          --cta-primary-bg: #fff;
          --cta-primary-text: #000;
          --cell-bg: rgba(255,255,255,0.03);
          --cell-hover: rgba(255,255,255,0.06);
          --nav-link-bg: rgba(255,255,255,0.04);
          --nav-link-hover: rgba(255,255,255,0.1);
          --nav-link-border: rgba(255,255,255,0.18);
          --grid-line: rgba(255,255,255,0.04);
          --vignette: radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,0,0.8) 100%);
          --pulse-glow-0: rgba(255,255,255,0.06);
          --pulse-glow-50: rgba(255,255,255,0.12);
          --footer-bg: rgba(10,10,10,0.6);
          --footer-hover-bg: rgba(20,20,20,0.72);
        }
        .light-theme {
          --bg-gradient: radial-gradient(1200px 800px at 10% -10%, rgba(0,0,0,0.04), transparent 50%),
                         radial-gradient(1400px 900px at 110% 10%, rgba(0,0,0,0.03), transparent 55%),
                         #fff;
          --text-main: #000;
          --text-muted: rgba(0,0,0,0.64);
          --text-semi: rgba(0,0,0,0.78);
          --text-invisible: rgba(0,0,0,0.5);
          --glass: rgba(240,240,240,0.55);
          --glass-strong: rgba(240,240,240,0.72);
          --stroke: rgba(0,0,0,0.14);
          --stroke-weak: rgba(0,0,0,0.08);
          --accent-grad: linear-gradient(90deg, #005A78, #3B2D99 45%, #991682 90%);
          --cta-primary-bg: #000;
          --cta-primary-text: #fff;
          --cell-bg: rgba(0,0,0,0.02);
          --cell-hover: rgba(0,0,0,0.06);
          --nav-link-bg: rgba(0,0,0,0.02);
          --nav-link-hover: rgba(0,0,0,0.06);
          --nav-link-border: rgba(0,0,0,0.14);
          --grid-line: rgba(0,0,0,0.04);
          --vignette: radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(255,255,255,0.5) 100%);
          --pulse-glow-0: rgba(0,0,0,0.03);
          --pulse-glow-50: rgba(0,0,0,0.08);
          --footer-bg: rgba(245,245,245,0.7);
          --footer-hover-bg: rgba(0,0,0,0.04);
        }

        .theme-container {
          background: var(--bg-gradient);
          color: var(--text-main);
          min-height: 100vh;
          transition: background 0.3s ease, color 0.3s ease;
          font-family: 'Space Mono', monospace;
        }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: translateY(0);} }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes marquee { 0% { transform: translateX(100%);} 100% { transform: translateX(-100%);} }

        .grain::after {
          content: '';
          position: fixed; inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 9999; opacity: 0.16;
        }

        /* NAV (matches HomePage) */
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; transition: background .35s, border-color .35s, backdrop-filter .35s; border-bottom: 1px solid transparent; background: transparent; }
        .nav.scrolled { background: var(--glass-strong); border-color: var(--stroke); backdrop-filter: saturate(160%) blur(16px); }
        .nav-inner { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; height: 76px; display: flex; align-items: center; justify-content: space-between; }
        .logo-area { display: flex; align-items: center; gap: 14px; text-decoration: none; }
        .logo-icon { width: 46px; height: 46px; border: 1.5px solid var(--stroke); border-radius: 12px; display: grid; place-items: center; background: radial-gradient(120% 120% at 50% 0%, var(--nav-link-hover), transparent 60%); position: relative; transition: border-color .2s, transform .2s, background .2s; overflow: visible; }
        .logo-icon:hover { border-color: var(--text-main); transform: translateY(-1px) scale(1.02); }
        .logo-letter { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; letter-spacing: 0.04em; background: var(--accent-grad); -webkit-background-clip: text; background-clip: text; color: transparent; text-shadow: 0 0 22px rgba(154,230,255,0.15); }
        .brand-wrap { width: min(34vw,260px); height: 40px; overflow: hidden; position: relative; mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%); -webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%); }
        .brand-track { position: absolute; white-space: nowrap; display: inline-flex; align-items: center; gap: 28px; animation: marquee 10s linear infinite; }
        .brand-word { font-family: 'Bebas Neue', sans-serif; font-size: clamp(1.6rem,3.6vw,2.4rem); letter-spacing: 0.24em; background: var(--accent-grad); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 12px rgba(154,230,255,0.14)); text-transform: uppercase; }
        .brand-sep { color: var(--stroke); }
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-link { padding: 9px 18px; border-radius: 10px; font-size: 0.82rem; letter-spacing: 0.08em; text-decoration: none; transition: background .18s, color .18s, border-color .18s, transform .15s; border: 1.5px solid var(--nav-link-border); color: var(--text-semi); background: var(--nav-link-bg); backdrop-filter: blur(6px); cursor: pointer;width: 100%; text-align: left;  color: white; }
        .nav-link:hover { background: var(--nav-link-hover); color: var(--text-main); border-color: var(--text-invisible); transform: translateY(-1px); }
        .nav-link-solid { background: var(--cta-primary-bg); color: var(--cta-primary-text); border-color: var(--cta-primary-bg); font-weight: 700; }
        .nav-link-solid:hover { background: var(--text-semi); transform: translateY(-1px) scale(1.03); }

        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 6px; border: 1.5px solid var(--stroke); border-radius: 8px; background: var(--nav-link-bg); transition: border-color .2s, background .2s; }
        .hamburger:hover { border-color: var(--text-main); background: var(--nav-link-hover); }
        .hamburger span { display: block; width: 22px; height: 1.5px; background: var(--text-main); transition: transform .3s; }
        .mobile-menu {
          display: none;
          flex-direction: column;
          gap: 10px;
          position: absolute;
          top: 78px;
          right: 24px;
          width: 260px;
          padding: 14px;
          border-radius: 18px;
          background: rgba(15,15,15,0.88);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 10px 40px rgba(0,0,0,0.45);
          z-index: 999;
        }
        .mobile-menu.open { display: flex; }

        /* Dashboard Hero wrapper */
        .dash-hero { min-height: 44vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 120px 1.5rem 40px; position: relative; overflow: hidden; }
        .hero-gridlines { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px); background-size: 80px 80px; opacity: 0.35; mix-blend-mode: multiply; }
        .hero-vignette { position: absolute; inset: 0; pointer-events: none; background: var(--vignette); }
        .hero-content { position: relative; z-index: 2; max-width: 1100px; animation: fadeUp 0.9s ease both; }

        .dash-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-family: 'Courier Prime', monospace; font-size: 0.76rem; letter-spacing: 0.32em; color: var(--text-invisible); text-transform: uppercase; margin-bottom: 18px; padding: 8px 12px; border: 1px solid var(--stroke-weak); border-radius: 999px; background: var(--nav-link-bg); backdrop-filter: blur(6px); }
        .dash-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.8rem,6vw,4.8rem); line-height: 1; letter-spacing: 0.04em; color: var(--text-main); margin-bottom: 4px; }
        .dash-sub { font-family: 'Bebas Neue', sans-serif; font-size: clamp(1.8rem,4vw,3rem); line-height: 1; letter-spacing: 0.04em; background: var(--accent-grad); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 18px; }

        .dash-meta { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; justify-content: center; color: var(--text-semi); font-family: 'Courier Prime', monospace; font-size: 0.78rem; letter-spacing: 0.12em; }
        .dash-meta .dot { width: 8px; height: 8px; border-radius: 999px; background: #22c55e; box-shadow: 0 0 12px rgba(34,197,94,0.6); }

        .dash-greeting { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.4rem,6vw,4.2rem); letter-spacing: 0.08em; margin-bottom: 6px; transition: opacity .5s; }
        .dash-cursor { display: inline-block; width: 2px; height: 1em; background: currentColor; margin-left: 4px; vertical-align: baseline; animation: blink 1s step-end infinite; }

        /* Section label + grid */
        .about-header { display: flex; align-items: center; gap: 18px; margin: 0 auto 24px; max-width: 1100px; padding: 0 1.5rem; }
        .section-label { font-family: 'Courier Prime', monospace; font-size: 0.72rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-invisible); padding: 6px 10px; border: 1px solid var(--stroke-weak); border-radius: 8px; background: var(--cell-bg); backdrop-filter: blur(6px); }
        .section-line { flex: 1; height: 1px; background: var(--stroke-weak); }

        .content { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem 80px; }
        .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .card { border: 1px solid var(--stroke-weak); padding: 24px; background: var(--cell-bg); border-radius: 16px; transition: background .25s, border-color .25s, transform .2s; backdrop-filter: blur(6px); }
        .card:hover { background: var(--cell-hover); border-color: var(--stroke); transform: translateY(-2px); }

        .score-label { font-family: 'Courier Prime', monospace; font-size: 0.7rem; letter-spacing: 0.2em; color: var(--text-invisible); text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; }
        .score-value { display: flex; align-items: baseline; gap: 8px; }
        .score-num { font-family: 'Space Mono', monospace; font-size: 2.4rem; color: var(--text-main); }
        .score-den { font-family: 'Courier Prime', monospace; font-size: 0.72rem; color: var(--text-invisible); }

        .progress { height: 5px; background: var(--stroke-weak); border-radius: 3px; overflow: hidden; margin-top: 12px; }
        .progress-fill { height: 100%; transition: width 0.8s ease; background: var(--text-main); }

        .panel { grid-column: span 8; min-height: 380px; position: relative; overflow: hidden; }
        .panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .sys { font-family: 'Courier Prime', monospace; font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--text-invisible); }
        .panel-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; letter-spacing: 0.08em; color: var(--text-main); }

        .panel-body { display: flex; align-items: center; justify-content: center; padding: 30px 10px; }
        .panel-foot { border-top: 1px solid var(--stroke-weak); padding-top: 16px; display: flex; align-items: center; justify-content: space-between; }

        .btn-ghost { font-family: 'Courier Prime', monospace; font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; border: 1px solid var(--stroke); padding: 8px 12px; border-radius: 10px; color: var(--text-semi); background: var(--nav-link-bg); transition: background .18s, color .18s, border-color .18s, transform .18s; display: inline-flex; align-items: center; gap: 8px; }
        .btn-ghost:hover { background: var(--nav-link-hover); color: var(--text-main); border-color: var(--text-invisible); transform: translateY(-2px); }

        .insights { grid-column: span 4; display: flex; flex-direction: column; gap: 10px; }
        .insight { border-left: 4px solid #68a8ff; cursor: pointer; }
        .insight:hover { border-left-color: var(--text-main); }

        .insight-tag { font-family: 'Courier Prime', monospace; font-size: 0.68rem; letter-spacing: 0.22em; color: #68a8ff; text-transform: uppercase; display: inline-flex; align-items: center; gap: 6px; }
        .insight-text { font-family: 'Courier Prime', monospace; font-size: 0.92rem; line-height: 1.7; color: var(--text-semi); margin-top: 8px; }

        .footer-pad { height: 40px; }

        @media (max-width: 1024px) {
          .cards { grid-template-columns: repeat(2, 1fr); }
          .panel { grid-column: span 12; }
          .insights { grid-column: span 12; }
        }
        .hamburger {
          display: flex;
        }
      `}</style>

      <div className="theme-container">
        <div className="grain" />

        {/* NAV */}
        <nav className={`nav${scrolled ? " scrolled" : ""}`}>
          <div className="nav-inner">
            <Link href="/" className="logo-area" aria-label="Home">
              <div className="logo-icon" aria-hidden="true">
                <span className="logo-letter">S</span>
              </div>
              <div className="brand-wrap" aria-hidden="true">
                <div className="brand-track">
                  <span className="brand-word">Syntra</span>
                  <span className="brand-sep">•</span>
                  <span className="brand-word">Syntra</span>
                  <span className="brand-sep">•</span>
                  <span className="brand-word">Syntra</span>
                  <span className="brand-sep">•</span>
                  <span className="brand-word">Syntra</span>
                </div>
              </div>
            </Link>
            <button
              className="hamburger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <div id="mobile-menu" className={`mobile-menu${menuOpen ? " open" : ""}`}>
            <button
              onClick={() => {
                setLightMode((v) => !v);
              }}
              className="nav-link"
              style={{ textAlign: "center" }}
            >
              {lightMode ? "🌙 Dark Terminal" : "☀️ Light Terminal"}
            </button>

            <Link
              href="/dashboard"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>

            <Link
              href="/ingestion"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Ingestion
            </Link>

            <Link
              href="/goals"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Goals
            </Link>

            <Link
              href="/simulator"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Simulator
            </Link>

            <Link
              href="/insights"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Insights
            </Link>

            <Link
              href="/profile"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="dash-hero">
          <div className="hero-gridlines" />
          <div className="hero-vignette" />
          <div className="hero-content">
            <div className="dash-eyebrow">Syntra.OS — Personal Digital Twin</div>
             <TypewriterGreeting
                name={dashboard.dashboard?.user?.name || "OPERATOR"}
                isLight={lightMode}
            />
         
            <div className="dash-sub"> • Health • Finance • Career</div>

            <div className="dash-meta" style={{ marginTop: 12 }}>
              <span className="dot" />
              <span>Syntra AI Active</span>
              <span>•</span>
              <Clock size={14} style={{ opacity: 0.6 }} />
              <span>Last Sync: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </section>

        {/* SECTION: SCORECARDS */}
        <div className="about-header">
          <span className="section-label">[ Core Scores ]</span>
          <div className="section-line" />
        </div>

        <div className="content">
          <div className="cards">
            {scores.map((s) => (
              <div className="card" key={s.label} style={s.core ? { background: "var(--text-main)", color: "var(--cta-primary-text)" } : undefined}>
                <div className="score-label">
                  <span>{s.label}</span>
                  <span style={{ color: s.core ? "var(--cta-primary-text)" : s.color }}>{s.icon}</span>
                </div>
                <div className="score-value">
                  <span className="score-num">{s.value}</span>
                  <span className="score-den">/100</span>
                </div>
                <div className="progress">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.max(0, Math.min(100, s.value))}%`,
                      background: s.core ? "var(--cta-primary-text)" : "var(--text-main)",
                      opacity: s.core ? 0.9 : 1,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* SECTION: PROJECTION + INSIGHTS */}
          <div className="about-header" style={{ marginTop: 40 }}>
            <span className="section-label">[ Projection + Intel ]</span>
            <div className="section-line" />
          </div>

          <div className="cards" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
            {/* Neural Projection Panel */}
            <div className="card panel" style={{ gridColumn: "span 8" }}>
              <div className="panel-head">
                <div>
                  <div className="sys">[ Neural_Projection_Active ]</div>
                  <div className="panel-title" style={{ fontStyle: "italic" }}>Future Trajectory</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span className="w-2 h-2 rounded-full" style={{ display: "inline-block", width: 8, height: 8, borderRadius: 999, background: "var(--text-main)", opacity: 0.2 }} />
                  <span className="w-2 h-2 rounded-full" style={{ display: "inline-block", width: 8, height: 8, borderRadius: 999, background: "var(--text-main)", opacity: 0.4 }} />
                  <span className="w-2 h-2 rounded-full" style={{ display: "inline-block", width: 8, height: 8, borderRadius: 999, background: "var(--text-main)", animation: "fadeIn 1.2s ease infinite alternate" }} />
                </div>
              </div>

              <div className="panel-body">
                <div style={{ textAlign: "center" }}>
                  <BrainCircuit size={64} style={{ margin: "0 auto 12px", color: "var(--text-muted)" }} />
                  <div className="sys" style={{ letterSpacing: "0.3em" }}>Processing behavioral patterns…</div>
                </div>
              </div>

              <div className="panel-foot">
                <div style={{ display: "flex", gap: 28 }}>
                  <div>
                    <div className="sys" style={{ fontSize: 10 }}>Uptime</div>
                    <div style={{ fontFamily: "Space Mono, monospace", fontWeight: 700 }}>1,402h</div>
                  </div>
                  <div>
                    <div className="sys" style={{ fontSize: 10 }}>Anomalies</div>
                    <div style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, color: "#f59e0b" }}>02 Detected</div>
                  </div>
                </div>
                <Link href="/simulator" className="btn-ghost">
                  OPEN_SIMULATOR
                  <ChevronRight size={12} />
                </Link>
              </div>
            </div>

            {/* Insights List */}
            <div className="insights" style={{ gridColumn: "span 4" }}>
              <div className="sys" style={{ marginLeft: 8, marginBottom: 6 }}>/ Insight_Engine / Intel_Feed</div>
              {dashboard.insights?.map((ins, idx) => (
                <div key={idx} className="card insight">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span className="insight-tag">{ins.tag}</span>
                    <ArrowUpRight size={14} style={{ opacity: 0.4 }} />
                  </div>
                  <div className="insight-text">{ins.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: QUICK ACTIONS */}
          <div className="about-header" style={{ marginTop: 40 }}>
            <span className="section-label">[ Actions ]</span>
            <div className="section-line" />
          </div>

          <div className="cards" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <Link href="/ingestion" className="card" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="cell-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.08em", marginBottom: 6, color: "var(--text-main)" }}>
                Data Ingestion
              </div>
              <div className="cell-desc" style={{ fontFamily: "'Courier Prime', monospace", color: "var(--text-muted)", lineHeight: 1.7 }}>
                Connect wearables, banks, and learning feeds to synchronize your twin.
              </div>
            </Link>

            <Link href="/goals" className="card" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="cell-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.08em", marginBottom: 6, color: "var(--text-main)" }}>
                Goals & Plans
              </div>
              <div className="cell-desc" style={{ fontFamily: "'Courier Prime', monospace", color: "var(--text-muted)", lineHeight: 1.7 }}>
                Define targets across health, capital, and growth for adaptive planning.
              </div>
            </Link>

            <Link href="/insights" className="card" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="cell-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.08em", marginBottom: 6, color: "var(--text-main)" }}>
                Insights Feed
              </div>
              <div className="cell-desc" style={{ fontFamily: "'Courier Prime', monospace", color: "var(--text-muted)", lineHeight: 1.7 }}>
                Review cross-domain findings and recommended adjustments.
              </div>
            </Link>
          </div>

          <div className="footer-pad" />
        </div>
      </div>
    </div>
  );
}

/* Loading screen kept minimal but aligned */
function TerminalLoading() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Space Mono, monospace", padding: 16 }}>
      <div style={{ width: "280px", height: 1, background: "#27272a", position: "relative", overflow: "hidden", marginBottom: 16 }}>
        <div style={{ position: "absolute", inset: 0, background: "#fff", width: "33%", animation: "loading 1.8s infinite ease-in-out" }} />
      </div>
      <div style={{ fontSize: 10, letterSpacing: "0.5em", textTransform: "uppercase", color: "#9ca3af", animation: "fadeIn 1.2s ease infinite alternate" }}>
        Booting_Personal_Twin_OS
      </div>
      <style>{`
        @keyframes loading { 0% { left: -100%; } 100% { left: 100%; } }
      `}</style>
    </div>
  );
}