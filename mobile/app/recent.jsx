import React from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { useRecentFiles } from '../context/useRecentFiles'; // Import from context folder
import { createRecentStyles } from '../styles/recentStyles';
import FileItem from '../components/FileItem';

export default function RecentScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const styles = createRecentStyles(theme);
  
  // Use the hook for logic
  const { files, isLoading, onRefresh } = useRecentFiles();

  const handleOpenFile = (file) => {
    router.push({
      pathname: '/file-viewer',
      params: { file: JSON.stringify(file) }
    });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.textMuted} />
        </TouchableOpacity>
        <Text style={styles.title}>Recent Files</Text>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Scanning recent activity...</Text>
        </View>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FileItem 
              file={item} 
              onOpen={() => handleOpenFile(item)}
              isTrash={false}
            />
          )}
          refreshing={isLoading}
          onRefresh={onRefresh} // Pull to refresh support
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="time-outline" size={64} color={theme.textMuted} style={{ opacity: 0.5 }} />
              <Text style={styles.emptyText}>No recent files found</Text>
            </View>
          }
          contentContainerStyle={files.length === 0 ? styles.listEmpty : styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}