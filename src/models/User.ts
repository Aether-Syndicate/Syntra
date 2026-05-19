//src/models/User.ts
import mongoose, { Schema, Document, models } from "mongoose";

// 1. Goal Interface
export interface IGoal {
  _id?: mongoose.Types.ObjectId;
  title: string;
  domain: string;
  priority: string;
}

// 2. Main User Interface
export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  age?: number;
  avatarId: number;
  scores: {
    health: number;
    finance: number;
    career: number;
  };
  gamification: {
    totalPoints: number;
    currentStreak: number;
    lastLogDate: Date;
  };
  goals: IGoal[];
  createdAt: Date;
  updatedAt: Date;
}

// 3. Goal Schema (Embedded)
const GoalSchema = new Schema<IGoal>(
  {
    title: { type: String, required: true },
    domain: { type: String, required: true },
    priority: { type: String, required: true },
  },
  { _id: true }
);

// 4. Main User Schema
const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
    
    // New Onboarding Fields
    age: { type: Number },
    avatarId: { type: Number, default: 1 },

    // Grouped Scores (Defaults to neutral 50/100 to prevent frontend crashes)
    scores: {
      health: { type: Number, default: 50 },
      finance: { type: Number, default: 50 },
      career: { type: Number, default: 50 },
    },

    // Grouped Gamification State
    gamification: {
      totalPoints: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      lastLogDate: { type: Date, default: null },
    },

    // Goals Array
    goals: [GoalSchema],
  },
  { timestamps: true }
);

// 5. Model Export (with Next.js hot-reload protection)
const User = models.User || mongoose.model<IUser>("User", UserSchema);

export default User;