import { Stack } from 'expo-router';
import { theme } from '../constants/theme'; 
import { ThemeProvider } from '../context/ThemeContext';
import { FileProvider } from '../context/FileContext';

export default function RootLayout() {
  return (
    // The Stack manages the stack of screens (like pages in a browser)
    <ThemeProvider>
      <FileProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Defining the screens */}
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="registration" 
          options={{
            title: 'Registration',
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ title: 'Login' }} 
        />
        <Stack.Screen name="recent" options={{ headerShown: false }} />
        <Stack.Screen name="trash" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
      </Stack>
      </FileProvider>
    </ThemeProvider>
  );
}