import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Log from '@/models/Log';
import bcrypt from "bcryptjs"; // Needed to pass Mongoose validation

export async function GET(request: Request) {
  try {
    // 1. Security Check: Don't let random people wipe your DB!
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    if (secret !== "hackathon_win") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const demoEmail = "demo@syntra.com";

    // 2. Wipe the Slate Clean (Ensures a fresh demo every time you run it)
    const existingUser = await User.findOne({ email: demoEmail });
    if (existingUser) {
        await Log.deleteMany({ userId: existingUser._id });
        await User.deleteOne({ email: demoEmail });
    }

    // 3. Create the Perfect Profile
    const demoUser = await User.create({
      // Mongoose auto-generates the _id here
      name: "Aana",
      email: demoEmail,
      password: await bcrypt.hash("password123", 10), // Satisfies the strict schema
      avatarId: 2,
      scores: { health: 78, finance: 82, career: 88 },
      gamification: { totalPoints: 1450, currentStreak: 14 },
      goals: [
        { title: "Hit LeetCode Knight", domain: "career", priority: "high" },
        { title: "Cap Zomato spending", domain: "finance", priority: "med" }
      ]
    });

    // 4. Engineer the "Anomaly" Data
    const today = new Date();
    const demoLogs = [];

    // Loop through the last 14 days
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      
      const isRecentDip = i < 3; // The anomaly triggers on the last 3 days

      // Health Log
      demoLogs.push({
        userId: demoUser._id, // Tied directly to the newly created user
        date: d,
        domain: "health",
        domainData: {
          sleepHours: isRecentDip ? 4.5 : 7.5, // 📉 The Sleep Dip
          workoutMinutes: isRecentDip ? 0 : 45,
          stressScore: isRecentDip ? 8 : 3
        }
      });

      // Finance Log
      demoLogs.push({
        userId: demoUser._id,
        date: d,
        domain: "finance",
        domainData: {
          dailySpending: isRecentDip ? 120 : 15, // 📈 The Spending Spike
          impulseBuyUrge: isRecentDip ? 9 : 2
        }
      });

      // Career Log
      demoLogs.push({
        userId: demoUser._id,
        date: d,
        domain: "career",
        domainData: {
          studyHours: isRecentDip ? 6 : 3, // 📈 Pushing hard on career
          focusQuality: isRecentDip ? 5 : 8  
        }
      });
    }

    // 5. Bulk insert all 42 logs (14 days * 3 domains) instantly
    await Log.insertMany(demoLogs);

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