import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import { Colors } from '../../constants/theme';
import { layoutStyles } from '../../styles/layoutStyles';
import FileViewList from '../../components/FileViewList';

export default function HomeScreen() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const onRefresh = async () => {
    setIsLoading(true);
    try {
      const mockData = [
        { id: '1', name: 'Work Documents.png', type: 'file', lastModified: '2024-01-10' },
        { id: '2', name: 'Resume.pdf', type: 'file', lastModified: '2024-01-12' },
        { id: '3', name: 'Notes.txt', type: 'file', lastModified: '2024-01-15' },
      ];
      setFiles(mockData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onRefresh();

    const subscription = DeviceEventEmitter.addListener('somethingChanged', () => {
      onRefresh();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={layoutStyles.container}>
      
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.light.primary} />
      ) : (
        <FileViewList items={files} isTrash={false} />
      )}
    </View>
  );
}