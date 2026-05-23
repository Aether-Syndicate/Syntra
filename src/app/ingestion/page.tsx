"use client";

import { useEffect, useState } from "react";
import {
  HeartPulse,
  Wallet,
  Briefcase,
  Upload,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

export default function IngestionPage() {
  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Theme (kept for parity with login page, can be wired to a toggle if desired)
  const [isLight, setIsLight] = useState(false);

  // =========================================================
  // HEALTH
  // =========================================================
  const [sleepHours, setSleepHours] = useState("");
  const [workoutMinutes, setWorkoutMinutes] = useState("");
  const [stressLevel, setStressLevel] = useState("");
  const [moodScore, setMoodScore] = useState("");
  const [energyLevel, setEnergyLevel] = useState("");
  const [caloriesConsumed, setCaloriesConsumed] = useState("");
  const [calorieGoal, setCalorieGoal] = useState("");
  // =========================================================
  // FINANCE
  // =========================================================
  const [amountSaved, setAmountSaved] = useState("");
  const [discretionarySpent, setDiscretionarySpent] = useState("");
  const [spendingCategory, setSpendingCategory] = useState("food");

  // =========================================================
  // CAREER
  // =========================================================
  const [hoursStudied, setHoursStudied] = useState("");
  const [productivityRating, setProductivityRating] = useState("");
  const [sessionsCompleted, setSessionsCompleted] = useState("");
  const [courseName, setCourseName] = useState("");

  // =========================================================
  // CSV
  // =========================================================
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvDomain, setCsvDomain] = useState("health");

  // =========================================================
  // GLOBAL
  // =========================================================
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =========================================================
 

  useEffect(() => {
    setMounted(true);
  }, []);

  // =========================================================
  // SUBMITS
  // =========================================================
  const submitHealth = async () => {
   
    try {
      setLoading(true);
      const res = await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          domain: "health",
          data: {
            sleepHours: Number(sleepHours),
            workoutMinutes: Number(workoutMinutes),
            stressLevel: Number(stressLevel),
            moodScore: moodScore ? Number(moodScore) : undefined,
            energyLevel: energyLevel ? Number(energyLevel) : undefined,
            caloriesConsumed: caloriesConsumed ? Number(caloriesConsumed) : undefined,
            calorieGoal: calorieGoal ? Number(calorieGoal) : undefined,
          },
        }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (data.success) {
        
      
        setSleepHours("");
        setWorkoutMinutes("");
        setStressLevel("");
        setMoodScore("");
        setEnergyLevel("");
        setCaloriesConsumed("");
        setCalorieGoal("");
        window.dispatchEvent(new Event("syntra-refresh"));
      }
    } catch {
      setMessage("Health ingestion failed.");
    } finally {
      setLoading(false);
    }
  };

  const submitFinance = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          domain: "finance",
          data: {
            amountSaved: Number(amountSaved),
            discretionarySpent: Number(discretionarySpent),
            spendingCategory,
          },
        }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (data.success) {
        setAmountSaved("");
        setDiscretionarySpent("");
        setSpendingCategory("food");
        window.dispatchEvent(new Event("syntra-refresh"));
      }
    } catch {
      setMessage("Finance ingestion failed.");
    } finally {
      setLoading(false);
    }
  };

  const submitCareer = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          domain: "career",
          data: {
            hoursStudied: Number(hoursStudied),
            productivityRating: Number(productivityRating),
            sessionsCompleted: sessionsCompleted ? Number(sessionsCompleted) : undefined,
            courseName: courseName || undefined,
          },
        }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (data.success) {
        setHoursStudied("");
        setProductivityRating("");
        setSessionsCompleted("");
        setCourseName("");
        window.dispatchEvent(new Event("syntra-refresh"));
      }
    } catch {
      setMessage("Career ingestion failed.");
    } finally {
      setLoading(false);
    }
  };

  const uploadCSV = async () => {
    if (!csvFile) {
      setMessage("Please select a CSV file.");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", csvFile);
      formData.append("domain", csvDomain);

      const res = await fetch("/api/upload/csv", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      setMessage(data.message || "CSV uploaded.");
    } catch {
      setMessage("CSV upload failed.");
    } finally {
      setLoading(false);
    }
  };

  // Wait until mounted on client side to render to match server markup
  if (!mounted) {
    return null;
  }

  return (
    <div className={isLight ? "light-theme" : ""}>
      <style>{`
        @import url('fonts.googleapis.com');

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
          font-family: 'Space Mono', monospace;
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
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 5; opacity: 0.18;
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
          font-family: 'Courier Prime', monospace;
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .title {
          font-family: 'Bebas Neue', sans-serif;
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
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 1100px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
          }
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
          width: 52px; height: 52px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
        }
        .card-title {
          font-weight: 700;
          font-size: 1.25rem;
        }
        .card-sub {
          font-family: 'Courier Prime', monospace;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .alert {
          border-radius: 14px;
          padding: 12px 14px;
          font-size: 0.85rem;
          margin-bottom: 14px;
          border: 1px solid rgba(255, 107, 107, 0.25);
          background: rgba(255, 107, 107, 0.12);
        }
        .inputs {
          display: grid;
          gap: 14px;
        }
        .label {
          display: block;
          font-family: 'Courier Prime', monospace;
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
          font-family: 'Space Mono', monospace;
          transition: all 0.2s;
        }
        .input:focus {
          outline: none;
          border-color: var(--text-main);
          background: var(--input-focus);
        }
        .input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .input option {
          background-color: #111111;
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
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn:disabled { opacity: 0.4; transform: none; cursor: not-allowed; }
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
        .footer-note {
          margin-top: 26px;
          text-align: center;
          font-family: 'Courier Prime', monospace;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      `}</style>
      <div className="viewport">
        <div className="grain" />
        <div className="container">
          {/* Header */}
          <section className="header-card">
            <div className="tag">Syntra Data Ingestion</div>
            <h1 className="title">Feed Your AI Twin</h1>
            <p className="subtitle">
              Track your daily health, finances, and career growth. Syntra continuously analyzes
              your behavioral patterns and updates your personal intelligence model.
            </p>
          </section>
          {/* Global message */}
          {message && (
            <div
              className="message"
              style={{
                borderColor: message.includes("failed") || message.includes("already") ? "rgba(255,107,107,0.25)" : "rgba(124,255,178,0.25)",
                background: message.includes("failed") || message.includes("already") ? "rgba(255,107,107,0.12)" : "rgba(124,255,178,0.12)",
                color: message.includes("failed") || message.includes("already") ? "#ff9a9a" : "#b9ffd6",
              }}
            >
              {message.includes("failed") || message.includes("already") ? (
                <ShieldAlert size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
              <span>{message}</span>
            </div>
          )}
          {/* Grid */}
          <section className="grid">
            {/* Health */}
            <div className="card">
              <div className="card-header">
                <div className="icon-wrap" style={{ background: "rgba(248, 113, 113, 0.18)" }}>
                  <HeartPulse color="#f87171" />
                </div>
                <div>
                  <div className="card-title">Health</div>
                  <div className="card-sub">Daily wellness tracking</div>
                </div>
              </div>
              <div className="inputs">
                <Field
                  label="Sleep Hours"
                  type="number"
                  value={sleepHours}
                  onChange={setSleepHours}
  
                />
                <Field
                  label="Workout Minutes"
                  type="number"
                  value={workoutMinutes}
                  onChange={setWorkoutMinutes}

                />
                <Field
                  label="Stress Level (1-10)"
                  type="number"
                  value={stressLevel}
                  onChange={setStressLevel}
  
                />
                <Field
                  label="Mood Score (1-10)"
                  type="number"
                  value={moodScore}
                  onChange={setMoodScore}

                />
                <Field
                  label="Energy Level (1-10)"
                  type="number"
                  value={energyLevel}
                  onChange={setEnergyLevel}

                />
                <Field
                  label="Calories Consumed"
                  type="number"
                  value={caloriesConsumed}
                  onChange={setCaloriesConsumed}

                />
                <Field
                  label="Calorie Goal"
                  type="number"
                  value={calorieGoal}
                  onChange={setCalorieGoal}

                />
                <button className="btn" onClick={submitHealth}>
                  {loading ? "Updating..." : "Update Health"}
                </button>
              </div>
            </div>
            {/* Finance */}
            <div className="card">
              <div className="card-header">
                <div className="icon-wrap" style={{ background: "rgba(52, 211, 153, 0.18)" }}>
                  <Wallet color="#34d399" />
                </div>
                <div>
                  <div className="card-title">Finance</div>
                  <div className="card-sub">Financial behavior tracking</div>
                </div>
              </div>
              <div className="inputs">
                <Field
                  label="Amount Saved"
                  type="number"
                  value={amountSaved}
                  onChange={setAmountSaved}
    
                />
                <Field
                  label="Discretionary Spending"
                  type="number"
                  value={discretionarySpent}
                  onChange={setDiscretionarySpent}
      
                />
                <div>
                  <label className="label">Spending Category</label>
                  <select
                    value={spendingCategory}
                    onChange={(e) => setSpendingCategory(e.target.value)}
                    className="input"
                
                    style={{ height: 48 }}
                  >
                    <option value="food">Food</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="shopping">Shopping</option>
                    <option value="transport">Transport</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button className="btn"  onClick={submitFinance}>
                  {loading ? "Updating..." : "Update Finance"}
                </button>
              </div>
            </div>
            {/* Career */}
            <div className="card">
              <div className="card-header">
                <div className="icon-wrap" style={{ background: "rgba(34, 211, 238, 0.18)" }}>
                  <Briefcase color="#22d3ee" />
                </div>
                <div>
                  <div className="card-title">Career</div>
                  <div className="card-sub">Productivity & learning</div>
                </div>
              </div>
              <div className="inputs">
                <Field
                  label="Hours Studied"
                  type="number"
                  value={hoursStudied}
                  onChange={setHoursStudied}
                />
                <Field
                  label="Productivity Rating (1-10)"
                  type="number"
                  value={productivityRating}
                  onChange={setProductivityRating}
                />
                <Field
                  label="Sessions Completed"
                  type="number"
                  value={sessionsCompleted}
                  onChange={setSessionsCompleted}
                />
                <Field
                  label="Course Name"
                  type="text"
                  value={courseName}
                  onChange={setCourseName}
                />
                <button className="btn" onClick={submitCareer}>
               {loading ? "Updating..." : "Update Career"}
                </button>
              </div>
            </div>
          </section>
          {/* CSV Upload */}
          <section className="card" style={{ marginTop: 20 }}>
            <div className="card-header">
              <div className="icon-wrap" style={{ background: "rgba(192, 132, 252, 0.18)" }}>
                <Upload color="#c084fc" />
              </div>
              <div>
                <div className="card-title">CSV Upload</div>
                <div className="card-sub">Bulk ingestion for advanced tracking</div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 14,
              }}
            >
              <div>
                <label className="label">Domain</label>
                <select
                  value={csvDomain}
                  onChange={(e) => setCsvDomain(e.target.value)}
                  className="input"
                  style={{ height: 48 }}
                >
                  <option value="health">Health</option>
                  <option value="finance">Finance</option>
                  <option value="career">Career</option>
                </select>
              </div>
              <div>
                <label className="label">CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  className="input"
                  style={{ paddingTop: 10, paddingBottom: 10 }}
                />
              </div>
              <button className="btn" disabled={loading} onClick={uploadCSV}>
                {loading ? "Uploading..." : "Upload CSV"}
              </button>
            </div>
          </section>
          <div className="footer-note">
            Syntra: Your health, money, and career in one view.
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  disabled,
}: {
  label: string;
  type: string;
  value: string | number;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="input"
      />
    </div>
  );
}