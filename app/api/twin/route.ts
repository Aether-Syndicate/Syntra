import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; 
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb"; 
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    // 1. SECURE VAULT: Check ID at the door
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. CONNECT TO DB
    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. THE DEVSECOPS SCRUBBER (PII Removal)
    // We strictly define what goes out. NO emails, NO names, NO Mongo _ids.
    const anonymizedTwin = {
      state: {
        healthScore: user.healthScore,
        financeScore: user.financeScore,
        careerScore: user.careerScore,
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak
      },
      // Only sending the 5 most recent logs to keep the AI prompt cheap and fast
      recentHistory: {
        health: user.healthLogs.slice(-5),
        finance: user.financeLogs.slice(-5),
        career: user.careerLogs.slice(-5)
      }
    };

    // 4. HANDOFF TO MANEESHA'S AI PIPELINE
    return NextResponse.json({ 
      success: true, 
      twin: anonymizedTwin 
    }, { status: 200 });

  } catch (error: any) {
    console.error("DEVSECOPS PIPELINE ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}