import { NextRequest, NextResponse } from 'next/server';
import { generateObject} from 'ai'; // using generateObject directly from the Vercel AI SDK
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { CHAT_BOT_SYSTEM_PROMPT } from '@/lib/prompts/chatPrompt';

// Ensure standard edge execution environment or modern node runtime
export const maxDuration = 30;

// Enforce Zod validation for runtime type safety
const ChatResponseSchema = z.object({
  intent: z.enum(['DATA_ENTRY', 'QUERY_RESPONSE', 'SIMULATION']),
  message: z.string().describe('The natural conversational response or acknowledgement to show to the user.'),
  uiAction: z.object({
    shouldNavigate: z.boolean().describe('Set to true ONLY if intent is SIMULATION.'),
    targetRoute: z.string().describe('The destination URL path (e.g., "/simulator"). Empty string if no navigation.'),
    queryParams: z.object({
      domain: z.enum(['health', 'finance', 'career']).nullable(),
      variable: z.enum(['sleep_hours', 'workout_frequency', 'savings_rate', 'study_hours', 'focus_rating']).nullable(),
      val: z.coerce.number().nullable(),
    }).nullable(),
  }).nullable(),
});

/**
 * Heuristic fallback pre-processor to catch obvious simulation queries 
 * and safeguard system intent matching.
 */
function checkHeuristicOverride(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();
  const structuralTriggers = [
    'what if', 
    'simulate', 
    'what happens if', 
    'if i change', 
    'how does'
  ];
  return structuralTriggers.some(trigger => lowerPrompt.includes(trigger));
}

export async function POST(req: NextRequest) {
  try {
    // 1. Session and payload validation (stub out real auth verification as per project spec)
    const { message } = await req.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'A valid chat message string is required.' }, { status: 400 });
    }

    // 2. Invoke Gemini using Structured Outputs
    // Leveraging gemini-2.5-flash or gemini-2.0-flash-001 for low latency JSON schemas
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      system: CHAT_BOT_SYSTEM_PROMPT,
      prompt: message,
      schema: ChatResponseSchema,
      temperature: 0.1, // Low temperature ensures highly deterministic intent matching
    });

    // 3. Post-processing/Heuristic alignment verification
    let finalizedPayload = { ...object };
    if (checkHeuristicOverride(message) && finalizedPayload.intent !== 'SIMULATION') {
      // Force correction if heuristic rules detect a clear missing link
      finalizedPayload.intent = 'SIMULATION';
      if (finalizedPayload.uiAction) {
        finalizedPayload.uiAction.shouldNavigate = true;
        finalizedPayload.uiAction.targetRoute = '/simulator';
      }
    }

    // 4. Return type-safe structural layout back to ChatWidget.tsx
    return NextResponse.json(finalizedPayload, { status: 200 });

  } catch (error: any) {
    console.error('[CHAT_ROUTE_ERROR]:', error);
    return NextResponse.json(
      { 
        error: 'Internal processing failure within the AI engine.', 
        details: error?.message || '' 
      }, 
      { status: 500 }
    );
  }
}