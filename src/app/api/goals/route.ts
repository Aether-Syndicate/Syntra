// src/app/api/goals/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // UPDATED: Destructure the new targetDate and milestones fields
    const { title, domain, priority, targetDate, milestones } = await req.json();

    if (!title || !domain || !priority) {
      return NextResponse.json({ error: "Missing fields: title, domain, priority required" }, { status: 400 });
    }

    if (!["health", "finance", "career"].includes(domain)) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
    }

    await connectDB();
    
    // UPDATED: Push the new fields into the goals array
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $push: { 
          goals: { 
            title, 
            domain, 
            priority,
            // Convert to a real MongoDB Date object if it exists
            targetDate: targetDate ? new Date(targetDate) : undefined, 
            // Default to an empty array if the frontend doesn't send any
            milestones: milestones || [] 
          } 
        } 
      },
      { new: true }
    );

    return NextResponse.json({ success: true, goals: user?.goals }, { status: 201 });

  } catch (error) {
    console.error("[GOALS POST ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    return NextResponse.json({ 
      success: true, 
      goals: user?.goals || [], 
      badges: user?.badges || [] 
    });

  } catch (error) {
    console.error("[GOALS GET ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { goalId } = await req.json(); // Safely uses goalId

    if (!goalId) {
      return NextResponse.json({ error: "goalId is required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $pull: { goals: { _id: new mongoose.Types.ObjectId(goalId) } } },
      { new: true }
    );

    return NextResponse.json({ success: true, goals: user?.goals });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}