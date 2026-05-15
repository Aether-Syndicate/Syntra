// src/app/api/log/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; 
import { connectDB } from "@/lib/mongodb"; 
import User from "@/models/User";
import { 
  calculateHealthScore, 
  calculateFinanceScore, 
  calculateCareerScore, 
  calculateTotalPoints 
} from "@/lib/scoring";

export async function POST(req: Request) {
  try {
    // 1. SECURE VAULT: We keep the NextAuth session active
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { domain, data } = body; 

    if (!domain || !data) {
      return NextResponse.json({ error: "Missing domain or data payload" }, { status: 400 });
    }

    // 2. CONNECT TO DB (Safely)
    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. DOMAIN LOGIC: Use "=" instead of "+=" to respect the 1-100 scale cap
    switch (domain) {
      case "health":
        user.healthLogs.push(data);
        user.healthScore = calculateHealthScore(data.sleepHours, data.workoutMinutes, data.stressLevel);
        break;
      case "finance":
        user.financeLogs.push(data);
        user.financeScore = calculateFinanceScore(data.amountSaved, data.discretionarySpent);
        break;
      case "career":
        user.careerLogs.push(data);
        user.careerScore = calculateCareerScore(data.hoursStudied, data.productivityRating);
        break;
      default:
        return NextResponse.json({ error: "Invalid domain specified" }, { status: 400 });
    }

    // 4. GAMIFICATION UPDATES
    user.totalPoints = calculateTotalPoints(user.healthScore, user.financeScore, user.careerScore);
    user.currentStreak += 1; // Antigravity's quick streak win!

    // 5. SAVE TO DB
    await user.save();

    // 6. FRONTEND-FRIENDLY RESPONSE
    return NextResponse.json({ 
      success: true, 
      message: `Successfully updated ${domain}!`,
      state: {
        healthScore: user.healthScore,
        financeScore: user.financeScore,
        careerScore: user.careerScore,
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("DATA INGESTION ERROR:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
