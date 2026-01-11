
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface CoinsContextType {
    coins: number;
    addCoins: (amount: number) => void;
}

const CoinsContext = createContext<CoinsContextType | undefined>(undefined);

export function CoinsProvider({ children }: { children: ReactNode }) {
    const [coins, setCoins] = useState<number>(0); // Initial value reset to 0

    const addCoins = (amount: number) => {
        setCoins(prev => prev + amount);
    };

    return (
        <CoinsContext.Provider value={{ coins, addCoins }}>
            {children}
        </CoinsContext.Provider>
    );
}

export function useCoins() {
    const context = useContext(CoinsContext);
    if (context === undefined) {
        throw new Error('useCoins must be used within a CoinsProvider');
    }
    return context;
}
