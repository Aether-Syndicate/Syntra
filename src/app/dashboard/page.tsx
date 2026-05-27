"use client";

import Link from "next/link";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
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
} from "lucide-react";

type DashboardData = {
  dashboard?: {
    user?: { name?: string };
    scorecards?: { health?: number; finance?: number; career?: number };
    syntraCore?: number;
    gamification?: { badges?: string[]; totalPoints?: number; currentStreak?: number };
    goals?: any[];
    timeline?: any[];
  };
  insights?: { tag: string; text: string }[];
  success?: boolean;
};

function TypewriterGreeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("");
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    let timeText = "Good Night";
    if (hour >= 5 && hour < 12) timeText = "Good Morning";
    else if (hour >= 12 && hour < 17) timeText = "Good Afternoon";
    else if (hour >= 17 && hour < 21) timeText = "Good Evening";
    const phrases = [`${timeText}, ${name || "User"}`, "Tracking your growth in real time"];
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
        }, 1800);
      }
    }, 38);
    timerRef.current = interval;
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [phase, name]);

  return (
    <h1 className="dash-greeting" style={{ opacity: visible ? 1 : 0 }}>
      {greeting}
      <span className="dash-cursor" />
    </h1>
  );
}

function CircleScore({
  value, label, icon, suffix,
}: {
  value: number; label: string; icon: React.ReactNode; suffix?: string;
}) {
  const size = 130;
  const strokeW = 11;
  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  const isPercent = !suffix;
  const pct = isPercent ? Math.max(0, Math.min(100, value)) : Math.min(100, (value / 500) * 100);
  const dash = (pct / 100) * circ;

  let trackColor = "#22c55e";
  let statusLabel = "Excellent";
  let statusBg = "#dcfce7";
  let statusColor = "#15803d";

  if (isPercent) {
    if (value < 40) {
      trackColor = "#ef4444";
      statusLabel = "Needs attention";
      statusBg = "#fee2e2";
      statusColor = "#b91c1c";
    } else if (value < 70) {
      trackColor = "#f59e0b";
      statusLabel = "Moderate";
      statusBg = "#fef9c3";
      statusColor = "#92400e";
    }
  } else {
    trackColor = "#0066FF";
    statusLabel = value > 200 ? "High activity" : "Building up";
    statusBg = "#eff6ff";
    statusColor = "#1d4ed8";
  }

  // Determine the formula calculation display content based on the target category label
  let cardFormulaText = "";
  const normalizedLabel = label.toLowerCase().trim();

  if (normalizedLabel === "health") {
    cardFormulaText = "Health = Sleep Quality + Physical Activity + Emotional Stability + Energy Consistency + Nutrition Balance − Stress Load";
  } else if (normalizedLabel === "finance") {
    cardFormulaText = "Finance = Savings Discipline + Spending Intelligence + Financial Stability − Impulse Spending";
  } else if (normalizedLabel === "career") {
    cardFormulaText = "Career = Learning Velocity + Productivity Momentum + Skill Growth + Consistency";
  } else if (normalizedLabel === "twin sync") {
    cardFormulaText = "Twin Score = Health Index + Finance Index + Career Index + Consistency Multiplier";
  } else if (normalizedLabel === "xp points") {
    cardFormulaText = "XP Points = Tasks Completed + Daily Logs + Goal Progress + Consistency Bonus";
  } else if (normalizedLabel === "streak") {
    cardFormulaText = "Twin Intelligence = Behavior Patterns + Decision Quality + Habit Consistency + Adaptive Growth";
  }

  return (
    <div className="circle-card">
      <div className="cc-top">
        <div className="cc-icon-label">
          <span className="cc-icon" style={{ color: trackColor }}>{icon}</span>
          <span className="cc-label-text">{label}</span>
        </div>
      </div>

      <div className="circle-wrap">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={strokeW} />
          <circle
            cx={size/2} cy={size/2} r={r}
            fill="none" stroke={trackColor} strokeWidth={strokeW} strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <div className="circle-center">
          <span className="circle-num" style={{ color: trackColor }}>{value}{suffix ?? ""}</span>
          <span className="circle-denom">{isPercent ? "/100" : ""}</span>
        </div>
      </div>

      <div className="cc-image-replacement-section">
        <div className="cc-status-label-pill-wrap">
          <span className="cc-badge-status-new" style={{ background: statusBg, color: statusColor }}>
            {statusLabel}
          </span>
        </div>
        
        {cardFormulaText ? (
          <div className="cc-formula-container">
            <p className="cc-formula-text" style={{ color: "#71717a", fontStyle: "italic" }}>
              {cardFormulaText}
            </p>
          </div>
        ) : (
          <div className="cc-formula-container">
            <p className="cc-formula-text" style={{ color: "#71717a", fontStyle: "italic" }}>
              Tracking metrics breakdown performance system logs live.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TerminalLoading() {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", color: "#0055EE" }}>
      <div style={{ width: 280, height: 2, background: "#eef1f8", borderRadius: 2, overflow: "hidden", marginBottom: 18 }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg,#0055EE,#4499FF)", width: "40%", borderRadius: 2, animation: "ldbar 1.6s infinite ease-in-out" }} />
      </div>
      <div style={{ fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", color: "#7788aa" }}>Loading your dashboard…</div>
      <style>{`@keyframes ldbar{0%{margin-left:-40%}100%{margin-left:140%}}`}</style>
    </div>
  );
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);

    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store", credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch dashboard");
        const data = await res.json();
        let aiData = null;

          try {
        const aiRes = await fetch("/api/ai/recommend", {
        cache: "no-store",
        credentials: "include",
      });

      if (aiRes.ok) {
        aiData = await aiRes.json();
      }
    } catch (err) {
        console.error("AI fetch failed:", err);
    }
        setDashboard({
          dashboard: data.dashboard,
          success: data.success,
          insights: [
          {
            tag: "Twin Prediction",
            text: aiData?.ai?.twinPrediction || "AI analysis initializing.",
          },
          {
          tag: "Daily Reflection",
           text: aiData?.ai?.dailyReflection || "Reflection unavailable.",
          },
          {
           tag: "Daily Challenge",
            text: aiData?.ai?.dailyChallenge || "No challenge generated.",
          },
        ],
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading || !dashboard) return <TerminalLoading />;

  const scores: { label: string; value: number; icon: React.ReactNode; suffix?: string }[] = [
    { label: "Health", value: dashboard.dashboard?.scorecards?.health ?? 0, icon: <HeartPulse size={16} /> },
    { label: "Finance", value: dashboard.dashboard?.scorecards?.finance ?? 0, icon: <Wallet size={16} /> },
    { label: "Career", value: dashboard.dashboard?.scorecards?.career ?? 0, icon: <Briefcase size={16} /> },
    { label: "Twin Sync", value: dashboard.dashboard?.syntraCore ?? 0, icon: <Activity size={16} /> },
    { label: "XP Points", value: dashboard.dashboard?.gamification?.totalPoints ?? 0, icon: <BrainCircuit size={16} />, suffix: " XP" },
    { label: "Streak", value: dashboard.dashboard?.gamification?.currentStreak ?? 0, icon: <Clock size={16} />, suffix: "d" },
  ];

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/ingestion", label: "Ingestion" },
    { href: "/goals", label: "Goals" },
    { href: "/simulator", label: "Simulator" },
    { href: "/insights", label: "Insights" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <div style={{ background: "#ffffff", color: "#111111", fontFamily: '"Inter","DM Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        .nav-wrapper{position:fixed;top:0;left:0;width:100%;z-index:1000;transition:all 0.3s ease;background:rgba(255,255,255,0);}
        .nav-wrapper.scrolled{background:#ffffff;box-shadow:0 1px 24px rgba(0,0,0,0.07);border-bottom:1px solid #eeeeee;}
        .nav-container{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;height:72px;padding:0 2rem;}
        .logo{font-family:'DM Sans',sans-serif;font-size:1.75rem;font-weight:300;color:#ffffff;text-decoration:none;letter-spacing:0.22em;text-transform:uppercase;transition:color 0.3s ease;}
        .logo strong{font-weight:800;letter-spacing:0.1em;}
        .nav-wrapper.scrolled .logo{color:#0055EE;}
        .nav-links-desktop{display:flex;align-items:center;gap:6px;}
        .nav-link-item{font-family:'Inter',sans-serif;font-size:0.85rem;font-weight:500;color:rgba(255,255,255,0.85);text-decoration:none;padding:8px 16px;border-radius:9999px;transition:all 0.2s ease;letter-spacing:0.02em;}
        .nav-wrapper.scrolled .nav-link-item{color:#555;}
        .nav-link-item:hover{background:rgba(255,255,255,0.15);color:#fff;}
        .nav-wrapper.scrolled .nav-link-item:hover{background:#f0f4ff;color:#0055EE;}
        .nav-link-active{background:rgba(255,255,255,0.18)!important;color:#fff!important;font-weight:600;}
        .nav-wrapper.scrolled .nav-link-active{background:#0055EE!important;color:#fff!important;}
        .hamburger-btn{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:8px;border:1.5px solid rgba(255,255,255,0.3);border-radius:10px;background:rgba(255,255,255,0.08);transition:all 0.2s;}
        .nav-wrapper.scrolled .hamburger-btn{border-color:#e0e0e0;background:#f5f5f5;}
        .hamburger-btn span{display:block;width:22px;height:2px;background:#fff;border-radius:2px;}
        .nav-wrapper.scrolled .hamburger-btn span{background:#333;}
        .mobile-menu{display:none;flex-direction:column;gap:6px;position:absolute;top:76px;right:20px;width:230px;padding:14px;border-radius:18px;background:rgba(255,255,255,0.96);backdrop-filter:blur(20px);border:1px solid #e8ebf4;box-shadow:0 12px 40px rgba(0,68,220,0.12);}
        .mobile-menu.open{display:flex;}
        .mobile-nav-link{font-family:'Inter',sans-serif;font-size:0.9rem;font-weight:500;color:#333;text-decoration:none;padding:11px 16px;border-radius:12px;transition:all 0.18s;}
        .mobile-nav-link:hover{background:#f0f4ff;color:#0055EE;}

        .dash-hero{background:linear-gradient(140deg,#0044DD 0%,#0066FF 55%,#3322EE 100%);padding:130px 2rem 80px;position:relative;overflow:hidden;}
        .hero-grid-overlay{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px);background-size:60px 60px;}
        .hero-inner{max-width:1100px;margin:0 auto;position:relative;z-index:2;text-align:center;}
        .hero-pill{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);border-radius:9999px;padding:7px 18px;font-family:'Inter',sans-serif;font-size:0.78rem;font-weight:600;color:rgba(255,255,255,0.85);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:22px;}
        .dash-greeting{font-family:'DM Sans',sans-serif;font-size:clamp(2.2rem,5vw,3.8rem);font-weight:800;color:#fff;letter-spacing:-0.03em;line-height:1.1;margin-bottom:10px;transition:opacity 0.5s;}
        .dash-cursor{display:inline-block;width:3px;height:0.82em;background:#fff;margin-left:4px;vertical-align:middle;animation:blink 1s step-end infinite;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .dash-domains{font-family:'Inter',sans-serif;font-size:1rem;color:rgba(255,255,255,0.75);font-weight:400;margin-bottom:20px;letter-spacing:0.04em;}
        .dash-meta{display:flex;gap:18px;flex-wrap:wrap;align-items:center;justify-content:center;font-family:'Inter',sans-serif;font-size:0.82rem;color:rgba(255,255,255,0.7);}
        .live-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 10px rgba(34,197,94,0.7);animation:pulse 2s infinite;}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(1.3)}}

        .section-wrap{max-width:1200px;margin:0 auto;padding:0 2rem;}
        .section-header{display:flex;align-items:center;gap:16px;margin:56px 0 28px;}
        .section-tag{font-family:'Inter',sans-serif;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#0055EE;padding:5px 12px;border:1.5px solid #d0dfff;border-radius:9999px;background:#f0f4ff;white-space:nowrap;}
        .section-line{flex:1;height:1px;background:#e8ebf4;}

        .scores-grid{display:grid;grid-template-columns:repeat(3, 1fr);gap:24px;}
        .circle-card{background:#ffffff;border:1px solid #e8ebf4;border-radius:24px;padding:24px;display:flex;flex-direction:column;align-items:stretch;gap:20px;transition:transform 0.2s,box-shadow 0.2s,border-color 0.2s;box-shadow:0 4px 18px rgba(0,68,220,0.05);min-height:380px;}
        .circle-card:hover{transform:translateY(-6px);box-shadow:0 14px 36px rgba(0,68,220,0.12);border-color:#c0d0f8;}
        .cc-top{display:flex;align-items:center;justify-content:center;gap:6px;}
        .cc-icon-label{display:flex;align-items:center;gap:8px;}
        .cc-icon{display:flex;align-items:center;transform:scale(1.15);}
        .cc-label-text{font-family:'Inter',sans-serif;font-size:1rem;font-weight:700;color:#111;letter-spacing:-0.01em;}
        
        .circle-wrap{position:relative;width:130px;height:130px;display:flex;align-items:center;justify-content:center;align-self:center;margin:4px 0;}
        .circle-wrap svg{position:absolute;inset:0;}
        .circle-center{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;line-height:1;}
        .circle-num{font-family:'DM Sans',sans-serif;font-size:1.85rem;font-weight:800;letter-spacing:-0.04em;}
        .circle-denom{font-family:'Inter',sans-serif;font-size:0.75rem;color:#9ca3af;font-weight:500;margin-top:2px;}

        .cc-image-replacement-section {display:flex;flex-direction:column;gap:14px;border-top:1px solid #f0f2f8;padding-top:18px;}
        .cc-status-label-pill-wrap {display:flex;justify-content:flex-start;}
        .cc-badge-status-new {font-family:'Inter',sans-serif;font-size:0.72rem;font-weight:700;padding:5px 12px;border-radius:9999px;white-space:nowrap;letter-spacing:0.02em;}
        
        .cc-formula-container {display:flex;flex-direction:column;gap:4px;margin-top:2px;}
        .cc-formula-text {font-family:'Inter',sans-serif;font-size:0.8rem;line-height:1.6;font-weight:500;letter-spacing:-0.01em;}

        .lower-grid{display:grid;grid-template-columns:1fr 380px;gap:20px;margin-bottom:56px;}
        .proj-card{background:#fff;border:1px solid #e8ebf4;border-radius:20px;padding:28px;box-shadow:0 2px 12px rgba(0,68,220,0.04);}
        .proj-title{font-family:'DM Sans',sans-serif;font-size:1.3rem;font-weight:800;color:#111;letter-spacing:-0.02em;margin-bottom:4px;}
        .proj-sub{font-family:'Inter',sans-serif;font-size:0.8rem;color:#9ca3af;font-weight:500;margin-bottom:22px;}
        .proj-stats{display:flex;gap:32px;border-top:1px solid #f0f2f8;padding-top:18px;margin-top:10px;}
        .proj-stat-label{font-family:'Inter',sans-serif;font-size:0.72rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;margin-bottom:4px;}
        .proj-stat-val{font-family:'DM Sans',sans-serif;font-size:1.1rem;font-weight:800;color:#111;}
        .proj-open-btn{display:inline-flex;align-items:center;gap:6px;font-family:'Inter',sans-serif;font-size:0.8rem;font-weight:600;color:#0055EE;text-decoration:none;padding:9px 18px;border:1.5px solid #d0dfff;border-radius:9999px;background:#f0f4ff;transition:all 0.2s;margin-top:18px;}
        .proj-open-btn:hover{background:#0055EE;color:#fff;border-color:#0055EE;}
        .insights-col{display:flex;flex-direction:column;gap:14px;}
        .insight-card{background:#fff;border:1px solid #e8ebf4;border-left:4px solid #0055EE;border-radius:16px;padding:18px 20px;box-shadow:0 2px 8px rgba(0,68,220,0.04);transition:transform 0.2s,box-shadow 0.2s;cursor:pointer;}
        .insight-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,68,220,0.1);}
        .insight-tag-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
        .insight-tag{font-family:'Inter',sans-serif;font-size:0.68rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#0055EE;}
        .insight-text{font-family:'Inter',sans-serif;font-size:0.88rem;line-height:1.65;color:#5a5a6a;}
        .actions-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:64px;}
        .action-card{background:#fff;border:1px solid #e8ebf4;border-radius:20px;padding:28px 24px;text-decoration:none;color:inherit;transition:transform 0.2s,box-shadow 0.2s,border-color 0.2s;box-shadow:0 2px 12px rgba(0,68,220,0.04);display:block;}
        .action-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,68,220,0.12);border-color:#c0d0f8;}
        .action-card-num{font-family:'DM Sans',sans-serif;font-size:3rem;font-weight:800;color:#0055EE;opacity:0.1;line-height:1;margin-bottom:-10px;}
        .action-card-title{font-family:'DM Sans',sans-serif;font-size:1.3rem;font-weight:800;color:#111;letter-spacing:-0.02em;margin-bottom:10px;}
        .action-card-desc{font-family:'Inter',sans-serif;font-size:0.88rem;line-height:1.7;color:#7788aa;font-weight:400;}
        .action-arrow{display:inline-flex;align-items:center;gap:4px;font-family:'Inter',sans-serif;font-size:0.78rem;font-weight:600;color:#0055EE;margin-top:14px;}

        @media(max-width:1024px){.scores-grid{grid-template-columns:repeat(2,1fr);gap:18px;}.lower-grid{grid-template-columns:1fr}.actions-grid{grid-template-columns:repeat(2,1fr)}.nav-links-desktop{display:none}.hamburger-btn{display:flex}}
        @media(max-width:640px){.scores-grid{grid-template-columns:1fr}.actions-grid{grid-template-columns:1fr}}
      `}</style>

      <div className={`nav-wrapper${scrolled ? " scrolled" : ""}`}>
        <div className="nav-container">
          <Link href="/" className="logo">syn<strong>tra</strong></Link>
          <nav className="nav-links-desktop">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className={`nav-link-item${l.href === "/dashboard" ? " nav-link-active" : ""}`}>{l.label}</Link>
            ))}
          </nav>
          <button className="hamburger-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
        <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>{l.label}</Link>
          ))}
        </div>
      </div>

      <section className="dash-hero">
        <div className="hero-grid-overlay" />
        <div className="hero-inner">
          <div className="hero-pill"><span className="live-dot" />Syntra AI — Personal Dashboard</div>
          <TypewriterGreeting name={dashboard.dashboard?.user?.name || "User"} />
          <p className="dash-domains">Health · Finance · Career · Growth</p>
          <div className="dash-meta">
            <span className="live-dot" /><span>AI Active</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <Clock size={13} style={{ opacity: 0.6 }} />
            <span>Last sync: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </section>

      <div className="section-wrap">
        <div className="section-header">
          <span className="section-tag">Your Scores</span>
          <div className="section-line" />
        </div>
        <div className="scores-grid">
          {scores.map((s) => (
            <CircleScore key={s.label} value={s.value} label={s.label} icon={s.icon} suffix={s.suffix} />
          ))}
        </div>

        <div className="section-header">
          <span className="section-tag">Projection & Insights</span>
          <div className="section-line" />
        </div>

        <div className="lower-grid">
          <div className="proj-card">
            <div className="proj-title">Future Trajectory</div>
            <div className="proj-sub">AI-powered projection based on your logs</div>
            {(() => {
              const chartData = (dashboard?.dashboard?.timeline || []).slice(0, 7).reverse()
                .map((log: any, i: number) => ({ day: `D${i + 1}`, health:
  log?.domain === "health" &&
  typeof log?.domainData?.sleepHours === "number"
    ? log.domainData.sleepHours * 10
    : null }))
                .filter((d: any) => d.health !== null);
              return (
                <div style={{ height: 200, marginBottom: 4 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0055EE" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#0055EE" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="health" stroke="#0055EE" fill="url(#areaGrad)" strokeWidth={2} dot={false} />
                      <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e8ebf4", fontSize: 12, borderRadius: 10, fontFamily: "Inter, sans-serif" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              );
            })()}
            <div className="proj-stats">
              <div><div className="proj-stat-label">Uptime</div><div className="proj-stat-val">1,402h</div></div>
              <div><div className="proj-stat-label">Anomalies</div><div className="proj-stat-val" style={{ color: "#f59e0b" }}>02 Found</div></div>
              <div style={{ marginLeft: "auto" }}>
                <Link href="/simulator" className="proj-open-btn">Open Simulator <ChevronRight size={13} /></Link>
              </div>
            </div>
          </div>

          <div className="insights-col">
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 2 }}>AI Insight Feed</div>
            {dashboard.insights?.map((ins, idx) => (
              <div key={idx} className="insight-card">
                <div className="insight-tag-row">
                  <span className="insight-tag">{ins.tag}</span>
                  <ArrowUpRight size={14} style={{ color: "#9ca3af" }} />
                </div>
                <div className="insight-text">{ins.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-header">
          <span className="section-tag">Quick Actions</span>
          <div className="section-line" />
        </div>

        <div className="actions-grid">
          {[
            { href: "/ingestion", num: "01", title: "Data Ingestion", desc: "Connect your health, finance, and career data sources to keep your twin up to date." },
            { href: "/goals", num: "02", title: "Goals & Plans", desc: "Set targets for health, money, and career — then let Syntra map out how to get there." },
            { href: "/insights", num: "03", title: "Insights Feed", desc: "See personalized findings and recommended actions across all areas of your life." },
          ].map((a) => (
            <Link key={a.href} href={a.href} className="action-card">
              <div className="action-card-num">{a.num}</div>
              <div className="action-card-title">{a.title}</div>
              <div className="action-card-desc">{a.desc}</div>
              <div className="action-arrow">Explore <ChevronRight size={13} /></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}