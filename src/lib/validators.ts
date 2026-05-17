//src/lib/validators.ts
import { z } from "zod";

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