
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getAIResponse(
    systemPrompt: string,
    userPrompt: string
): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const fullPrompt = `${systemPrompt}\n\nUSER MESSAGE:\n${userPrompt}`;

        console.log('--- GENERATED PROMPT ---');
        console.log(fullPrompt);
        console.log('------------------------');

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        return text || 'Sorry, I could not generate a response.';
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return `AI Error: ${error.message || 'Unknown error'}. Check backend console for details.`;
    }
}
