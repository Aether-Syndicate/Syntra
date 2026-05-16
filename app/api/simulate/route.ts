// src/app/api/simulate/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { runSimulation } from "@/lib/simulator";

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse the Scenario Request
    // Expects: { scenario: { domain: "health", percentageChange: 0.3 } } // e.g., +30% effort
    const body = await req.json();
    const { scenario } = body;

    if (!scenario || !scenario.domain || typeof scenario.percentageChange === "undefined") {
        return NextResponse.json({ error: "Invalid scenario payload" }, { status: 400 });
    }

    // 3. Fetch User's Current State
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Run the deterministic math engine
    const simulationResult = runSimulation(
        user.healthScore,
        user.financeScore,
        user.careerScore,
        scenario
    );

    // 5. Return data for Recharts (Frontend)
    return NextResponse.json({
        success: true,
        simulation: simulationResult
    }, { status: 200 });

  } catch (error: any) {
    console.error("SIMULATION ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}