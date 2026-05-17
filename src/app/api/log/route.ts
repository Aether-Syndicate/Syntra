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
import { IngestionSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    // 1. SECURE VAULT
    const session = await getSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    // 2. ZOD VALIDATION (Moved safely inside the execution context)
    const body = await req.json();
    const result = IngestionSchema.safeParse(body);

    if (!result.success) {
      // Zod caught bad data (e.g., strings instead of numbers)
      return NextResponse.json({ success: false, message: "Invalid data format detected by Syntra Core." }, { status: 400 });
    }
    
    // Zod guarantees these variables are perfectly typed
    const { domain, data } = result.data; 

    // 3. CONNECT TO DB
    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ success: false, message: "Twin architecture not found." }, { status: 404 });
    }

    // 4. CREATE STANDALONE LOG
    await Log.create({
      userId: user._id,
      domain: domain,
      domainData: data
    });

    // 5. DOMAIN LOGIC
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
    }

    // 6. GAMIFICATION UPDATES
    const updatedScore = domain === "health" ? user.scores.health : domain === "finance" ? user.scores.finance : user.scores.career;
    user.gamification.totalPoints += calculateEarnedXP(updatedScore);
    user.gamification.currentStreak += 1; 

    // 7. SAVE USER STATE
    await user.save();

    // 8. FRONTEND-FRIENDLY RESPONSE
    return NextResponse.json({ 
      success: true, 
      message: `Successfully updated ${domain}!`,
      state: {
        scores: user.scores,
        gamification: user.gamification
      }
    }, { status: 200 });

  } catch (error: any) {
    // DEV SEES THIS:
    console.error("[CRITICAL] /api/log failed:", error);
    
    // UI SEES THIS: 
    // Applying the strict Error-State Philosophy so the frontend never receives a raw backend crash
    return NextResponse.json({ 
      success: false, 
      message: "Twin architecture encountered an anomaly. Safe mode engaged." 
    }, { status: 500 });
  }
}