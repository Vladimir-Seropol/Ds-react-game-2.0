import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GameStats {
  moves: number;
  gameTime: number;
}

interface GameContextType {
  stats: GameStats | null;
  setStats: (stats: GameStats) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Тип для пропсов компонента GameProvider
interface GameProviderProps {
  children: ReactNode; 
}

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [stats, setStats] = useState<GameStats | null>(null);

  useEffect(() => {
    const savedStats = localStorage.getItem('bestStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    if (stats) {
      
      localStorage.setItem('bestStats', JSON.stringify(stats));
    }
  }, [stats]);

  return (
    <GameContext.Provider value={{ stats, setStats }}>
      {children}
    </GameContext.Provider>
  );
};
