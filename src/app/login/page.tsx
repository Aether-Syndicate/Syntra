"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * SYNTRA LOGIN PORTAL
 * A clean, dark interface focused on your Personal Digital Twin.
 */
export default function LoginPage() {

  const [isLight, setIsLight] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {

        setError("Invalid email or password.");

        setLoading(false);

        return;
      }

      router.push("/dashboard");

    } catch (err) {

      setError("Something went wrong.");

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
          overflow: hidden;
        }

        .login-viewport {
          min-height: 100vh;
          background: var(--bg-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
        }

        .grain::after {
          content: ''; position: fixed; inset: -50%; width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 10; opacity: 0.18;
        }

        .login-card {
          width: 100%;
          max-width: 460px;
          background: var(--glass);
          border: 1px solid var(--stroke);
          border-radius: 20px;
          padding: 48px;
          backdrop-filter: blur(24px);
          z-index: 20;
          box-shadow: 0 0 40px var(--glow);
        }

        .card-header { margin-bottom: 32px; }
        .theme-label { font-family: 'Courier Prime', monospace; font-size: 0.7rem; color: var(--text-muted); letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 8px; }
        .brand-title { font-family: 'Bebas Neue', sans-serif; font-size: 3.2rem; line-height: 1; letter-spacing: 0.04em; background: var(--accent-grad); -webkit-background-clip: text; color: transparent; }

        .input-wrapper { margin-bottom: 24px; }
        .input-label { display: block; font-family: 'Courier Prime', monospace; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px; }
        
        .terminal-input {
          width: 100%;
          background: var(--input-bg);
          border: 1px solid var(--stroke);
          border-radius: 12px;
          padding: 16px;
          color: var(--text-main);
          font-family: 'Space Mono', monospace;
          transition: all 0.2s;
        }

        .terminal-input:focus {
          outline: none;
          border-color: var(--text-main);
          background: var(--input-focus);
        }

        .btn-enter {
          width: 100%;
          padding: 18px;
          border-radius: 12px;
          border: none;
          background: var(--text-main);
          color: #000;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-enter:hover { transform: translateY(-2px); }

        .auth-footer { margin-top: 32px; font-family: 'Courier Prime', monospace; font-size: 0.8rem; text-align: center; color: var(--text-muted); }
        .auth-link { color: var(--text-main); text-decoration: none; border-bottom: 1px solid var(--stroke); transition: 0.2s; }
        .auth-link:hover { border-color: var(--text-main); }

        .sys-message {
          position: absolute; bottom: 30px; font-family: 'Courier Prime', monospace; 
          font-size: 0.65rem; color: var(--text-muted); text-align: center; width: 100%;
        }

        @media (max-width: 600px) {
          .login-card { padding: 32px 20px; border: none; background: transparent; }
        }
      `}</style>

      <div className="login-viewport">
        <div className="grain" />
        
        <main className="login-card">
          <header className="card-header">
            <div className="theme-label">Unified Intelligence</div>
            <h1 className="brand-title">Step Inside</h1>
          </header>

          <form onSubmit={handleLogin}>

            <div className="input-wrapper">
              <label className="input-label">Your Email</label>

              <input
                type="email"
                className="terminal-input"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-wrapper">
              <label className="input-label">Password</label>

              <input
                type="password"
                className="terminal-input"
                placeholder="Your secret key"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <Link href="#" className="auth-link" style={{ fontSize: '0.7rem' }}>
                Lost your way?
              </Link>
            </div>

            {error && (
              <div
                style={{
                  color: "#ff6b6b",
                  marginBottom: "18px",
                  fontSize: "0.8rem",
                  fontFamily: "Courier Prime, monospace",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-enter"
              disabled={loading}
            >
              {loading ? "Initializing..." : "Wake My Twin"}
            </button>
          </form>

          <footer className="auth-footer">
            New here? <Link href="/signup" className="auth-link">Create Your Mirror</Link>
          </footer>
        </main>

        <div className="sys-message">
          Syntra: Your health, money, and career in one view.
        </div>
      </div>
    </div>
  );
}