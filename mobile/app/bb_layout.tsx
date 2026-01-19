import { Slot } from 'expo-router';

// Slot פשוט אומר ל-Expo: "תציג כאן את הקובץ index.tsx בלי שום תוספות"
export default function RootLayout() {
  return <Slot />;
}