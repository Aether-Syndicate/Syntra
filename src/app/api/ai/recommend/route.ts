//src/app/api/ai/recommend/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Log from "@/models/Log";
import { buildTwinContext } from "@/lib/aiContextBuilder";
import { GoogleGenerativeAI } from "@google/generative-ai"; 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET(req: Request) {
  try {
    // 1. Strict Security Check
    const session = await getSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized neural link." }, { status: 401 });
    }

    // 2. Fetch User Context
    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "Twin architecture not found" }, { status: 404 });
    }

    const recentLogs = await Log.find({ userId: user._id })
      .sort({ date: -1 })
      .limit(21) // Last 7 days × 3 domains
      .lean();

    const twinContext = buildTwinContext(recentLogs);

    // 3. The Prompt Engineer
    const prompt = `
You are the Syntra Digital Twin AI. Analyze this user's behavioral data:

SCORES: Health ${user.scores.health}/100 | Finance ${user.scores.finance}/100 | Career ${user.scores.career}/100
STREAK: ${user.gamification.currentStreak} days

BEHAVIORAL PATTERNS (last 7 days):
- Avg Sleep: ${twinContext.weeklyAverages.sleep}hrs (trend: ${twinContext.trends.sleep})
- Avg Stress: ${twinContext.weeklyAverages.stress}/10 (trend: ${twinContext.trends.stress})
- Avg Daily Spending: $${twinContext.weeklyAverages.spending} (trend: ${twinContext.trends.spending})
- Avg Study: ${twinContext.weeklyAverages.studyHours}hrs/day (trend: ${twinContext.trends.study})

DETECTED FLAGS: ${twinContext.behaviorFlags.join(", ") || "none"}

Generate insights with CROSS-DOMAIN analysis. Return ONLY valid JSON:
{
  "insights": ["string"],
  "recommendations": ["string"],
  "futureProjection": { "health": "string", "finance": "string", "career": "string" },
  "smartGoals": ["string"],
  "confidence": number,
  "dailyChallenge": "string"
}`;

    // 4. Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 5. Clean and Parse the JSON 
    const cleanedText = responseText.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();
    const parsedData = JSON.parse(cleanedText);

    // 6. Return the Strict Contract to the Frontend
    return NextResponse.json({ 
      success: true, 
      ai: parsedData 
    }, { status: 200 });

  } catch (error: any) {
    console.error("GEMINI INTEGRATION ERROR:", error);
    // Fallback so frontend UI doesn't crash if Gemini rate-limits
    return NextResponse.json({ 
      success: false,
      ai: {
        insights: ["Our AI is currently analyzing your deep metrics. Please check back later."],
        recommendations: ["Maintain your current streak across all domains."],
        futureProjection: { health: "Stable", finance: "Stable", career: "Stable" },
        smartGoals: ["Log your data for 3 consecutive days."],
        confidence: 0,
        dailyChallenge: "Complete a single log today."
      }
    }, { status: 200 }); 
  }
}