// src/app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; 
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb"; 
import User from "@/models/User";
import { decryptData } from "@/lib/encryption";

// Helper function to safely decrypt and parse logs for the UI
const decryptLogs = (logs: any[]) => {
  return logs.map(log => {
    try {
      const decryptedString = decryptData(log.encryptedData);
      return {
        timestamp: log.timestamp,
        data: JSON.parse(decryptedString)
      };
    } catch (error) {
      console.error("Failed to decrypt a log entry:", error);
      return null;
    }
  }).filter(Boolean); 
};

export async function GET(req: Request) {
  try {
    // 1. Check Authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Connect to Database
    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Structure the Dashboard Payload for the UI
    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
      },
      scorecards: {
        health: user.healthScore,
        finance: user.financeScore,
        career: user.careerScore,
      },
      gamification: {
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak,
      },
      // Send the last 10 decrypted logs for the "Digital Twin Today" activity feed
      timeline: {
        health: decryptLogs(user.healthLogs.slice(-10)),
        finance: decryptLogs(user.financeLogs.slice(-10)),
        career: decryptLogs(user.careerLogs.slice(-10))
      }
    };

    return NextResponse.json({ 
      success: true, 
      dashboard: dashboardData 
    }, { status: 200 });

  } catch (error: any) {
    console.error("DASHBOARD API ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}