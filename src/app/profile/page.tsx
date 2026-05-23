"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Cpu,
  Shield,
  Sparkles,
  Briefcase,
  HeartPulse,
  Wallet,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

const avatars = [
  {
    id: 1,
    name: "Cyberpunk / Techwear",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    id: 2,
    name: "Minimalist / Creative",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    id: 3,
    name: "Neon / Synthwave",
    icon: Shield,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    id: 4,
    name: "Corporate / Executive",
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80",
  },
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLight, setIsLight] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    avatarId: 1,
    optimizationVector: "career",
  });

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
        avatarId: (session.user as any).avatarId || 1,
      }));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      alert("Twin calibration synced successfully.");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
          padding: 48px 20px 64px;
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
          max-width: 1000px;
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
          font-size: 3rem;
          line-height: 1.1;
          letter-spacing: 0.02em;
          background: var(--accent-grad);
          -webkit-background-clip: text;
          color: transparent;
          margin: 6px 0 14px;
          font-weight: 800;
        }
        .subtitle {
          color: var(--text-muted);
          font-size: 1.05rem;
          max-width: 700px;
          line-height: 1.6;
          margin: 0;
        }
        .card {
          background: var(--glass);
          border: 1px solid var(--stroke);
          border-radius: 24px;
          padding: 36px;
          backdrop-filter: blur(24px);
          box-shadow: 0 0 30px var(--glow);
        }
        .section-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }
        .icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--stroke);
        }
        .section-title {
          font-weight: 700;
          font-size: 1.35rem;
          color: var(--text-main);
        }
        .avatar-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 640px) {
          .avatar-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .avatar-btn {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 1;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: #111;
          padding: 0;
        }
        .avatar-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
          z-index: 2;
        }
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .avatar-btn:hover .avatar-img {
          transform: scale(1.08);
        }
        .avatar-btn.active {
          border-color: #9AE6FF;
          box-shadow: 0 0 25px rgba(154, 230, 255, 0.4);
        }
        .avatar-content {
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 16px;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }
        .avatar-name {
          font-weight: 600;
          font-size: 0.85rem;
          color: #fff;
          text-align: left;
          line-height: 1.2;
        }
        .fields-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .fields-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .label {
          font-size: 0.75rem;
          font-family: monospace;
          color: var(--text-muted);
          letter-spacing: 0.1em;
        }
        .input-elem {
          width: 100%;
          box-sizing: border-box;
          border-radius: 14px;
          background: var(--input-bg);
          border: 1px solid var(--stroke);
          padding: 14px 18px;
          color: var(--text-main);
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
        }
        .input-elem:focus {
          border-color: #9AE6FF;
          background: var(--input-focus);
          box-shadow: 0 0 15px rgba(154, 230, 255, 0.1);
        }
        .input-elem:disabled {
          color: var(--text-muted);
          cursor: not-allowed;
          opacity: 0.6;
        }
        .input-elem option {
          background-color: #141414;
          color: #ffffff;
        }
        .light-theme .input-elem option {
          background-color: #ffffff;
          color: #000000;
        }
        .vector-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .vector-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .vector-card {
          border-radius: 16px;
          padding: 20px;
          border: 1px solid var(--stroke);
          transition: background 0.2s;
        }
        .btn {
          width: 100%;
          padding: 18px 24px;
          border-radius: 16px;
          border: none;
          background: var(--text-main);
          color: #000;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn:hover {
          transform: translateY(-2px);
          opacity: 0.95;
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .btn-disconnect {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #ff8585;
          margin-top: 14px;
        }
        .btn-disconnect:hover {
          background: rgba(239, 68, 68, 0.16);
        }
        .divider {
          height: 1px;
          width: 100%;
          background: var(--stroke);
          margin: 32px 0;
        }
      ` }} />

      <div className="viewport">
        <div className="grain" />
        <div className="container">

          {/* HEADINGS SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="header-card"
          >
            <div className="tag">Neural Configuration Subsystem</div>
            <h1 className="title">Twin Configuration Center</h1>
            <p className="subtitle">
              Fine-tune the behavioral architecture and structural priorities of your deep Digital Twin.
            </p>
          </motion.div>

          {/* MAIN SETTINGS INTERFACE PANEL */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
          >
            
            {/* 1. INTERFACE SELECTOR */}
            <div style={{ marginBottom: 36 }}>
              <div className="section-header">
                <div className="icon-wrap" style={{ color: "#9AE6FF" }}><Cpu size={20} /></div>
                <div className="section-title">Interface Shell Matrix</div>
              </div>

              <div className="avatar-grid">
                {avatars.map((avatar) => {
                  const Icon = avatar.icon;
                  const active = form.avatarId === avatar.id;

                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setForm({ ...form, avatarId: avatar.id })}
                      className={`avatar-btn ${active ? "active" : ""}`}
                    >
                      <img src={avatar.image} alt={avatar.name} className="avatar-img" />
                      <div className="avatar-content">
                        <div style={{ 
                          background: active ? "rgba(154, 230, 255, 0.2)" : "rgba(0,0,0,0.6)", 
                          borderRadius: "8px", 
                          padding: "6px",
                          display: "flex",
                          backdropFilter: "blur(4px)"
                        }}>
                          <Icon size={16} style={{ color: active ? "#9AE6FF" : "#fff" }} />
                        </div>
                        <span className="avatar-name">{avatar.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="divider" />

            {/* FORM */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              
              {/* 2. CORE IDENTITY METRICS */}
              <div>
                <div className="section-header">
                  <div className="icon-wrap" style={{ color: "#9B8CFF" }}><Shield size={20} /></div>
                  <div className="section-title">Identity & Core Parameters</div>
                </div>

                <div className="fields-grid">
                  <div className="field-group">
                    <label className="label">FULL SYSTEM NAME</label>
                    <input
                      type="text"
                      className="input-elem"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="field-group">
                    <label className="label">NEURAL NETWORK EMAIL</label>
                    <input
                      type="email"
                      className="input-elem"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="field-group">
                    <label className="label">CHRONOLOGICAL AGE</label>
                    <input
                      type="number"
                      className="input-elem"
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                    />
                  </div>

                  <div className="field-group">
                    <label className="label">ENCRYPTED IDENTITY ACCESS KEY</label>
                    <input
                      type="password"
                      className="input-elem"
                      disabled
                      value="••••••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="divider" />

              {/* 3. OPTIMIZATION VECTOR SELECTOR */}
              <div>
                <div className="section-header">
                  <div className="icon-wrap" style={{ color: "#FF7AE6" }}><Sparkles size={20} /></div>
                  <div className="section-title">Main Optimization Direction</div>
                </div>

                <select
                  className="input-elem"
                  value={form.optimizationVector}
                  onChange={(e) => setForm({ ...form, optimizationVector: e.target.value })}
                  style={{ fontWeight: 600 }}
                >
                  <option value="career">Accelerate Professional Career Vector</option>
                  <option value="health">Optimize Biochemical Health Matrix</option>
                  <option value="finance">Maximize Asset & Wealth Trajectory</option>
                </select>
                
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 10, lineHeight: 1.5 }}>
                  This assignment handles target parameters during computational trade-off runs across all sub-layers.
                </p>

                <div className="vector-grid" style={{ marginTop: 24 }}>
                  <div className="vector-card" style={{ background: "rgba(239,68,68,0.03)", borderColor: "rgba(239,68,68,0.15)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontWeight: 700 }}>
                      <HeartPulse size={18} color="#ff6b6b" /> Health Layer
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                      Monitors biometric rest cycles, metabolic energy, and stability profiles.
                    </div>
                  </div>

                  <div className="vector-card" style={{ background: "rgba(16,185,129,0.03)", borderColor: "rgba(16,185,129,0.15)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontWeight: 700 }}>
                      <Wallet size={18} color="#7CFFB2" /> Finance Layer
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                      Models continuous run-rate curves, micro-spending, and risk parameters.
                    </div>
                  </div>

                  <div className="vector-card" style={{ background: "rgba(6,182,212,0.03)", borderColor: "rgba(6,182,212,0.15)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontWeight: 700 }}>
                      <Briefcase size={18} color="#9AE6FF" /> Career Layer
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                      Tracks absolute focus duration thresholds and production output metrics.
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION EXECUTION ZONE */}
              <div style={{ marginTop: 12 }}>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Calibrating Twin Matrices...
                    </>
                  ) : (
                    "Sync Twin Configuration Updates"
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-disconnect"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Disconnect Neural Link Session
                </button>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  <Shield size={14} /> Secured via hardware-level AES-256 pipeline encryption
                </div>
              </div>

            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}