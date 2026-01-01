import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateServiceDescription = async (
  title: string, 
  category: string,
  options?: { tone: string; length: string }
): Promise<string> => {
  const tone = options?.tone || 'Professional';
  const length = options?.length || 'Medium';

  let lengthInstruction = '2-3 sentences';
  if (length === 'Short') lengthInstruction = '1 concise sentence';
  if (length === 'Long') lengthInstruction = '3-4 detailed sentences';

  try {
    const prompt = `
      Write a ${tone.toLowerCase()} description (${lengthInstruction}) for a technical service titled "${title}" 
      in the category of "${category}". 
      The company is "Lasa Technology", known for innovation and reliability.
      Focus on the value proposition for the client.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate description. Please try again.");
  }
};