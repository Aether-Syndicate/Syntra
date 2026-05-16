// src/app/api/twin/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; 
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb"; 
import User from "@/models/User";
import { decryptData } from "@/lib/encryption";

// 1. Decryptor Helper
const decryptLogs = (logs: any[]) => {
  return logs.map(log => {
    try {
      const decryptedString = decryptData(log.encryptedData);
      return { timestamp: log.timestamp, data: JSON.parse(decryptedString) };
    } catch (error) {
      return null;
    }
  }).filter(Boolean); 
};

// 2. NEW: The Trend Analyzer for the AI
// Compares the oldest and newest logs in a set to determine the behavioral trajectory
const calculateTrend = (logs: any[], metricKey: string) => {
  if (!logs || logs.length < 2) return "insufficient_data";
  
  const oldestVal = logs[0].data[metricKey];
  const newestVal = logs[logs.length - 1].data[metricKey];
  
  if (typeof oldestVal !== 'number' || typeof newestVal !== 'number') return "stable";

  // If the newest value is 10% higher or lower, flag the trend
  if (newestVal > oldestVal * 1.1) return "rising";
  if (newestVal < oldestVal * 0.9) return "declining";
  return "stable";
};

export async function GET(req: Request) {
  try {
    // 3. SECURE VAULT
    const session = await getServerSession(authOptions);
    // Temporary Hackathon Bypass:
    const userEmail = session?.user?.email || "test@syntra.com"; 

    await connectDB();
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Fetch and Decrypt the recent history
    const recentHealth = decryptLogs(user.healthLogs.slice(-7)); // Last 7 entries
    const recentFinance = decryptLogs(user.financeLogs.slice(-7));
    const recentCareer = decryptLogs(user.careerLogs.slice(-7));

    // 5. STRUCTURE THE AI-READY JSON (Priority 1 Complete)
    const aiContextPayload = {
      healthScore: user.healthScore,
      financeScore: user.financeScore,
      careerScore: user.careerScore,
      recentPatterns: {
        sleepTrend: calculateTrend(recentHealth, "sleepHours"),
        stressTrend: calculateTrend(recentHealth, "stressLevel"),
        spendingTrend: calculateTrend(recentFinance, "expenses"),
        studyConsistency: calculateTrend(recentCareer, "studyHours")
      },
      // We pass the raw data too, just in case Gemini needs specific numbers for meal/workout plans
      recentHistory: {
        health: recentHealth,
        finance: recentFinance,
        career: recentCareer
      }
    };

    return NextResponse.json({ 
      success: true, 
      twin: aiContextPayload 
    }, { status: 200 });

  } catch (error: any) {
    console.error("AI CONTEXT API ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}