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

    const { title, domain, priority } = await req.json();

    if (!title || !domain || !priority) {
      return NextResponse.json({ error: "Missing fields: title, domain, priority required" }, { status: 400 });
    }

    if (!["health", "finance", "career"].includes(domain)) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $push: { goals: { title, domain, priority } } },
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
    return NextResponse.json({ success: true, goals: user?.goals || [] });

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

    const { goalId } = await req.json(); // Changed from goalTitle to goalId

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