import { View, Text, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function FileViewer() {
  const { file } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>ID: {file.id}</Text>
      <Text>Name: {file.name}</Text>
      
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}