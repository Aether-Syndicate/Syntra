import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; 
import { connectDB } from "@/lib/mongodb"; 
import User from "@/models/User";
import Log from "@/models/Log"; 
import { calculateSyntraCore } from "@/lib/scoring";

export async function GET(req: Request) {
  try {
    // 1. Instant Security Check
    const session = await getSession();
    
    // Explicitly checking for session.user.id ensures TypeScript is happy
    if (!session || !session.user?.email || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized neural link." }, { status: 401 });
    }

    // 2. Connect to Database
    await connectDB();

    // 3. CONCURRENT FETCHING
    // Fetches the User and the 15 most recent logs simultaneously for maximum speed
    const [user, recentLogs] = await Promise.all([
      User.findOne({ email: session.user.email }),
      Log.find({ userId: (session.user as any).id }) 
         .sort({ date: -1 })
         .limit(15)
         .lean() // Strips heavy Mongoose metadata to send pure JSON instantly
    ]);

    if (!user) {
      return NextResponse.json({ error: "Twin architecture not found." }, { status: 404 });
    }

    // 4. Calculate the Global Dashboard Metric
    const syntraCoreScore = calculateSyntraCore(
      user.scores.health, 
      user.scores.finance, 
      user.scores.career
    );

    // 5. Structure the God Payload perfectly for Khwaish's UI Components
    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
        avatarId: user.avatarId,
        age: user.age,
      },
      // The main Hero widget metric
      syntraCore: syntraCoreScore, 
      
      scorecards: {
        health: user.scores.health,
        finance: user.scores.finance,
        career: user.scores.career,
      },
      gamification: {
        totalPoints: user.gamification.totalPoints,
        currentStreak: user.gamification.currentStreak,
      },
      goals: user.goals,
      
      // The standalone logs fetched concurrently
      timeline: recentLogs 
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