"use client";
import { useState } from "react";

export default function DashboardTest() {
  const [response, setResponse] = useState<string>("System Ready. Awaiting command...");

  // 1. INGEST DATA
  const testLogData = async () => {
    setResponse("Encrypting and saving data to MongoDB...");
    try {
      const res = await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: "health",
          data: { sleepHours: 8, workoutMinutes: 45, stressLevel: 2 }
        })
      });
      const data = await res.json();
      setResponse("LOG RESPONSE:\n" + JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResponse("Error: " + error.message);
    }
  };

  // 2. FETCH DECRYPTED DASHBOARD
  const testDashboardFetch = async () => {
    setResponse("Fetching and decrypting dashboard data...");
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      setResponse("DASHBOARD DATA:\n" + JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResponse("Error: " + error.message);
    }
  };

  // 3. RUN SIMULATOR
  const testSimulator = async () => {
    setResponse("Running cross-domain math simulation...");
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: { domain: "health", percentageChange: 0.3 }
        })
      });
      const data = await res.json();
      setResponse("SIMULATOR PROJECTION:\n" + JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResponse("Error: " + error.message);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", color: "white", backgroundColor: "#111", minHeight: "100vh" }}>
      <h1 style={{ color: "#0f0" }}>🛠️ Syntra Mission Control</h1>
      <p style={{ marginBottom: "2rem" }}>Test the endpoints before the frontend team wakes up.</p>
      
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <button onClick={testLogData} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#333", color: "white", border: "1px solid #555", borderRadius: "4px" }}>
          1. Log Health Data (POST)
        </button>
        <button onClick={testDashboardFetch} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#333", color: "white", border: "1px solid #555", borderRadius: "4px" }}>
          2. Fetch Dashboard (GET)
        </button>
        <button onClick={testSimulator} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#333", color: "white", border: "1px solid #555", borderRadius: "4px" }}>
          3. Run Simulator (POST)
        </button>
      </div>
      
      <pre style={{ background: "#000", color: "#0f0", padding: "1rem", borderRadius: "8px", minHeight: "300px", overflowX: "auto", border: "1px solid #333" }}>
        {response}
      </pre>
    </div>
  );
}