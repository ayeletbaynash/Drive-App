import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; 

const FolderItem = ({ folder, isTrash }) => {
  const router = useRouter()
    return (
    <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
      {/* Dynamic name from the folder object */}
      <Text>📁 {folder.name}</Text>
    </View>
  );
};

export default FolderItem;
    