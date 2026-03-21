import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

export const getAI = (): GoogleGenAI => {
    if (!aiInstance) {
        aiInstance = new GoogleGenAI({
            apiKey: typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY || 'missing_key' : 'missing_key',
        });
    }

    return aiInstance;
};
