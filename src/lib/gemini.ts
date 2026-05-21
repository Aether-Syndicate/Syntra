// ================================================================
// SYNTRA — Gemini API Client (TASK 1)
// Central client used by all prompt files.
// Enforces strict JSON on every call — no plain text ever.
// Model: gemini-2.5-flash (current stable as of 2025)
// ================================================================
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// ── PII Anonymization — strip before sending to external API ────
const PII_KEYS = [
  "name", "email", "phone", "address", "userid",
  "accountnumber", "pan", "aadhaar", "ssn", "dob",
  "fullname", "firstname", "lastname",
];

export function anonymizePII(obj: Record<string, unknown>): Record<string, unknown> {
  const clone = JSON.parse(JSON.stringify(obj));
  function strip(o: Record<string, unknown>) {
    for (const key of Object.keys(o)) {
      if (PII_KEYS.some((p) => key.toLowerCase().includes(p))) {
        o[key] = "[REDACTED]";
      } else if (typeof o[key] === "object" && o[key] !== null) {
        strip(o[key] as Record<string, unknown>);
      }
    }
  }
  strip(clone);
  return clone;
}

// ── Core Gemini caller ───────────────────────────────────────────
// src/lib/gemini.ts (or src/providers/gemini.ts)

export async function callGemini<T>(
  prompt: string,
  options: { 
    temperature?: number; 
    maxTokens?: number;
    maxRetries?: number;   // New parameter
    baseDelayMs?: number;  // New parameter
  } = {}
): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set in .env");

  // We default to 3 retries, starting with a 2-second wait
  const { 
    temperature = 0.4, 
    maxTokens = 4600,
    maxRetries = 3, 
    baseDelayMs = 2000 
  } = options;

  let lastError: any;

  // ── THE RETRY LOOP ────────────────────────────────────────────
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
            responseMimeType: "application/json",
          },
        }),
      });

      // ── ERROR HANDLING ──────────────────────────────────────────
      if (!response.ok) {
        const errText = await response.text();
        
        // If it is a 429 (Rate Limit) or 5xx (Server Error), we throw a "Retryable" error
        if (response.status === 429 || response.status >= 500) {
          throw new Error(`Retryable Error ${response.status}: ${errText}`);
        }
        
        // If it is a 400 (Bad Request, like a malformed prompt), retrying won't help. Fail immediately.
        throw new Error(`Fatal Error ${response.status}: ${errText}`);
      }

      // ── SUCCESS ───────────────────────────────────────────────
      const raw = await response.json();
      const text: string = raw?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      if (!text) throw new Error("Retryable Error: Gemini returned an empty response.");

      const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
      return JSON.parse(cleaned) as T;

    } catch (error: any) {
      lastError = error;

      // If we hit a Fatal Error, do not retry. Break the loop and crash safely.
      if (error.message.startsWith("Fatal")) {
        throw error;
      }

      // If we have reached our max attempts, stop trying.
      if (attempt === maxRetries) {
        break; 
      }

      // ── EXPONENTIAL BACKOFF ───────────────────────────────────
      // Attempt 1 fails -> wait 2s. Attempt 2 fails -> wait 4s.
      const waitTime = baseDelayMs * Math.pow(2, attempt - 1);
      console.warn(`⚠️ Gemini API busy (Attempt ${attempt}/${maxRetries}). Retrying in ${waitTime / 1000}s...`);
      
      // Force the code to pause before looping again
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  // If the loop finishes without returning, all retries failed.
  throw new Error(`Gemini API failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
}
import { TwinReflectionSchema } from "../types/schemas";

export function validateSyntraResponse(data: unknown) {
  return TwinReflectionSchema.parse(data);
}