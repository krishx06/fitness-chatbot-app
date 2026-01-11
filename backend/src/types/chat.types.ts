import { PersonalityType } from '../utils/personality.util';

export type ChatRequestBody = {
    message: string;
    personality: PersonalityType;
    daysUsingApp: number;

    lifestyle: {
        steps: number;
        exerciseMinutes: number;
        sleepHours: number;
    };
};

export type ChatResponse = {
    success: boolean;
    reply: string;
    suggestions?: string[];
    aiBehavior: string;
};
