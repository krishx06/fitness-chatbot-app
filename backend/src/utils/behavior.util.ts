export type AIBehaviorType =
    | 'Grounded & Empathetic'
    | 'Friendly Listener'
    | 'Coach-like';

export function getAIBehaviorByUsageDays(daysUsingApp: number): {
    label: AIBehaviorType;
    systemInstruction: string;
} {

    if (daysUsingApp <= 3) {
        return {
            label: 'Grounded & Empathetic',
            systemInstruction:
                'You are grounded, empathetic, and patient. Allow the user to vent. Do not give instant remedies unless explicitly asked.',
        };
    }


    if (daysUsingApp <= 8) {
        return {
            label: 'Friendly Listener',
            systemInstruction:
                'You are a friendly listener. Provide short remedies only after at least two user messages, UNLESS the user explicitly asks for a plan or advice (in which case, provide it immediately).',
        };
    }


    return {
        label: 'Coach-like',
        systemInstruction:
            'You are coach-like and action-oriented. Provide actionable guidance after the first user message.',
    };
}
