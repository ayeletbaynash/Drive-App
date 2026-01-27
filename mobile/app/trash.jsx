import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { useTrashFiles } from '../context/useTrashFiles'; // <-- הייבוא מתוך context
import { createTrashStyles } from '../styles/trashStyles';
import FileItem from '../components/FileItem';

export default function TrashScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const styles = createTrashStyles(theme);
  
  const { deletedFiles, handleRestore } = useTrashFiles();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.textMuted} />
        </TouchableOpacity>
        <Text style={styles.title}>Recycle Bin</Text>
      </View>

      {/* Content */}
      <FlatList
        data={deletedFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FileItem 
            file={item} 
            isTrash={true} 
            onRestore={() => handleRestore(item.id)} 
            onOpen={() => alert("Cannot open deleted file")} 
          />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="trash-outline" size={64} color={theme.textMuted} style={{ opacity: 0.5 }} />
            <Text style={styles.emptyText}>Recycle Bin is empty</Text>
          </View>
        }
        contentContainerStyle={deletedFiles.length === 0 ? styles.listEmpty : styles.listContent}
      />
    </SafeAreaView>
  );
}