import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function verifyStudentCard(imagePath: string): Promise<{
  isStudentCard: boolean;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');
    const mimeType = 'image/jpeg';

    const prompt = `Analyze this image and determine if it is a student ID card or university card.

Respond ONLY with a JSON object in this exact format:
{
  "isStudentCard": true or false,
  "confidence": "high" or "medium" or "low",
  "reason": "brief explanation in English"
}

Rules:
- isStudentCard is true if you see: student name, university/school name, student number, or ID card format
- isStudentCard is false if it's: a selfie, random photo, document that is not an ID card, etc.
- confidence is "high" if you are very sure, "medium" if somewhat sure, "low" if unclear`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
    ]);

    const text = result.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response from Gemini');

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Gemini verification error:', error);
    return {
      isStudentCard: false,
      confidence: 'low',
      reason: 'AI verification failed, requires manual review',
    };
  }
}