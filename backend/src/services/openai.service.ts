
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function getAIResponse(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await client.responses.create({
    model: 'gpt-4.1-mini', 
    input: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  return (
    response.output_text ||
    'Sorry, I could not generate a response at the moment.'
  );
}
