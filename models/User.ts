// src/models/User.ts
import mongoose, { Schema } from 'mongoose';

// --- 1. DOMAIN SUB-SCHEMAS (The "Memory Banks") ---
const HealthLogSchema = new Schema({
  date: { type: Date, default: Date.now },
  sleepHours: { type: Number, required: true },
  workoutMinutes: { type: Number, required: true },
  stressLevel: { type: Number, min: 1, max: 10, required: true },
});

const FinanceLogSchema = new Schema({
  date: { type: Date, default: Date.now },
  amountSaved: { type: Number, required: true },
  discretionarySpent: { type: Number, required: true },
});

const CareerLogSchema = new Schema({
  date: { type: Date, default: Date.now },
  hoursStudied: { type: Number, required: true },
  productivityRating: { type: Number, min: 1, max: 10, required: true },
});

// --- 2. MASTER USER SCHEMA ---
const UserSchema = new Schema({
  // Core Auth
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  
  // The Digital Twin Scores
  healthScore: { type: Number, default: 0 },
  financeScore: { type: Number, default: 0 },
  careerScore: { type: Number, default: 0 },
  
  // Multi-Domain Data Arrays (Where Khwaish's form data goes)
  healthLogs: [HealthLogSchema],
  financeLogs: [FinanceLogSchema],
  careerLogs: [CareerLogSchema],
  
  // Gamification State
  totalPoints: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 }
}, { timestamps: true });

// Prevents Mongoose from recompiling the model if it's already registered
export default mongoose.models.User || mongoose.model('User', UserSchema);