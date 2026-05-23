"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

/**
 * AVATAR_OPTIONS: Mapping the core Digital Twin personas.
 * These represent the different visual interfaces for the user's twin.
 * Synchronized with the Profile configuration metrics.
 */
const AVATAR_OPTIONS = [
  {
    id: 1,
    name: "Cyberpunk / Techwear",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    id: 2,
    name: "Minimalist / Creative",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    id: 3,
    name: "Neon / Synthwave",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    id: 4,
    name: "Corporate / Executive",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80",
  },
];

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLight, setIsLight] = useState(false); // Consistent with Home/Login theme logic

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    avatarId: 1, 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize your Twin.");
      }

      // Automatically sign in upon successful registration
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl: "/dashboard",
        redirect: true,
      });
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={isLight ? "light-theme" : ""}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        :root {
          --bg-gradient: radial-gradient(1200px 800px at 10% -10%, rgba(255,255,255,0.06), transparent 50%),
                         radial-gradient(1400px 900px at 110% 10%, rgba(255,255,255,0.05), transparent 55%),
                         #000;
          --text-main: #fff;
          --text-muted: rgba(255,255,255,0.5);
          --accent-grad: linear-gradient(90deg, #9AE6FF, #9B8CFF 45%, #FF7AE6 90%);
          --glass: rgba(15, 15, 15, 0.7);
          --stroke: rgba(255, 255, 255, 0.12);
          --input-bg: rgba(255, 255, 255, 0.03);
          --input-focus: rgba(255, 255, 255, 0.08);
          --glow: rgba(154, 230, 255, 0.15);
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
          font-family: 'Space Mono', monospace;
          color: var(--text-main);
        }

        .signup-viewport {
          min-height: 100vh;
          background: var(--bg-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          position: relative;
        }

        .grain::after {
          content: ''; position: fixed; inset: -50%; width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 10; opacity: 0.18;
        }

        .signup-card {
          width: 100%;
          max-width: 550px;
          background: var(--glass);
          border: 1px solid var(--stroke);
          border-radius: 24px;
          padding: 40px;
          backdrop-filter: blur(24px);
          z-index: 20;
          box-shadow: 0 0 40px var(--glow);
        }

        .card-header { margin-bottom: 32px; text-align: center; }
        .theme-label { font-family: 'Courier Prime', monospace; font-size: 0.7rem; color: var(--text-muted); letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 8px; }
        .brand-title { font-family: 'Bebas Neue', sans-serif; font-size: 2.8rem; line-height: 1; letter-spacing: 0.04em; background: var(--accent-grad); -webkit-background-clip: text; color: transparent; }

        .section-tag { font-family: 'Courier Prime', monospace; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px; display: block; }
        
        .avatar-grid { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 12px; 
          margin-bottom: 24px; 
        }
        
        .avatar-box {
          position: relative;
          cursor: pointer; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: flex-end;
          border-radius: 12px; 
          border: 1px solid var(--stroke);
          background: #111; 
          transition: 0.2s ease;
          aspect-ratio: 1;
          overflow: hidden;
          padding: 0;
        }
        .avatar-box::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 65%, transparent 100%);
          z-index: 2;
        }
        .avatar-box.active { border-color: #9AE6FF; transform: translateY(-2px); box-shadow: 0 4px 15px var(--glow); }
        
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .avatar-name { 
          font-size: 0.55rem; 
          font-family: 'Space Mono', monospace; 
          font-weight: 700;
          color: #fff; 
          z-index: 3;
          text-align: center;
          padding: 8px 4px;
          line-height: 1.2;
        }

        .input-group { margin-bottom: 16px; }
        .form-input {
          width: 100%; background: var(--input-bg); border: 1px solid var(--stroke);
          border-radius: 12px; padding: 14px 16px; color: var(--text-main);
          font-family: 'Space Mono', monospace; font-size: 0.85rem; transition: 0.2s;
          box-sizing: border-box;
        }
        .form-input:focus { outline: none; border-color: var(--text-main); background: var(--input-focus); }

        .btn-create {
          width: 100%; padding: 18px; border-radius: 12px; border: none;
          background: var(--text-main); color: #000;
          font-family: 'Space Mono', monospace; font-weight: 700; font-size: 0.9rem;
          cursor: pointer; transition: 0.2s; margin-top: 10px;
        }
        .btn-create:hover { transform: translateY(-2px); opacity: 0.9; }
        .btn-create:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .error-msg { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; padding: 12px; border-radius: 10px; font-size: 0.75rem; margin-bottom: 16px; text-align: center; }

        .auth-footer { margin-top: 24px; font-family: 'Courier Prime', monospace; font-size: 0.75rem; text-align: center; color: var(--text-muted); }
        .auth-link { color: var(--text-main); text-decoration: none; border-bottom: 1px solid var(--stroke); }

        .trust-badge { margin-top: 20px; font-family: 'Courier Prime', monospace; font-size: 0.6rem; color: var(--text-muted); opacity: 0.6; display: flex; align-items: center; justify-content: center; gap: 6px; }

        @media (max-width: 600px) {
          .signup-card { padding: 32px 20px; border: none; background: transparent; box-shadow: none; }
          .avatar-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>

      <div className="signup-viewport">
        <div className="grain" />
        
        <main className="signup-card">
          <header className="card-header">
            <div className="theme-label">Project your future</div>
            <h1 className="brand-title">Create Your Mirror</h1>
          </header>

          <form onSubmit={handleRegister}>
            {/* Interface Selection */}
            <span className="section-tag">Choose Your Interface</span>
            <div className="avatar-grid">
              {AVATAR_OPTIONS.map((avatar) => (
                <div
                  key={avatar.id}
                  onClick={() => setFormData({ ...formData, avatarId: avatar.id })}
                  className={`avatar-box ${formData.avatarId === avatar.id ? "active" : ""}`}
                >
                  <img src={avatar.image} alt={avatar.name} className="avatar-img" />
                  <span className="avatar-name">{avatar.name.split(" / ")[0]}</span>
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && <div className="error-msg">{error}</div>}

            {/* Inputs */}
            <div className="input-group">
              <input
                type="text"
                name="name"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                required
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <input
                type="password"
                name="password"
                required
                placeholder="Secret Key"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                style={{ flex: 2 }}
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className="form-input"
                style={{ flex: 1 }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-create">
              {loading ? "Aligning Patterns..." : "Wake Your Twin"}
            </button>
          </form>

          <footer className="auth-footer">
            Already have a reflection? <Link href="/login" className="auth-link">Step Inside</Link>
          </footer>

          <div className="trust-badge">
            <span>🔒</span> Secured via AES-256 Encryption & PII Anonymization
          </div>
        </main>
      </div>
    </div>
  );
}