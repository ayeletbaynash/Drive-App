import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native'; // מזהה אוטומטית את הגדרות הטלפון
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/theme'; // הייבוא מקובץ ה-Theme שלך

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme(); // 'light' or 'dark'
  const [themeMode, setThemeMode] = useState(systemScheme || 'light');

  // טעינת מצב שמור מהזיכרון
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('appTheme');
      if (savedTheme) {
        setThemeMode(savedTheme);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    await AsyncStorage.setItem('appTheme', newMode);
  };

  // אובייקט הצבעים הנוכחי (למשל: Colors.light או Colors.dark)
  const theme = Colors[themeMode];

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook פשוט לשימוש בקומפוננטות
export const useAppTheme = () => useContext(ThemeContext);