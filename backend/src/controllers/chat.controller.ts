
import { Request, Response } from 'express';

import { getAIResponse } from '../services/gemini.service';
import { buildSystemPrompt } from '../services/prompt.service';

import {
    getSafetyRefusalMessage,
    isUnsafeMedicalQuery,
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


import prisma from '../lib/prisma';

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

        await prisma.message.create({
            data: {
                role: 'user',
                content: message,
                personality: personality,
            },
        });

        if (isUnsafeMedicalQuery(message)) {
            const refusalMessage = getSafetyRefusalMessage();

            await prisma.message.create({
                data: {
                    role: 'assistant',
                    content: refusalMessage,
                    personality: personality,
                },
            });

            return res.json({
                success: true,
                reply: refusalMessage,
                aiBehavior: 'Safety Refusal',
            });
        }

        const { systemPrompt, aiBehaviorLabel } = buildSystemPrompt({
            personality,
            daysUsingApp,
            lifestyle,
        });

        const aiReply = await getAIResponse(systemPrompt, message);

        const suggestionsRegex = /\|\|\|(.*?)\|\|\|/;
        const match = aiReply.match(suggestionsRegex);

        let finalReply = aiReply;
        let suggestions: string[] = [];

        if (match) {
            finalReply = aiReply.replace(match[0], '').trim();
            suggestions = match[1].split('|').map(s => s.trim()).filter(s => s.length > 0);
        }

        await prisma.message.create({
            data: {
                role: 'assistant',
                content: finalReply,
                personality: personality,
            },
        });

        return res.json({
            success: true,
            reply: finalReply,
            suggestions: suggestions,
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
