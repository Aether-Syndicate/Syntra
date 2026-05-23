"use client";

import { useEffect, useState } from "react";
import {
  HeartPulse,
  Wallet,
  Briefcase,
  Trash2,
  Target,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

type Milestone = {
  text: string;
  completed: boolean;
};

type Goal = {
  _id?: string;
  title: string;
  domain: "health" | "finance" | "career";
  priority: string;
  targetDate?: string;
  milestones?: Milestone[];
};

export default function GoalsPage() {
  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Theme state synced with layout/ingestion styling
  const [isLight, setIsLight] = useState(false);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState<Goal["domain"]>("health");
  const [priority, setPriority] = useState("medium");
  const [targetDate, setTargetDate] = useState("");
  const [milestoneInput, setMilestoneInput] = useState("");
  const [milestones, setMilestones] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =========================================================
  // FETCH GOALS
  // =========================================================
  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/goals", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setGoals(data.goals);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchGoals();
  }, []);

  // =========================================================
  // CREATE GOAL
  // =========================================================
  const addMilestone = () => {
    if (!milestoneInput.trim()) return;
    setMilestones([...milestones, milestoneInput]);
    setMilestoneInput("");
  };

  const createGoal = async () => {
    if (!title.trim()) {
      setMessage("Goal title required.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          domain,
          priority,
          targetDate: targetDate || undefined,
          milestones: milestones.map((m) => ({
            text: m,
            completed: false,
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGoals(data.goals);
        setTitle("");
        setPriority("medium");
        setDomain("health");
        setTargetDate("");
        setMilestones([]);
        setMilestoneInput("");
        setMessage("Goal created successfully.");
      } else {
        setMessage(data.error || "Failed to create goal.");
      }
    } catch (error) {
      setMessage("Goal creation failed.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DELETE GOAL
  // =========================================================
  const deleteGoal = async (goalId: string) => {
    try {
      const res = await fetch("/api/goals", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          goalId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGoals(data.goals);
        setMessage("Goal removed.");
      } else {
        setMessage("Failed to remove goal.");
      }
    } catch (error) {
      setMessage("Delete failed.");
    }
  };

  // Wait until mounted on client side to render to match server markup
  if (!mounted) {
    return null;
  }

  return (
    <div className={isLight ? "light-theme" : ""}>
      <style>{`
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
          font-family: sans-serif;
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
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .title {
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
        @media (min-width: 768px) {
          .grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1100px) {
          .grid { grid-template-columns: repeat(3, 1fr); }
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
          color: var(--text-main);
        }
        .card-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .inputs-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          margin-bottom: 20px;
        }
        @media (min-width: 1024px) {
          .inputs-row { grid-template-columns: 2fr 1fr 1fr 1fr 1fr; }
        }
        .label {
          display: block;
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
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .input:focus {
          outline: none;
          border-color: var(--text-main);
          background: var(--input-focus);
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
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn:disabled { opacity: 0.4; transform: none; cursor: not-allowed; }
        
        .btn-delete {
          width: 40px; height: 40px;
          border-radius: 12px;
          border: 1px solid rgba(255, 107, 107, 0.2);
          background: rgba(255, 107, 107, 0.1);
          color: #ff6b6b;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .btn-delete:hover {
          background: rgba(255, 107, 107, 0.25);
          border-color: #ff6b6b;
          transform: scale(1.05);
        }
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
        .badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 8px;
          text-transform: uppercase;
        }
        .footer-note {
          margin-top: 48px;
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      `}</style>

      <div className="viewport">
        <div className="grain" />
        <div className="container">
          
          {/* HEADER */}
          <section className="header-card">
            <div className="tag">Syntra Goal Matrix</div>
            <h1 className="title">Goals & Missions</h1>
            <p className="subtitle">
              Define your health, financial, and career objectives. Syntra continuously aligns 
              your behavioral intelligence matrix with your long-term optimal trajectory.
            </p>
          </section>

          {/* GLOBAL FEEDBACK MESSAGE */}
          {message && (
            <div
              className="message"
              style={{
                borderColor: message.includes("failed") || message.includes("required") || message.includes("Failed") ? "rgba(255,107,107,0.25)" : "rgba(124,255,178,0.25)",
                background: message.includes("failed") || message.includes("required") || message.includes("Failed") ? "rgba(255,107,107,0.12)" : "rgba(124,255,178,0.12)",
                color: message.includes("failed") || message.includes("required") || message.includes("Failed") ? "#ff9a9a" : "#b9ffd6",
              }}
            >
              {message.includes("failed") || message.includes("required") || message.includes("Failed") ? (
                <ShieldAlert size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
              <span>{message}</span>
            </div>
          )}

          {/* CREATE GOAL INTERFACE */}
          <section className="card" style={{ marginBottom: 32 }}>
            <div className="card-header">
              <div className="icon-wrap" style={{ background: "rgba(192, 132, 252, 0.18)" }}>
                <Target color="#c084fc" />
              </div>
              <div>
                <div className="card-title">Create Goal</div>
                <div className="card-sub">Add a new mission objective</div>
              </div>
            </div>

            <div className="inputs-row">
              <div>
                <label className="label">Objective Title</label>
                <input
                  type="text"
                  placeholder="e.g., Run 5k under 25 minutes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input"
                  style={{ height: 50 }}
                />
              </div>

              <div>
                <label className="label">Vector Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as Goal["domain"])}
                  className="input"
                  style={{ height: 50 }}
                >
                  <option value="health">Health</option>
                  <option value="finance">Finance</option>
                  <option value="career">Career</option>
                </select>
              </div>

              <div>
                <label className="label">Priority Layer</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="input"
                  style={{ height: 50 }}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label className="label">Target Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="input"
                  style={{ height: 50 }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button className="btn" disabled={loading} onClick={createGoal} style={{ height: 50 }}>
                  {loading ? "Constructing..." : "Establish Goal"}
                </button>
              </div>
            </div>

            {/* MILESTONES COMPONENT BLOCK */}
            <div style={{ marginTop: 20 }}>
              <label className="label">Milestones</label>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  value={milestoneInput}
                  onChange={(e) => setMilestoneInput(e.target.value)}
                  placeholder="Add milestone"
                  className="input"
                  style={{ height: 50 }}
                />
                <button className="btn" type="button" onClick={addMilestone} style={{ width: 120, height: 50 }}>
                  Add
                </button>
              </div>

              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {milestones.map((m, i) => (
                  <div key={i} className="badge" style={{ background: "rgba(255,255,255,0.08)" }}>
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ACTIVE GOALS MATRIX GRID */}
          <section className="grid">
            {goals.length === 0 && (
              <div className="card">
                <div className="card-title">No Active Goals</div>
                <p style={{ color: "var(--text-muted)", marginTop: 10, lineHeight: 1.6 }}>
                  Create your first mission objective to begin Syntra optimization.
                </p>
              </div>
            )}
            
            {goals.map((goal, index) => {
              let iconBackground = "rgba(248, 113, 113, 0.18)";
              let iconElement = <HeartPulse color="#f87171" />;

              if (goal.domain === "finance") {
                iconBackground = "rgba(52, 211, 153, 0.18)";
                iconElement = <Wallet color="#34d399" />;
              } else if (goal.domain === "career") {
                iconBackground = "rgba(34, 211, 238, 0.18)";
                iconElement = <Briefcase color="#22d3ee" />;
              }

              return (
                <div className="card" key={goal._id || index} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div className="card-header" style={{ marginBottom: 24, justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div className="icon-wrap" style={{ background: iconBackground }}>
                          {iconElement}
                        </div>
                        <div>
                          <div className="card-sub">{goal.domain}</div>
                          <h3 className="card-title" style={{ marginTop: 2, fontSize: "1.15rem", lineHeight: 1.4 }}>
                            {goal.title}
                          </h3>
                          {goal.targetDate && (
                            <div style={{ marginTop: 12, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                              Target: {new Date(goal.targetDate).toLocaleDateString()}
                            </div>
                          )}
                          
                          {goal.milestones && goal.milestones.length > 0 && (
                            <div style={{ marginTop: 14 }}>
                              {goal.milestones.map((milestone, idx) => (
                                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: "0.82rem" }}>
                                  <CheckCircle2 size={14} color={milestone.completed ? "#7CFFB2" : "#777"} />
                                  <span>{milestone.text}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button 
                        className="btn-delete" 
                        onClick={() => {
                          if (!goal._id) return;

                          if (confirm("Delete this goal?")) {
                            deleteGoal(goal._id);
                          }
                        }}
                        title="Decommission goal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid var(--stroke)" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      PRIORITY LEVEL:
                    </span>
                    <span 
                      className="badge"
                      style={{
                        background: goal.priority === "high" 
                          ? "rgba(255, 107, 107, 0.15)" 
                          : goal.priority === "medium" 
                          ? "rgba(245, 158, 11, 0.15)" 
                          : "rgba(16, 185, 129, 0.15)",
                        color: goal.priority === "high" 
                          ? "#ff8b8b" 
                          : goal.priority === "medium" 
                          ? "#fbbf24" 
                          : "#34d399",
                        border: goal.priority === "high" 
                          ? "1px solid rgba(255, 107, 107, 0.2)" 
                          : goal.priority === "medium" 
                          ? "1px solid rgba(245, 158, 11, 0.2)" 
                          : "1px solid rgba(16, 185, 129, 0.2)"
                      }}
                    >
                      {goal.priority}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Footer baseline branding */}
          <div className="footer-note">
            Syntra: Your health, money, and career in one view.
          </div>
        </div>
      </div>
    </div>
  );
}