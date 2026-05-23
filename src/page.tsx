"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import{ useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const TYPED_PHRASES = [
  "One mind for your health, money, and growth.",
  "See multiple futures — pick the one you want.",
  "Recommendations that adapt as you do.",
  "Your data, one intelligent twin.",
];

function TypewriterHero({ isLight }: { isLight: boolean }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const phrase = TYPED_PHRASES[phraseIndex];

    if (typing) {
      if (displayed.length < phrase.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(phrase.slice(0, displayed.length + 1));
        }, 32);
      } else {
        timeoutRef.current = setTimeout(() => setTyping(false), 1500);
      }
    } else {
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          setDisplayed("");
          setTyping(true);
          setVisible(true);
          setPhraseIndex((i) => (i + 1) % TYPED_PHRASES.length);
        }, 360);
      }, 360);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, typing, phraseIndex]);

  return (
    <span
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.35s ease",
        display: "inline-block",
        minHeight: "1.4em",
        fontFamily: "'Courier Prime', 'Courier New', monospace",
        letterSpacing: "0.03em",
        color: isLight ? "rgba(0,0,0,0.78)" : "rgba(255,255,255,0.78)",
        fontSize: "clamp(0.95rem, 2vw, 1.2rem)",
        fontWeight: 400,
      }}
    >
      {displayed}
      <span
        style={{
          display: "inline-block",
          width: "2px",
          height: "1.1em",
          background: isLight ? "black" : "white",
          marginLeft: "4px",
          verticalAlign: "middle",
          animation: "blink 1s step-end infinite",
        }}
      />
    </span>
  );
}

