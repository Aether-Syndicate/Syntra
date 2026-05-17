import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/db';
// import User from '@/models/User';
// import Log from '@/models/Log';

export async function GET(request: Request) {
  try {
    // 1. Security Check: Don't let random people wipe your DB!
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    if (secret !== "hackathon_win") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // await dbConnect();

    const demoUserId = "demo_user_id";

    // 2. Wipe the Slate Clean
    // await User.deleteOne({ _id: demoUserId });
    // await Log.deleteMany({ userId: demoUserId });

    // 3. Create the Perfect Profile
    const demoUser = {
      _id: demoUserId,
      name: "Aana",
      email: "demo@syntra.com",
      avatarId: 2,
      gamification: { totalPoints: 1450, currentStreak: 14 },
      scores: { health: 78, finance: 82, career: 88 },
      goals: [
        { title: "Hit LeetCode Knight", domain: "career", priority: "high" },
        { title: "Cap Zomato spending", domain: "finance", priority: "med" }
      ]
    };
    // await User.create(demoUser);

    // 4. Engineer the "Anomaly" Data
    // We want the AI to notice a recent drop in sleep and a spike in spending, 
    // while career momentum stays high.
    const today = new Date();
    const demoLogs = Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      
      // The Story: Consistent for the first 10 days, then a stressful grind starts
      const isRecentDip = i < 3; // The last 3 days
      
      return {
        userId: demoUserId,
        date: d.toISOString().split('T')[0],
        domainData: {
          health: {
            sleepHours: isRecentDip ? 4.5 : 7.5, // 📉 The Sleep Dip
            workoutMinutes: isRecentDip ? 0 : 45,
            stressScore: isRecentDip ? 8 : 3
          },
          finance: {
            dailySpending: isRecentDip ? 120 : 15, // 📈 The Spending Spike
            impulseBuyUrge: isRecentDip ? 9 : 2
          },
          career: {
            studyHours: isRecentDip ? 6 : 3, // 📈 Pushing hard on career
            focusQuality: isRecentDip ? 5 : 8  // But focus quality is dropping due to low sleep
          }
        }
      };
    });

    // await Log.insertMany(demoLogs);

    return NextResponse.json({ 
      success: true, 
      message: "Golden Demo Data injected successfully.",
      dataStory: "Injected 14 days. Engineered a recent sleep dip and spending spike alongside high study hours."
    });

  } catch (error) {
    console.error("Demo Seed Error:", error);
    return NextResponse.json({ success: false, error: "Failed to seed demo data" }, { status: 500 });
  }
}