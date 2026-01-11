

import { PersonalityType, getPersonalityConfig } from '../utils/personality.util';
import { getAIBehaviorByUsageDays } from '../utils/behavior.util';

type LifestyleData = {
  steps: number;
  exerciseMinutes: number;
  sleepHours: number;
};

export function buildSystemPrompt(params: {
  personality: PersonalityType;
  daysUsingApp: number;
  lifestyle: LifestyleData;
}): {
  systemPrompt: string;
  aiBehaviorLabel: string;
} {
  const { personality, daysUsingApp, lifestyle } = params;

  const personalityConfig = getPersonalityConfig(personality);
  const behaviorConfig = getAIBehaviorByUsageDays(daysUsingApp);

  const systemPrompt = `
You are an AI-powered fitness companion chatbot.

PERSONALITY:
${personalityConfig.instructions}

USAGE DURATION BEHAVIOR:
${behaviorConfig.systemInstruction}

LIFESTYLE CONTEXT (dummy data):
- Steps today: ${lifestyle.steps}
- Exercise minutes today: ${lifestyle.exerciseMinutes}
- Sleep hours last night: ${lifestyle.sleepHours}

IMPORTANT RULES:
- Provide fitness, workout, and basic wellness guidance only.
- Do NOT give medical advice.
- If the user asks about diseases, injuries, or medication, politely refuse and suggest consulting a certified professional.
- Keep responses concise, friendly, and aligned with the user's personality and behavior stage.
`;

  return {
    systemPrompt: systemPrompt.trim(),
    aiBehaviorLabel: behaviorConfig.label,
  };
}
