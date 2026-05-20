// src/app/api/terminal/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; 
import { connectDB } from "@/lib/mongodb"; 
import User from "@/models/User";
import Log from "@/models/Log";
import { runSimulation } from "@/lib/simulator"; 
import { buildTwinContext } from "@/lib/aiContextBuilder";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";

// Initialize the Gemini AI Core
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // 1. Authenticate Operator Session
    const session = await getSession();
    if (!session || !session.user?.email || !session.user.id) {
      return NextResponse.json(
        { output: "[-] SECURITY ERROR: Unauthorized neural link. Session invalid." },
        { status: 401 }
      );
    }

    // 2. Parse Terminal Input
    const body = await req.json();
    const commandRaw = body.command || "";
    const command = commandRaw.trim();

    if (!command) {
      return NextResponse.json({ success: true, output: "System listening. Type 'help' for options." });
    }

    await connectDB();

    // 3. Fetch current user profiles and logs
    const [user, recentLogs] = await Promise.all([
      User.findOne({ email: session.user.email }),
      Log.find({ userId: new mongoose.Types.ObjectId(session.user.id) })
        .sort({ date: -1 })
        .limit(21)
        .lean()
    ]);

    if (!user) {
      return NextResponse.json(
        { output: "[-] SYSTEM ERROR: Digital Twin data model not found in DB." },
        { status: 404 }
      );
    }

    // Build the exact behavioral context for the current user
    const twinContext = buildTwinContext(recentLogs);

    // 4. Command Router
    const lowerCommand = command.toLowerCase();

    // Command: HELP
    if (lowerCommand === "help") {
      const helpOutput = `
==================================================
          SYNTRA MISSION CONTROL OS v1.2
==================================================
Available commands:
  help                     Show this command registry
  status                   Digital Twin metrics & sync levels
  goals                    Active SMART goals & milestones
  history                  5 most recent activity logs
  badges                   Achievement registry (earned & locked)
  scan                     Run behavioral anomaly detection
  simulate <d> <change>%   Simulate domain change impact
                           e.g. 'simulate health +35%'
                           e.g. 'simulate career -15%'
  ai <query>               Query Syntra AI Core directly
  clear                    Flush console buffer

Any unrecognized input routes to AI Core.
==================================================
`;
      return NextResponse.json({ success: true, output: helpOutput });
    }

    // Command: CLEAR
    if (lowerCommand === "clear") {
      return NextResponse.json({ 
        success: true, 
        output: "Neural console buffer flushed successfully. Awaiting operator input..." 
      });
    }

    // Command: STATUS / INFO / TWIN
    if (["status", "info", "twin"].includes(lowerCommand)) {
      const health = user.scores.health;
      const finance = user.scores.finance;
      const career = user.scores.career;
      const syntraCore = Math.round((health + finance + career) / 3);

      const statusOutput = `
==================================================
             DIGITAL TWIN STATUS REPORT
==================================================
OPERATOR:       ${user.name}
CORE SYNC:      ${syntraCore}% (Overall Life Sync Index)

DOMAIN INTEGRATION LEVELS:
  💚 Health Score:   ${health}/100 [${health >= 80 ? "EXCELLENT" : health >= 50 ? "NOMINAL" : "CRITICAL"}]
  💰 Finance Score:  ${finance}/100 [${finance >= 80 ? "EXCELLENT" : finance >= 50 ? "NOMINAL" : "CRITICAL"}]
  🚀 Career Score:   ${career}/100 [${career >= 80 ? "EXCELLENT" : career >= 50 ? "NOMINAL" : "CRITICAL"}]

GAMIFICATION ENGINE STATE:
  🔥 Streak Index:   ${user.gamification?.currentStreak ?? 0} days active
  🏆 Score Points:   ${user.gamification?.totalPoints ?? 0} PT
  🏅 Badges Active:  ${user.badges && user.badges.length > 0 ? user.badges.join(", ") : "No badges unlocked yet."}
==================================================
`;
      return NextResponse.json({ success: true, output: statusOutput });
    }

    // Command: SCAN
    if (lowerCommand === "scan") {
      const flags = twinContext?.behaviorFlags ?? [];
      const scanOutput = `
==================================================
           BEHAVIORAL ANOMALY SCAN
==================================================
SCAN STATUS: COMPLETE
ANOMALIES DETECTED: ${flags.length}

${flags.length > 0 
  ? flags.map(f => `  [!] ${f.replace(/_/g, " ").toUpperCase()}`).join("\n")
  : "  [✓] No behavioral anomalies detected."}

RECOMMENDATION:
  ${flags.includes("stress_linked_spending") 
    ? "Stress-spending correlation active. Reduce discretionary exposure." 
    : flags.includes("chronic_sleep_deprivation")
    ? "Sleep deficit accumulating. Prioritize recovery window tonight."
    : "Twin behavioral model operating within normal parameters."}
==================================================
`;
      return NextResponse.json({ success: true, output: scanOutput });
    }

    // Command: BADGES
    if (lowerCommand === "badges") {
      const earned: string[] = user.badges?.length > 0 ? user.badges : [];
      const all: string[] = ["Week Warrior", "Month Master", "Rising Twin", "Savings Streak", "Learning Machine"];
      const locked = all.filter((b: string) => !earned.includes(b));
      
      const badgeOutput = `
==================================================
              ACHIEVEMENT REGISTRY
==================================================
UNLOCKED:
${earned.length > 0 ? earned.map((b: string) => `  [✓] ${b}`).join("\n") : "  No badges unlocked yet."}

LOCKED:
${locked.map((b: string) => `  [🔒] ${b}`).join("\n")}
==================================================
`;
      return NextResponse.json({ success: true, output: badgeOutput });
    }

    // Command: GOALS
    if (lowerCommand === "goals") {
      if (!user.goals || user.goals.length === 0) {
        return NextResponse.json({
          success: true,
          output: `
==================================================
                   ACTIVE GOALS
==================================================
No active goals found.
Use the main dashboard to establish your SMART targets.
==================================================
`
        });
      }

      let goalsOutput = `
==================================================
                   ACTIVE GOALS
==================================================
`;
      user.goals.forEach((goal: any, idx: number) => {
        const target = goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : "N/A";
        goalsOutput += `[${idx + 1}] [${goal.domain.toUpperCase()}] [Priority: ${goal.priority.toUpperCase()}]\n`;
        goalsOutput += `     Title:  ${goal.title}\n`;
        goalsOutput += `     Target: ${target}\n`;
        goalsOutput += `     Milestones:\n`;
        
        if (!goal.milestones || goal.milestones.length === 0) {
          goalsOutput += "       - No milestones defined.\n";
        } else {
          goal.milestones.forEach((milestone: any) => {
            goalsOutput += `       [${milestone.completed ? "x" : " "}] ${milestone.text}\n`;
          });
        }
        goalsOutput += "--------------------------------------------------\n";
      });

      return NextResponse.json({ success: true, output: goalsOutput });
    }

    // Command: HISTORY / LOGS
    if (["history", "logs"].includes(lowerCommand)) {
      if (!recentLogs || recentLogs.length === 0) {
        return NextResponse.json({
          success: true,
          output: `
==================================================
                 ACTIVITY HISTORY
==================================================
No log records found on database.
Log daily biometric logs to seed this dashboard.
==================================================
`
        });
      }

      let historyOutput = `
==================================================
                 ACTIVITY HISTORY
==================================================
`;
      recentLogs.slice(0, 5).forEach((log) => {
        const formattedDate = new Date(log.date).toLocaleDateString() + " " + new Date(log.date).toLocaleTimeString();
        historyOutput += `[${formattedDate}] [${log.domain.toUpperCase()} LOG]\n`;
        historyOutput += `  Metrics: ${JSON.stringify(log.domainData)}\n`;
        historyOutput += "--------------------------------------------------\n";
      });

      return NextResponse.json({ success: true, output: historyOutput });
    }

    // Command: SIMULATE
    const simulateMatch = command.match(/^simulate\s+(health|finance|career)\s+([+-]?\d+)(%?)$/i);
    if (simulateMatch) {
      const domain = simulateMatch[1].toLowerCase() as "health" | "finance" | "career";
      const percentVal = parseInt(simulateMatch[2], 10);
      const percentageChange = percentVal / 100;

      // Run math simulation
      const simulation = runSimulation(
        user.scores.health,
        user.scores.finance,
        user.scores.career,
        { domain, percentageChange }
      );

      // Fetch brief AI projection from Gemini
      let aiMonospaceReport = "Unable to connect to AI Core. Math projection complete.";
      if (process.env.GEMINI_API_KEY) {
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const aiPrompt = `
You are the Syntra Terminal OS AI Core.
Analyze this mathematical projection:
- Target Domain: ${domain} with a proposed ${percentVal}% change.
- Current Scores: Health=${user.scores.health}, Finance=${user.scores.finance}, Career=${user.scores.career}
- Projected Scores (Month 6): Health=${simulation.timeline[6].health}, Finance=${simulation.timeline[6].finance}, Career=${simulation.timeline[6].career}
- Trade-offs Identified: ${simulation.tradeOffs.join(", ") || "None"}
- Risk: ${simulation.riskAssessment}

Deliver a highly concise, hacker-terminal style monospace analysis of this cross-domain feedback loop in exactly 2 sentences. Refer to the user as Operator. Avoid fluff or greetings.
`;
          const aiResult = await model.generateContent(aiPrompt);
          aiMonospaceReport = aiResult.response.text().trim();
        } catch (err) {
          console.error("Gemini Terminal simulation failed:", err);
        }
      }

      const pad = (n: number) => n.toString().padEnd(6);

      const simOutput = `
==================================================
             PREDICTIVE SIMULATION REPORT
==================================================
PROPOSED SHIFT:  ${domain.toUpperCase()} by ${percentVal}%
RISK CLASSIFICATION: ${simulation.riskAssessment.toUpperCase()}

6-MONTH CASCADE PROJECTION:
  Metric     Current Score    Projected Month 6
  ----------------------------------------------
  Health     ${pad(user.scores.health)}     -->   ${simulation.timeline[6].health}
  Finance    ${pad(user.scores.finance)}     -->   ${simulation.timeline[6].finance}
  Career     ${pad(user.scores.career)}     -->   ${simulation.timeline[6].career}

TRADE-OFF INSIGHTS:
${simulation.tradeOffs.map(t => `  * ${t}`).join("\n") || "  * No negative cross-domain trade-offs predicted."}

AI NEURAL INSIGHT:
  ${aiMonospaceReport}
==================================================
`;
      return NextResponse.json({ success: true, output: simOutput });
    }

    // Fallback or explicit "ai" query -> GEMINI AI CORE CHAT
    let userQuery = command;
    if (lowerCommand.startsWith("ai ")) {
      userQuery = command.substring(3).trim();
    }

    let aiOutput = "";
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const systemPrompt = `
You are Syntra OS Terminal, a secure, futuristic cyberpunk CLI assistant mapping a hacker's biometric and digital twin data.
The current user is named "${user.name}".

Digital Twin Metrics: Health=${user.scores.health}/100, Finance=${user.scores.finance}/100, Career=${user.scores.career}/100.
Gamification: Streak=${user.gamification?.currentStreak ?? 0} days, Points=${user.gamification?.totalPoints ?? 0} PT.

Behavior Flags: ${twinContext.behaviorFlags.join(", ") || "none"}
Weekly Averages: Sleep ${twinContext.weeklyAverages.sleep}hrs, Stress ${twinContext.weeklyAverages.stress}/10

Address the user as 'Operator'. Speak in a concise, command-line system-report format. Keep your response under 100 words. Provide helpful, actionable advice about their goals, scores, or behavioral flags. Respond as if printing directly to a hacker terminal.
`;
        const chatPrompt = `${systemPrompt}\n\nOperator Input: ${userQuery}`;
        const aiResult = await model.generateContent(chatPrompt);
        aiOutput = aiResult.response.text().trim();
      } catch (err) {
        console.error("Gemini AI Core call failed:", err);
        aiOutput = "[-] SYSTEM ERROR: Core neural connection timed out.";
      }
    } else {
      aiOutput = "[-] CONNECTION ERROR: AI Core is currently offline (API key missing).";
    }

    const aiResponse = `
==================================================
                SYNTRA AI RESPONSE
==================================================
${aiOutput}
==================================================
`;
    return NextResponse.json({ success: true, output: aiResponse });

  } catch (error: any) {
    console.error("[TERMINAL ERROR]", error);
    return NextResponse.json({ 
      output: `[-] FATAL EXCEPTION: Internal system failure.\n    Details: ${error.message || "Unknown error"}` 
    }, { status: 500 });
  }
}