import { Stack } from 'expo-router';
import { theme } from '../constants/theme'; 

export default function RootLayout() {
  return (
    // The Stack manages the stack of screens (like pages in a browser)
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
    </Stack>
  );
}