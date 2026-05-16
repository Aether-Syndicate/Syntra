// src/models/User.ts
import mongoose, { Schema, Document, models } from "mongoose";

// 1. TypeScript Interface for strict type checking
export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  healthScore: number;
  financeScore: number;
  careerScore: number;
  totalPoints: number;
  currentStreak: number;
  healthLogs: { encryptedData: string; timestamp: Date }[];
  financeLogs: { encryptedData: string; timestamp: Date }[];
  careerLogs: { encryptedData: string; timestamp: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

// 2. Reusable Log Schema for the encrypted payloads
const EncryptedLogSchema = new Schema(
  {
    encryptedData: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false } // Prevents Mongoose from creating a 24-character ID for every single log to save DB space
);

// 3. The Main User Schema
const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    
    // Gamification State
    healthScore: { type: Number, default: 0 },
    financeScore: { type: Number, default: 0 },
    careerScore: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    
    // Encrypted Log Arrays
    healthLogs: [EncryptedLogSchema],
    financeLogs: [EncryptedLogSchema],
    careerLogs: [EncryptedLogSchema],
  },
  { timestamps: true }
);

// 4. Model Export (with Next.js hot-reload protection)
const User = models.User || mongoose.model<IUser>("User", UserSchema);

export default User;