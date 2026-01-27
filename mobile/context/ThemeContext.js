import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme(); // 'light' or 'dark'
  const [themeMode, setThemeMode] = useState(systemScheme || 'light');

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

  const theme = Colors[themeMode];

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);