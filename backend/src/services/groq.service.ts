import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function getAIResponse(
    systemPrompt: string,
    userPrompt: string
): Promise<string> {
    try {
        console.log('--- GENERATED PROMPT ---');
        console.log(`${systemPrompt}\n\nUSER MESSAGE:\n${userPrompt}`);
        console.log('------------------------');

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            model: 'llama-3.3-70b-versatile',
        });

        const text = chatCompletion.choices[0]?.message?.content;

        return text || 'Sorry, I could not generate a response.';
    } catch (error: any) {
        console.error('Groq API Error:', error);
        return `AI Error: ${error.message || 'Unknown error'}. Check backend console for details.`;
    }
}
