import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; // Required from your original security stack
// import dbConnect from '@/lib/db';
// import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Extracting the exact fields Khwaish's UI is sending
    const { name, email, password, age, avatarId } = body;

    // 1. Strict Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required." }, 
        { status: 400 }
      );
    }

    // await dbConnect();

    // 2. Collision Check
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   return NextResponse.json(
    //     { success: false, error: "A Twin is already linked to this email." }, 
    //     { status: 409 }
    //   );
    // }

    // 3. Password Encryption (AES/Bcrypt Security Protocol)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Initialize the New Digital Twin Baseline
    const newUser = {
      name,
      email,
      password: hashedPassword,
      age: age ? parseInt(age) : null,
      avatarId: avatarId || 1, // Fallback to a default Avatar if missing
      
      // Starting from scratch, unlike the Demo user
      gamification: { totalPoints: 0, currentStreak: 0 },
      
      // Neutral 50/100 baseline scores so Recharts has data to render immediately
      scores: { health: 50, finance: 50, career: 50 }, 
      goals: []
    };

    // await User.create(newUser);

    // 5. Successful Handshake
    return NextResponse.json({
      success: true,
      message: "Neural link established. Twin registered successfully."
    });

  } catch (error) {
    console.error("Registration Error:", error);
    
    return NextResponse.json(
      { success: false, error: "Failed to initialize Twin architecture." }, 
      { status: 500 }
    );
  }
}