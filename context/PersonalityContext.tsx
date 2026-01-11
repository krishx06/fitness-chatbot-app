
import React, { createContext, ReactNode, useContext, useState } from 'react';

// Unified Personality type
export type Personality = 'encourager' | 'creative' | 'finisher';

interface PersonalityContextType {
    personality: Personality;
    setPersonality: (p: Personality) => void;
}

const PersonalityContext = createContext<PersonalityContextType | undefined>(undefined);

export function PersonalityProvider({ children }: { children: ReactNode }) {
    const [personality, setPersonality] = useState<Personality>('encourager');

    return (
        <PersonalityContext.Provider value={{ personality, setPersonality }}>
            {children}
        </PersonalityContext.Provider>
    );
}

export function usePersonality() {
    const context = useContext(PersonalityContext);
    if (context === undefined) {
        throw new Error('usePersonality must be used within a PersonalityProvider');
    }
    return context;
}
