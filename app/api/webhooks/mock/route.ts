// src/app/api/webhooks/mock/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { encryptData } from "@/lib/encryption";

// Hardcoded key to simulate external API authentication for the hackathon
const MOCK_API_SECRET = process.env.MOCK_API_SECRET || "syntra-mock-secret-2026";

export async function POST(req: Request) {
  try {
    // 1. Authenticate the External Service (Not the User)
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== MOCK_API_SECRET) {
      return NextResponse.json({ error: "Unauthorized API Key" }, { status: 401 });
    }

    // 2. Parse the massive data dump
    const body = await req.json();
    const { email, provider, domain, payload } = body; 
    
    if (!email || !provider || !domain || !payload) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Find the user in the database
    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Encrypt and Ingest the Data
    // Stringify the external payload, encrypt it, and save it to the new schema arrays
    const encryptedPayload = encryptData(JSON.stringify({
      provider: provider, // e.g., "Fitbit", "Plaid"
      data: payload
    }));

    if (domain === "health") {
      user.healthLogs.push({ encryptedData: encryptedPayload, timestamp: new Date() });
    } else if (domain === "finance") {
      user.financeLogs.push({ encryptedData: encryptedPayload, timestamp: new Date() });
    } else if (domain === "career") {
      user.careerLogs.push({ encryptedData: encryptedPayload, timestamp: new Date() });
    } else {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
    }

    // Note: We skip recalculating the gamification score here because external dumps 
    // are often historical. We just store it securely for the AI to read later.
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: `Successfully ingested ${provider} data for ${email}` 
    }, { status: 200 });

  } catch (error: any) {
    console.error("MOCK WEBHOOK ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