const FEATURES = [
  {
    icon: "◈",
    title: "Neural Analytics",
    desc: "Unify patterns across health, finance, and career in a single intelligence plane.",
  },
  {
    icon: "◉",
    title: "Predictive Simulation",
    desc: "Run what‑if timelines and compare outcomes before you commit.",
  },
  {
    icon: "◆",
    title: "AI Recommendations",
    desc: "From meals to investments — tailored to your goals and risk profile.",
  },
  {
    icon: "◐",
    title: "Unified Intelligence",
    desc: "Every dimension of your life coalesced into one evolving twin.",
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  useEffect(() => {

  if (status === "authenticated") {

    router.push("/dashboard");
  }

}, [status, router]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={lightMode ? "light-theme" : ""}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        
        body {
          background: #000;
          color: #fff;
          font-family: 'Space Mono', monospace;
          overflow-x: hidden;
          transition: background 0.3s ease, color 0.3s ease;
        }

        /* Default Dark Mode Custom CSS variables */
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

        /* Translucent White Light Theme CSS variables */
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
          
          /* Updated structure: Translucent White bases turning to Translucent Black on Hover */
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
        }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: translateY(0);} }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 0 var(--pulse-glow-0); }
          50%      { box-shadow: 0 0 42px 6px var(--pulse-glow-50); }
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes spin3d {
          0%   { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }

        /* Subtle film grain overlay */
        .grain::after {
          content: '';
          position: fixed; inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 9999; opacity: 0.16;
        }

        /* NAVIGATION BAR */
        .nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: background 0.35s, border-color 0.35s, backdrop-filter 0.35s;
          border-bottom: 1px solid transparent;
          background: transparent;
        }
        .nav.scrolled {
          background: var(--glass-strong);
          border-color: var(--stroke);
          backdrop-filter: saturate(160%) blur(16px);
        }
        .nav-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 1.5rem;
          height: 76px; display: flex; align-items: center; justify-content: space-between;
        }

        /* BRAND LOGO DESIGN */
        .logo-area { display: flex; align-items: center; gap: 14px; text-decoration: none; }
        .logo-icon {
          width: 46px; height: 46px;
          border: 1.5px solid var(--stroke);
          border-radius: 12px;
          display: grid; place-items: center;
          flex-shrink: 0;
          background: radial-gradient(120% 120% at 50% 0%, var(--nav-link-hover), transparent 60%);
          position: relative;
          perspective: 600px;
          transition: border-color 0.2s, transform 0.2s, background 0.2s;
          overflow: visible;
        }
        .logo-icon:hover { border-color: var(--text-main); transform: translateY(-1px) scale(1.02); }
        .logo-ring {
          position: absolute; inset: -6px;
          border-radius: 14px;
          border: 1px dashed var(--stroke);
          transform-style: preserve-3d;
          animation: spin3d 8s linear infinite;
        }
        .logo-letter {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem; letter-spacing: 0.04em;
          z-index: 2;
          background: var(--accent-grad);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          text-shadow: 0 0 22px rgba(154,230,255,0.15);
        }

        /* Brand Marquee Animation */
        .brand-wrap {
          width: min(34vw, 260px); height: 40px; overflow: hidden; position: relative;
          mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
        }
        .brand-track {
          position: absolute; white-space: nowrap;
          display: inline-flex; align-items: center; gap: 28px;
          animation: marquee 10s linear infinite;
        }
        .brand-word {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.6rem, 3.6vw, 2.4rem);
          letter-spacing: 0.24em;
          background: var(--accent-grad);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          filter: drop-shadow(0 0 12px rgba(154,230,255,0.14));
          text-transform: uppercase;
        }
        .brand-sep { color: var(--stroke); }

        /* ACTIONS AND LINKS */
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-link {
          padding: 9px 18px;
          border-radius: 10px;
          font-size: 0.82rem; letter-spacing: 0.08em;
          text-decoration: none;
          transition: background 0.18s, color 0.18s, border-color 0.18s, transform 0.15s;
          border: 1.5px solid var(--nav-link-border);
          color: var(--text-semi);
          background: var(--nav-link-bg);
          backdrop-filter: blur(6px);
          cursor: pointer;
        }
        .nav-link:hover {
          background: var(--nav-link-hover);
          color: var(--text-main);
          border-color: var(--text-invisible);
          transform: translateY(-1px);
        }
        .nav-link-solid {
          background: var(--cta-primary-bg); color: var(--cta-primary-text); border-color: var(--cta-primary-bg); font-weight: 700;
        }
        .nav-link-solid:hover { background: var(--text-semi); transform: translateY(-1px) scale(1.03); }

        /* INTERACTION LAYOUTS (HAMBURGER) */
        .hamburger {
          display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 6px;
          border: 1.5px solid var(--stroke);
          border-radius: 8px; background: var(--nav-link-bg); transition: border-color 0.2s, background 0.2s;
        }
        .hamburger:hover { border-color: var(--text-main); background: var(--nav-link-hover); }
        .hamburger span { display: block; width: 22px; height: 1.5px; background: var(--text-main); transition: transform 0.3s; }

        .mobile-menu {
          display: none; flex-direction: column; gap: 8px; padding: 16px 1.5rem 20px;
          border-top: 1px solid var(--stroke-weak); background: var(--glass-strong); backdrop-filter: blur(14px);
        }
        .mobile-menu.open { display: flex; }

        /* TERMINAL HERO ENVIRONMENT */
        .hero {
          min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 120px 1.5rem 80px; position: relative; overflow: hidden;
        }
        .hero-gridlines {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 80px 80px;
          opacity: 0.35; mix-blend-mode: multiply;
        }
        .hero-vignette {
          position: absolute; inset: 0; pointer-events: none;
          background: var(--vignette);
        }
        .hero-content { position: relative; z-index: 2; max-width: 960px; animation: fadeUp 0.9s ease both; }

        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'Courier Prime', monospace; font-size: 0.76rem; letter-spacing: 0.32em;
          color: var(--text-invisible); text-transform: uppercase; margin-bottom: 24px;
          padding: 8px 12px; border: 1px solid var(--stroke-weak); border-radius: 999px;
          background: var(--nav-link-bg);
          backdrop-filter: blur(6px);
        }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3.8rem, 10vw, 8.2rem);
          line-height: 0.95; letter-spacing: 0.04em; color: var(--text-main); margin-bottom: 6px;
          text-shadow: 0 0 36px rgba(154,230,255,0.12);
        }
        .hero-title-sub {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.4rem, 6vw, 5rem);
          line-height: 1; letter-spacing: 0.04em;
          background: var(--accent-grad);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          margin-bottom: 28px;
        }
        .hero-typewriter-box {
          min-height: 48px; display: flex; align-items: center; justify-content: center; margin-bottom: 42px;
        }
        .hero-cta { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: center; }
        
        .cta-primary {
          padding: 14px 30px; background: var(--cta-primary-bg); color: var(--cta-primary-text); border-radius: 14px;
          font-size: 0.86rem; font-weight: 700; letter-spacing: 0.09em; text-decoration: none;
          transition: transform 0.18s, background 0.18s; border: 2px solid var(--cta-primary-bg);
        }
        .cta-primary:hover { transform: translateY(-2px) scale(1.04); background: var(--text-semi); border-color: var(--text-semi); }
        
        .cta-secondary {
          padding: 14px 30px; border: 1.5px solid var(--stroke); border-radius: 14px;
          font-size: 0.86rem; letter-spacing: 0.09em; color: var(--text-semi);
          text-decoration: none; transition: background 0.18s, color 0.18s, border-color 0.18s, transform 0.18s;
          background: var(--nav-link-bg);
        }
        .cta-secondary:hover { background: var(--nav-link-hover); color: var(--text-main); border-color: var(--text-invisible); transform: translateY(-2px); }

        .hero-scroll-hint {
          margin-top: 56px; display: flex; flex-direction: column; align-items: center; gap: 8px;
          opacity: 0.32; font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase; animation: fadeIn 2.2s ease both;
        }
        .hero-scroll-line { width: 1px; height: 42px; background: linear-gradient(to bottom, var(--text-main), transparent); }

        /* MODULAR ARCHITECTURE BLOCKS */
        .about { max-width: 1100px; margin: 0 auto; padding: 80px 1.5rem 100px; }
        .about-header { display: flex; align-items: center; gap: 18px; margin-bottom: 44px; }
        .section-label {
          font-family: 'Courier Prime', monospace; font-size: 0.72rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--text-invisible); padding: 6px 10px; border: 1px solid var(--stroke-weak); border-radius: 8px; background: var(--cell-bg);
          backdrop-filter: blur(6px);
        }
        .section-line { flex: 1; height: 1px; background: var(--stroke-weak); }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        
        .about-cell {
          border: 1px solid var(--stroke-weak); padding: 36px 32px; position: relative; overflow: hidden;
          transition: background 0.25s, border-color 0.25s, transform 0.2s;
          background: var(--cell-bg); border-radius: 16px; backdrop-filter: blur(6px);
        }
        .about-cell:hover { background: var(--cell-hover); border-color: var(--stroke); transform: translateY(-2px); }
        .cell-num {
          font-family: 'Courier Prime', monospace; font-size: 0.65rem; color: var(--text-invisible); letter-spacing: 0.2em; margin-bottom: 16px;
        }
        .cell-icon { font-size: 1.4rem; margin-bottom: 14px; color: var(--text-semi); display: block; }
        .cell-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.7rem; letter-spacing: 0.1em; color: var(--text-main); margin-bottom: 10px; }
        .cell-desc { font-family: 'Courier Prime', monospace; font-size: 0.92rem; line-height: 1.75; color: var(--text-muted); }
        .cell-corner { position: absolute; bottom: 16px; right: 20px; font-size: 0.62rem; color: var(--text-invisible); letter-spacing: 0.15em; font-family: 'Courier Prime', monospace; }

        /* TRACKER METRICS */
        .stats-bar {
          border-top: 1px solid var(--stroke-weak);
          border-bottom: 1px solid var(--stroke-weak);
          display: grid; grid-template-columns: repeat(3, 1fr); overflow: hidden; background: var(--cell-bg);
          backdrop-filter: blur(4px);
        }
        .stat-item { padding: 44px 24px; border-right: 1px solid var(--stroke-weak); text-align: center; transition: background 0.22s; }
        .stat-item:last-child { border-right: none; }
        .stat-item:hover { background: var(--cell-hover); }
        .stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 3.1rem; letter-spacing: 0.06em; color: var(--text-main); }
        .stat-label { font-family: 'Courier Prime', monospace; font-size: 0.72rem; letter-spacing: 0.22em; color: var(--text-invisible); text-transform: uppercase; margin-top: 6px; }

        /* DOMAIN RECORDS */
        .domains { max-width: 1100px; margin: 0 auto; padding: 80px 1.5rem; }
        .domains-list { display: flex; flex-direction: column; gap: 10px; }
        .domain-row {
          display: flex; align-items: center; gap: 24px; padding: 22px 24px; border: 1px solid var(--stroke-weak);
          transition: background 0.22s, border-color 0.22s, padding-left 0.22s, transform 0.2s;
          background: var(--cell-bg); border-radius: 14px; cursor: default; backdrop-filter: blur(6px);
        }
        .domain-row:hover { background: var(--cell-hover); border-color: var(--stroke); padding-left: 34px; transform: translateY(-1px); }
        .domain-idx { font-family: 'Courier Prime', monospace; font-size: 0.65rem; color: var(--text-invisible); letter-spacing: 0.18em; min-width: 36px; }
        .domain-name { font-family: 'Bebas Neue', sans-serif; font-size: 1.55rem; letter-spacing: 0.1em; color: var(--text-main); min-width: 160px; }
        .domain-desc { font-family: 'Courier Prime', monospace; font-size: 0.88rem; color: var(--text-muted); flex: 1; }
        .domain-tag {
          font-family: 'Courier Prime', monospace; font-size: 0.68rem; letter-spacing: 0.14em; color: var(--text-semi);
          border: 1px solid var(--stroke-weak); border-radius: 6px; padding: 4px 12px; white-space: nowrap;
        }
        .domain-arrow { opacity: 0; transform: translateX(-8px); transition: opacity 0.22s, transform 0.22s; color: var(--text-semi); font-size: 1rem; }
        .domain-row:hover .domain-arrow { opacity: 1; transform: translateX(0); }

        /* ACTIONS PANEL */
        .cta-banner { max-width: 1100px; margin: 0 auto 80px; padding: 0 1.5rem; }
        .cta-banner-inner {
          border: 1px solid var(--stroke); border-radius: 24px; padding: 56px 40px; text-align: center; position: relative; overflow: hidden;
          animation: glowPulse 5s ease-in-out infinite; background: var(--nav-link-bg); backdrop-filter: blur(8px);
        }
        .cta-banner-inner::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% -20%, var(--cell-hover) 0%, transparent 65%);
          pointer-events: none;
        }
        .cta-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.3rem, 4.8vw, 3.8rem); letter-spacing: 0.08em; color: var(--text-main); margin-bottom: 12px; }
        .cta-sub { font-family: 'Courier Prime', monospace; font-size: 0.96rem; color: var(--text-semi); margin-bottom: 28px; letter-spacing: 0.06em; }

        /* TERMINAL FOOTER RUNTIME */
        footer {
          border-top: 1px solid var(--stroke-weak);
          margin-top: 60px;
          background: var(--footer-bg);
          backdrop-filter: blur(10px);
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        footer:hover {
          background: var(--footer-hover-bg);
          border-top-color: var(--stroke);
        }
        .footer-inner {
          max-width: 1280px; margin: 0 auto; padding: 40px 1.5rem 50px;
          display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 26px; align-items: start;
        }
        .footer-brand {
          display: flex; flex-direction: column; gap: 10px;
        }
        .footer-wordmark {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.8rem, 3.6vw, 2.6rem);
          letter-spacing: 0.22em;
          background: var(--accent-grad);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          filter: drop-shadow(0 0 14px rgba(154,230,255,0.18));
          text-transform: uppercase;
        }
        .footer-copy {
          font-family: 'Courier Prime', monospace; font-size: 0.78rem; color: var(--text-invisible); letter-spacing: 0.08em;
        }
        .footer-links, .footer-social {
          display: flex; flex-direction: column; gap: 10px;
        }
        .footer-heading {
          font-family: 'Courier Prime', monospace; font-size: 0.76rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--text-semi);
          margin-bottom: 6px;
        }
        .footer-link, .social-link {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'Courier Prime', monospace; font-size: 0.9rem; letter-spacing: 0.02em;
          color: var(--text-semi); text-decoration: none; padding: 8px 10px; border-radius: 10px;
          border: 1px solid transparent; transition: color 0.18s, background 0.18s, border-color 0.18s, transform 0.18s;
          background: var(--cell-bg);
        }
        .footer-link:hover, .social-link:hover {
          color: var(--text-main); background: var(--cell-hover); border-color: var(--stroke); transform: translateY(-1px);
        }
        .social-icon {
          width: 18px; height: 18px; display: inline-block;
          filter: drop-shadow(0 0 8px rgba(154,230,255,0.22));
        }

        /* SCREEN OPTIMIZATIONS */
        @media (max-width: 1024px) {
          .about-grid { grid-template-columns: 1fr; }
          .stats-bar { grid-template-columns: 1fr 1fr; }
          .brand-wrap { width: min(42vw, 300px); }
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .stats-bar { grid-template-columns: 1fr; }
          .stat-item { border-right: none; border-bottom: 1px solid var(--stroke-weak); }
          .stat-item:last-child { border-bottom: none; }
          .domain-row { flex-wrap: wrap; gap: 12px; }
          .hero-title { line-height: 1; }
          .footer-inner { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .domain-row { padding: 18px 16px; }
          .about-cell { padding: 28px 22px; }
        }
      `}</style>

      <div className="theme-container">
        <div className="grain" />

        {/* NAVIGATION LAYER */}
        <nav className={`nav${scrolled ? " scrolled" : ""}`}>
          <div className="nav-inner">
            <Link href="/" className="logo-area" aria-label="Home">
              <div className="logo-icon" aria-hidden="true">
                <div className="logo-ring" />
                <span className="logo-letter">S</span>
              </div>

              {/* Dynamic brand path tracking */}
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

            {/* Desktop Link Actions */}
            <div className="nav-links">
              <button 
                onClick={() => setLightMode(!lightMode)} 
                className="nav-link"
                style={{ padding: '9px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Change Environment Color Mode"
              >
                {lightMode ? "🌙 Dark Term" : "☀️ Light Term"}
              </button>
              <Link href="/login" className="nav-link">Login</Link>
              <Link href="/signup" className="nav-link nav-link-solid">Sign In</Link>
            </div>

            {/* Responsive Actions Toggle */}
            <button
              className="hamburger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>

          {/* Collapsible Mobile Terminal Links */}
          <div id="mobile-menu" className={`mobile-menu${menuOpen ? " open" : ""}`}>
            <button 
              onClick={() => { setLightMode(!lightMode); setMenuOpen(false); }} 
              className="nav-link"
              style={{ textAlign: 'center' }}
            >
              {lightMode ? "🌙 Dark Terminal" : "☀️ Light Terminal"}
            </button>
            <Link href="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link href="/signup" className="nav-link nav-link-solid" onClick={() => setMenuOpen(false)}>Sign In</Link>
          </div>
        </nav>

        {/* TERMINAL CANVAS HERO CONTAINER */}
        <section className="hero">
          <div className="hero-gridlines" />
          <div className="hero-vignette" />

          <div className="hero-content">
            <div className="hero-eyebrow">AI Powered Personal Digital Twin</div>

            <h1 className="hero-title">Design Your</h1>
            <div className="hero-title-sub">Future, Intelligently</div>

            <div className="hero-typewriter-box">
              <TypewriterHero isLight={lightMode} />
            </div>

            <div className="hero-cta">
              <Link href="/signup" className="cta-primary">Initialize Syntra</Link>
              <Link href="/login" className="cta-secondary">Access Terminal</Link>
            </div>

            <div className="hero-scroll-hint">
              <div className="hero-scroll-line" />
              <span>Scroll</span>
            </div>
          </div>
        </section>

        {/* METRICS ROW */}
        <div className="stats-bar">
          {[
            { num: "3", label: "Core Domains" },
            { num: "∞", label: "What‑If Scenarios" },
            { num: "01", label: "Unified Platform" },
          ].map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* DETAILED INFORMATION BLOCKS */}
        <section className="about">
          <div className="about-header">
            <span className="section-label">[ System Architecture ]</span>
            <div className="section-line" />
          </div>

          <div className="about-grid">
            {FEATURES.map((f) => (
              <div className="about-cell" key={f.title}>
                <div className="cell-num">SYS</div>
                <span className="cell-icon">{f.icon}</span>
                <div className="cell-title">{f.title}</div>
                <div className="cell-desc">{f.desc}</div>
                <div className="cell-corner">SYNTRA.SYS</div>
              </div>
            ))}
          </div>
        </section>

        {/* OPERATIONS GRID ROWS */}
        <section className="domains">
          <div className="about-header">
            <span className="section-label">[ Domain Coverage ]</span>
            <div className="section-line" />
          </div>

          <div className="domains-list">
            {[
              { name: "Health", desc: "Workout, nutrition, sleep, and reports — fused into a single trajectory.", tag: "BODY.SYS" },
              { name: "Finance", desc: "Spending, investing, saving, and risk — orchestrated for outcomes.", tag: "CAPITAL.SYS" },
              { name: "Career", desc: "Skills, learning, projects, and salary benchmarking — mapped to your path.", tag: "GROWTH.SYS" },
            ].map((d, i) => (
              <div className="domain-row" key={d.name}>
                <span className="domain-idx">0{i + 1}</span>
                <span className="domain-name">{d.name}</span>
                <span className="domain-desc">{d.desc}</span>
                <span className="domain-tag">{d.tag}</span>
                <span className="domain-arrow">→</span>
              </div>
            ))}
          </div>
        </section>

        {/* INITIALIZATION PANEL */}
        <div className="cta-banner">
          <div className="cta-banner-inner">
            <div className="cta-title">Your Digital Twin Awaits</div>
            <div className="cta-sub">Step in. Simulate what’s possible, then make it real.</div>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/signup" className="cta-primary">Initialize Syntra</Link>
              <Link href="/login" className="cta-secondary">Access Terminal</Link>
            </div>
          </div>
        </div>

        {/* MAIN TERMINAL RUNTIME FOOTER */}
        <footer>
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="footer-wordmark">Syntra</span>
              <span className="footer-copy">© 2026. Translucent structure, built for clarity.</span>
              <span className="footer-copy">Get in touch: hello@syntra.ai</span>
            </div>

            <div className="footer-social">
              <div className="footer-heading">Connect</div>

              <a href="#" className="social-link" aria-label="Instagram Profile Link">
                <svg className="social-icon" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
                Instagram
              </a>

              <a href="#" className="social-link" aria-label="Twitter Profile Link">
                <svg className="social-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                Twitter/X
              </a>

              <a href="#" className="social-link" aria-label="LinkedIn Company Page">
                <svg className="social-icon" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M7 10v7M7 7h.01M11 17v-5a2 2 0 0 1 4 0v5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                LinkedIn
              </a>

              <a href="#" className="social-link" aria-label="GitHub Repository Profile">
                <svg className="social-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.19-3.37-1.19-.45-1.14-1.11-1.45-1.11-1.45-.91-.63.07-.62.07-.62 1 .07 1.52 1.03 1.52 1.03 .89 1.52 2.34 1.08 2.91.83 .09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.84c.85.004 1.71.115 2.51.337 1.91-1.29 2.75-1.02 2.75-1.02 .55 1.38.2 2.4.1 2.65 .64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95 .36.31.68.92.68 1.86 0 1.34-.01 2.43-.01 2.76 0 .26.18.58.69.48A10 10 0 0 0 12 2z" stroke="currentColor" strokeWidth="1" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}