import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; 
import { connectDB } from "@/lib/mongodb"; 
import User from "@/models/User";
import Log from "@/models/Log"; 
import { 
  calculateHealthScore, 
  calculateFinanceScore, 
  calculateCareerScore, 
  calculateEarnedXP 
} from "@/lib/scoring";

export async function POST(req: Request) {
  try {
    // 1. SECURE VAULT
    const session = await getSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { domain, data } = body; 

    if (!domain || !data) {
      return NextResponse.json({ error: "Missing domain or data payload" }, { status: 400 });
    }

    // 2. CONNECT TO DB
    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. CREATE STANDALONE LOG
    const newLog = await Log.create({
      userId: user._id,
      domain: domain,
      domainData: data
    });

    // 4. DOMAIN LOGIC
    switch (domain) {
      case "health":
        user.scores.health = calculateHealthScore(data.sleepHours, data.workoutMinutes, data.stressLevel);
        break;
      case "finance":
        user.scores.finance = calculateFinanceScore(data.amountSaved, data.discretionarySpent);
        break;
      case "career":
        user.scores.career = calculateCareerScore(data.hoursStudied, data.productivityRating);
        break;
      default:
        return NextResponse.json({ error: "Invalid domain specified" }, { status: 400 });
    }

    // 5. GAMIFICATION UPDATES
    const updatedScore = domain === "health" ? user.scores.health : domain === "finance" ? user.scores.finance : user.scores.career;
    user.gamification.totalPoints += calculateEarnedXP(updatedScore);
    user.gamification.currentStreak += 1; 

    // 6. SAVE USER STATE
    await user.save();

    // 7. FRONTEND-FRIENDLY RESPONSE
    return NextResponse.json({ 
      success: true, 
      message: `Successfully updated ${domain}!`,
      state: {
        scores: user.scores,
        gamification: user.gamification
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("DATA INGESTION ERROR:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}