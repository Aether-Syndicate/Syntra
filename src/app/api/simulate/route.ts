import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    // 1. Extract the user's slider adjustments
    const body = await request.json();
    const { sleepDelta = 0, studyDelta = 0, spendingDelta = 0 } = body;

    // 2. Fetch Base Scores (Mocked for now, connect to DB later)
    const baseScores = { health: 80, finance: 75, career: 85 };

    // 3. The Deterministic Math Engine
    // This is where you enforce the cross-domain physics. 
    // e.g., Studying more hurts health slightly if sleep isn't increased.
    const projectedScores = {
      health: Math.min(100, Math.max(0, baseScores.health + (sleepDelta * 5) - (studyDelta * 2))),
      finance: Math.min(100, Math.max(0, baseScores.finance - (spendingDelta * 0.5))),
      career: Math.min(100, Math.max(0, baseScores.career + (studyDelta * 4) - (sleepDelta * 2)))
    };

    // Calculate the total point shifts for the prompt
    const healthShift = projectedScores.health - baseScores.health;
    const careerShift = projectedScores.career - baseScores.career;
    const financeShift = projectedScores.finance - baseScores.finance;

    // 4. The Agentic Prompt Injection
    const prompt = `
      You are Syntra, an advanced Digital Twin. The user is running a "What-If" simulation.
      
      Mathematical Simulation Results:
      - Health Score Change: ${healthShift > 0 ? '+' : ''}${healthShift} points
      - Career Score Change: ${careerShift > 0 ? '+' : ''}${careerShift} points
      - Finance Score Change: ${financeShift > 0 ? '+' : ''}${financeShift} points
      
      Generate a strictly formatted JSON response explaining the real-world behavioral trade-offs of these specific mathematical changes. Do not use markdown blocks.
      
      Required JSON Schema:
      {
        "tradeoffAnalysis": "String (A 2-sentence explanation of the domino effect. E.g., 'Pushing study hours without adequate sleep is spiking your career score but causing a critical health dip.')",
        "explainability": ["String", "String"] (List the direct consequences)
      }
    `;

    // 5. Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    
    // 6. The Failsafe Sanitizer
    const rawOutput = result.response.text();
    const cleanOutput = rawOutput.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const aiAnalysis = JSON.parse(cleanOutput);

    // 7. Return the combined Payload (Math + AI)
    return NextResponse.json({ 
      success: true, 
      data: {
        projectedScores,
        aiAnalysis
      }
    });

  } catch (error) {
    console.error("Simulation Engine Error:", error);
    
    // Graceful Fallback
    return NextResponse.json({ 
      success: true, 
      data: {
        projectedScores: { health: 80, finance: 75, career: 85 }, // Return to baseline
        aiAnalysis: {
          tradeoffAnalysis: "Simulation matrix recalibrating...",
          explainability: ["Mathematical bounds exceeded or API timeout."]
        }
      } 
    });
  }
}
