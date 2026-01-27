import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { themeMode, toggleTheme, theme } = useAppTheme();

  return (
    <TouchableOpacity onPress={toggleTheme} style={{ padding: 4 }}>
      <Ionicons 
        name={themeMode === 'light' ? 'moon-outline' : 'sunny-outline'} 
        size={24} 
        color={theme.textMuted} 
      />
    </TouchableOpacity>
  );
}