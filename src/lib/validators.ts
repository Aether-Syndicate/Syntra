// src/lib/validators.ts
import { z } from "zod";

export const IngestionSchema = z.object({
  domain: z.enum(["health", "finance", "career"]),
  data: z.record(z.string(), z.number())
});