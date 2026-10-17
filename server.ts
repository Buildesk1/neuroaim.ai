import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { SensitivityProfile } from './src/types/sensitivity';
import { diagnoseAimSymptoms, calculateBalancedProfile } from './src/utils/sensitivityEngine';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GEMINI_KEY || '';

let aiClient: GoogleGenAI | null = null;
if (GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    console.log('[Caliber Server] Gemini API client initialized successfully.');
  } catch (err) {
    console.error('[Caliber Server] Failed to initialize Gemini client:', err);
  }
} else {
  console.log('[Caliber Server] No GEMINI_API_KEY detected. Local rule-engine fallback enabled.');
}

const SYSTEM_INSTRUCTION = `You are an expert Call of Duty Mobile (CODM) coach, competitive analyst, and technical aim calibrator. Your job is to analyze user sensitivity settings, diagnose aim issues (over-flicking, under-tracking, panic shaking, scope inconsistency), and output neat, mathematically balanced, and correlative sensitivity profiles.

Core 47 Anchor Model Rules:
- Speed Acceleration: ~250 - 273 baseline.
- Red Dot Camera Anchor: 47 baseline.
- TPP Camera: ~94% of Red Dot.
- ADS Camera: ~68 - 72% of Red Dot.
- Sniper Camera: ~89 - 90% of Red Dot.
- Vertical Turning: 100% - 102%.
- Firing Sensitivities: 75% - 85% of Camera values to steady recoil pull.
- Gyroscope ADS: 40 - 45 to absorb hand shake in clutch fights.

Always provide:
1. Immediate Diagnosis (1-2 sentences).
2. Math / Correlation Logic explanation.
3. Recommended settings update.
4. Short 2-minute in-game range drill.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, currentProfile } = req.body as {
      message: string;
      currentProfile: SensitivityProfile;
    };

    const userMessage = message || '';
    const lower = userMessage.toLowerCase();

    // 1. Compute deterministic local diagnostic result
    const symptoms = {
      handShake: lower.includes('shake') || lower.includes('jitter') || lower.includes('nervous'),
      overFlicking: lower.includes('flick') || lower.includes('past') || lower.includes('overshoot'),
      recoilSlip: lower.includes('recoil') || lower.includes('pull') || lower.includes('vertical'),
      longRangeUnderTrack: lower.includes('track') || lower.includes('far') || lower.includes('sluggish'),
    };

    const diagnosticResult = diagnoseAimSymptoms(currentProfile || calculateBalancedProfile(47, 273), symptoms);

    // 2. If Gemini API is configured, generate natural conversational coach response
    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `User Query: "${userMessage}"\nActive Sensitivity Profile: ${JSON.stringify(
                    currentProfile
                  )}\nComputed Prescription: ${JSON.stringify(diagnosticResult)}`,
                },
              ],
            },
          ],
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        const reply = response.text || diagnosticResult.immediateDiagnosis;
        return res.json({
          reply,
          immediateDiagnosis: diagnosticResult.immediateDiagnosis,
          diagnosticResult,
        });
      } catch (geminiErr) {
        console.warn('[Caliber Server] Gemini API call error, falling back to rule engine:', geminiErr);
      }
    }

    // 3. Fallback to local rule engine output
    return res.json({
      reply: `${diagnosticResult.immediateDiagnosis}\n\n${diagnosticResult.mathExplanation.join(' ')}`,
      immediateDiagnosis: diagnosticResult.immediateDiagnosis,
      diagnosticResult,
    });
  } catch (error) {
    console.error('[Caliber Server] Internal Error:', error);
    return res.status(500).json({ error: 'Internal Server Error during calibration.' });
  }
});

app.listen(PORT, () => {
  console.log(`[Caliber Server] Server running on port ${PORT}`);
});
