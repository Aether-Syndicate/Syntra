// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Basic Validation
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }

    // 1. Connect to Database (Uncommented!)
    await connectDB();

    // 2. Check for existing user (Uncommented!)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email already registered." }, { status: 409 });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User in MongoDB (Uncommented and structure verified!)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      avatarId: 1, // Default Avatar
      scores: { health: 50, finance: 50, career: 50 }, // Starting baseline
      gamification: { totalPoints: 0, currentStreak: 0 },
      goals: []
    });

    // We do NOT return a JWT here. 
    // Best practice for NextAuth is to return a 201 Success, 
    // then have the frontend redirect to the /login page (or use the signIn helper).
    return NextResponse.json({ 
        success: true, 
        message: "User registered successfully. Please log in." 
    }, { status: 201 });

  } catch (error: any) {
    console.error("[CRITICAL] Registration failed:", error);
    return NextResponse.json({ success: false, message: "Server encountered an error during registration." }, { status: 500 });
  }
}