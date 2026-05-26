// src/models/User.ts
import mongoose, { Schema, Document, models } from "mongoose";

// 1. Milestone Interface (NEW)
export interface IMilestone {
  text: string;
  completed: boolean;
}

// 2. Goal Interface (UPDATED)
export interface IGoal {
  _id?: mongoose.Types.ObjectId;
  title: string;
  domain: string;
  priority: string;
  targetDate?: Date; // NEW: Timeline tracking
  milestones: IMilestone[]; // NEW: Milestone tracking
}

// 3. Main User Interface (UPDATED)
export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  age?: number;
  avatarId: number;
  profile: {
    monthlyIncome: number;
    monthlyBudget: number;
    targetSavingsRate: number;
  };
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
  badges: string[]; // NEW: Gamification Badges
  goals: IGoal[];
  aiSnapshot?: {
    dailyReflection: any;
    lastGeneratedAt: Date | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

// 4. Milestone Schema (NEW)
const MilestoneSchema = new Schema<IMilestone>({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

// 5. Goal Schema (Embedded & UPDATED)
const GoalSchema = new Schema<IGoal>(
  {
    title: { type: String, required: true },
    domain: { type: String, required: true },
    priority: { type: String, required: true },
    targetDate: { type: Date }, // NEW
    milestones: [MilestoneSchema], // NEW
  },
  { _id: true }
);

// 6. Main User Schema (UPDATED)
const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
    
    // Onboarding Fields
    age: { type: Number },
    avatarId: { type: Number, default: 1 },

    // Grouped Scores
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

    // Gamification Badges Array (NEW)
    badges: { type: [String], default: [] }, 

    // Goals Array
    goals: [GoalSchema],

    profile: {
      monthlyIncome: { type: Number, default: 0 },
      monthlyBudget: { type: Number, default: 0 },
      targetSavingsRate: { type: Number, default: 20 },
    },

    aiSnapshot: {
      dailyReflection: { type: Object, default: null }, // Stores the parsed JSON
      lastGeneratedAt: { type: Date, default: null },   // Timestamp of last run
    },
  },
  { timestamps: true }
);

// 7. Model Export (with Next.js hot-reload protection)
const User = models.User || mongoose.model<IUser>("User", UserSchema);

export default User;