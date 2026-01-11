
import { Request, Response } from 'express';

import { buildSystemPrompt } from '../services/prompt.service';
import { getAIResponse } from '../services/openai.service';

import {
  isUnsafeMedicalQuery,
  getSafetyRefusalMessage,
} from '../utils/safety.util';

import { PersonalityType } from '../utils/personality.util';

type ChatRequestBody = {
  message: string;
  personality: PersonalityType;
  daysUsingApp: number;
  lifestyle: {
    steps: number;
    exerciseMinutes: number;
    sleepHours: number;
  };
};


export async function handleChat(req: Request, res: Response) {
  try {
    const {
      message,
      personality,
      daysUsingApp,
      lifestyle,
    } = req.body as ChatRequestBody;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    if (isUnsafeMedicalQuery(message)) {
      return res.json({
        success: true,
        reply: getSafetyRefusalMessage(),
        aiBehavior: 'Safety Refusal',
      });
    }

    const { systemPrompt, aiBehaviorLabel } = buildSystemPrompt({
      personality,
      daysUsingApp,
      lifestyle,
    });

    const aiReply = await getAIResponse(systemPrompt, message);

    return res.json({
      success: true,
      reply: aiReply,
      aiBehavior: aiBehaviorLabel,
    });

  } catch (error) {
    console.error('Chat controller error:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
