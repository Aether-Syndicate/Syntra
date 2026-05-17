import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
// import dbConnect from '@/lib/db';
// import User from '@/models/User';
// import Log from '@/models/Log';

// Initialize Gemini (Maneesha will need to add GEMINI_API_KEY to your .env.local file)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    // 1. Auth & Data Retrieval
    // const session = await getServerSession(authOptions);
    const userId = "demo_user_id";

    // await dbConnect();
    
    // 2. Memory Compression (Fetch last 7 days to give the Twin "state")
    // const logs = await Log.find({ userId }).sort({ date: -1 }).limit(7).lean();
    
    // MOCK MEMORY PAYLOAD (Until DB is wired)
    const memoryPayload = {
      streak: 14,
      avgSleep: 5.5, // Notice this is low (creating a risk flag)
      spendingTrend: "rising",
      dominantDomain: "career"
    };

    // 3. The Persona & Schema Prompt
    const prompt = `
      You are Syntra, an advanced, empathetic Digital Twin. 
      Analyze this user's 7-day Memory Payload: ${JSON.stringify(memoryPayload)}
      
      Generate a response strictly adhering to this JSON schema. Do not use markdown blocks (\`\`\`json). Just return raw JSON:
      {
        "twinPrediction": "String (7-14 day forecast crossing domains)",
        "dailyReflection": "String (empathetic reflection connecting past behavior)",
        "explainability": ["String", "String"],
        "dailyChallenge": "String (based on the user's streak)",
        "recommendations": { "health": ["String"], "finance": ["String"], "career": ["String"] },
        "riskAlerts": ["String"],
        "confidence": Number (1-100)
      }
    `;

    // 4. Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const rawOutput = result.response.text();

    // 5. The Failsafe Sanitizer
    const cleanOutput = rawOutput.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsedData = JSON.parse(cleanOutput);

    return NextResponse.json({ success: true, data: parsedData });

  } catch (error) {
    console.error("AI Generation Error:", error);
    
    // 6. Graceful Recovery (Never crash the frontend)
    return NextResponse.json({ 
      success: true, 
      data: {
        twinPrediction: "Twin calibrating... Neural link temporarily unstable.",
        dailyReflection: "Taking a moment to sync your recent data patterns.",
        explainability: ["System hit an API rate limit or encountered malformed data."],
        dailyChallenge: "Log today's data manually to stabilize the connection.",
        recommendations: { health: [], finance: [], career: [] },
        riskAlerts: ["AI Sync Pending"],
        confidence: 0
      }
    });
  }
}