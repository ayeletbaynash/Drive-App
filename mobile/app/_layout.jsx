import { Stack } from 'expo-router';
import { useAppTheme } from '../context/ThemeContext';
import { ThemeProvider } from '../context/ThemeContext';
import { FileProvider } from '../context/FileContext';

function RootLayoutContent() {
  const { theme } = useAppTheme();
  
  if (!theme) {
    return null; // Prevent rendering if theme is not yet loaded
  }
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: theme.white,
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
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <FileProvider>
        <RootLayoutContent />
      </FileProvider>
    </ThemeProvider>
  );
}