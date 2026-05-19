// src/lib/validators.ts
import { z } from "zod";

// --- INGESTION SCHEMAS (used by /api/log) ---
const HealthDataSchema = z.object({
  sleepHours: z.number().min(0).max(24),
  workoutMinutes: z.number().min(0),
  stressLevel: z.number().min(1).max(10),
});

const FinanceDataSchema = z.object({
  amountSaved: z.number().min(0),
  discretionarySpent: z.number().min(0),
});

const CareerDataSchema = z.object({
  hoursStudied: z.number().min(0),
  productivityRating: z.number().min(1).max(10),
});

export const IngestionSchema = z.discriminatedUnion("domain", [
  z.object({ domain: z.literal("health"), data: HealthDataSchema }),
  z.object({ domain: z.literal("finance"), data: FinanceDataSchema }),
  z.object({ domain: z.literal("career"), data: CareerDataSchema }),
]);

// --- SIGNUP SCHEMA (used by frontend validation) ---
export const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  age: z.string().refine((val) => parseInt(val) >= 13, "Must be at least 13").optional(),
  avatarId: z.number().int().positive(),
});