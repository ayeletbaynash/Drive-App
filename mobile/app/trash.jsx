import { View, Text } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

export default function TrashScreen() {
  const { theme } = useAppTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
      <Text style={{ color: theme.textMain }}>Trash Can</Text>
    </View>
  );
}