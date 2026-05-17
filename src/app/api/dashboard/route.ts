import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/db'; 
// import User from '@/models/User';
// import Log from '@/models/Log';

export async function GET(request: Request) {
  try {
    // 1. Auth Check (Bypass this slightly while you are testing locally)
    // const session = await getServerSession(authOptions);
    // if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    
    // const userId = session.user.id; 
    const userId = "demo_user_id"; // HARDCODED FOR DEMO PREP

    // await dbConnect();

    // 2. Run Database Queries Concurrently (Speed Optimization)
    // Using Promise.all cuts the database wait time in half
    const [user, recentLogs] = await Promise.all([
      // REAL DB CALLS (Uncomment when MongoDB is fully wired):
      // User.findById(userId).lean(),
      // Log.find({ userId }).sort({ date: -1 }).limit(14).lean(),
      
      // MOCK DATA: This unblocks the frontend team immediately!
      Promise.resolve({ 
        name: "Aana", 
        avatarId: 2, 
        streak: 14, 
        scores: { health: 82, finance: 75, career: 91 }
      }),
      Promise.resolve([
        { date: "2026-05-16", sleepHours: 5, dailySpending: 120, studyHours: 6 }, // Engineered risk spike
        { date: "2026-05-15", sleepHours: 7.5, dailySpending: 15, studyHours: 4 },
        { date: "2026-05-14", sleepHours: 8, dailySpending: 0, studyHours: 5 }
      ])
    ]);

    // 3. The "Trajectory Illusion" (High UI Value, Low Math Effort)
    // Compare the most recent study session to the day prior
    let trajectory = "stable";
    if (recentLogs.length >= 2) {
       if (recentLogs[0].studyHours > recentLogs[1].studyHours) trajectory = "improving";
       if (recentLogs[0].studyHours < recentLogs[1].studyHours) trajectory = "declining";
    }

    // 4. Return the Unified Payload
    return NextResponse.json({
      success: true,
      data: {
        user: {
          name: user.name,
          avatarId: user.avatarId,
          streak: user.streak,
          scores: user.scores,
          trajectory: trajectory
        },
        logs: recentLogs // Khwaish will map this array directly into Recharts
      }
    });

  } catch (error) {
    console.error("Dashboard Aggregation Error:", error);
    // Graceful error state for the UI
    return NextResponse.json(
      { success: false, error: "Failed to hydrate dashboard" }, 
      { status: 500 }
    );
  }
}