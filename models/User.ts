// src/models/User.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // Core Auth
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  
  // The Digital Twin Scores
  healthScore: { type: Number, default: 0 },
  financeScore: { type: Number, default: 0 },
  careerScore: { type: Number, default: 0 },
  
  // Gamification State
  totalPoints: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 }
}, { timestamps: true });

// This prevents Mongoose from recompiling the model if it's already registered during hot-reloads
export default mongoose.models.User || mongoose.model('User', UserSchema);