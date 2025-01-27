// context/ScoreContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ScoreContextType {
  score: number;
  setScore: (value: number) => void;
}

export const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [score, setScoreState] = useState<number>(0);
  
  // Helper function to get today's date as a string
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  // Load score and check for daily reset
  useEffect(() => {
    const loadScore = async () => {
      try {
        const savedScore = await AsyncStorage.getItem('score');
        const savedDate = await AsyncStorage.getItem('lastUpdatedDate');
        const today = getTodayDate();

        if (savedDate !== today) {
          // If the date has changed, reset the score and update the date
          setScoreState(0);
          AsyncStorage.setItem('lastUpdatedDate', today);
        } else if (savedScore !== null) {
          // Load the saved score if the date hasn't changed
          setScoreState(parseInt(savedScore, 10));
        }
      } catch (error) {
        console.error('Error loading score:', error);
      }
    };
    loadScore();
  }, []);

  // Save score to AsyncStorage when it changes
  const setScore = (value: number) => {
    setScoreState(value);
    AsyncStorage.setItem('score', value.toString());
    AsyncStorage.setItem('lastUpdatedDate', getTodayDate()); // Update the date whenever score changes
  };

  return (
    <ScoreContext.Provider value={{ score, setScore }}>
      {children}
    </ScoreContext.Provider>
  );
};

