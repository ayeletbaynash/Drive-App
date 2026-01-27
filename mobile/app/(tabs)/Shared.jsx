import React, { useState, useEffect, useMemo } from 'react';
import { View, DeviceEventEmitter, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import EmptyState from '../../components/EmptyState';
import FileViewList from '../../components/FileViewList';
import { createLayoutStyles } from '../../styles/layoutStyles';
import { useAppTheme } from '../../context/ThemeContext'; 
import { useFileActions } from '../../context/FileContext';
import authorizedFetch from '../../services/authorizedFetch';
import { API_URL } from '../../config';
import { Colors } from '../../constants/theme';
import { useFileFilter } from '../../context/useFileFilter'; 

export default function SharedScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const layoutStyles = useMemo(() => createLayoutStyles(theme), [theme]);
  
  const [allFiles, setAllFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Trigger for forcing updates
  const [refreshKey, setRefreshKey] = useState(0);

  // 1. Retrieve logged-in user ID to distinguish "my files" from "shared files"
  useEffect(() => {
    const getUserId = async () => {
        try {
            const id = await AsyncStorage.getItem('userId');
            setCurrentUserId(id);
        } catch (e) {
            console.error("Failed to get userId", e);
        }
    };
    getUserId();
  }, []);

  // 2. Fetch all accessible files from the server
  const fetchFiles = async () => {
    setIsLoading(true);
    try {
        const response = await authorizedFetch(`${API_URL}/files`);
        
        if (response.ok) {
            const data = await response.json();
            const list = data.files || data;
            setAllFiles(Array.isArray(list) ? list : []);
        } else {
            console.log("Failed to fetch files"); 
            setAllFiles([]);
        }
    } catch (error) {
        console.error("Error fetching files:", error);
    } finally {
        setIsLoading(false);
    }
  };

  // 3. Initial fetch and event listener for global updates (uploads, renames, etc.)
  useEffect(() => {
    fetchFiles();

    const listener = DeviceEventEmitter.addListener('somethingChange', () => {
      fetchFiles();
      setRefreshKey(prev => prev + 1); 
    });

    return () => listener.remove();
  }, []);

  // 4. Core Logic: Filter files NOT owned by the current user (Shared with me)
  const sharedRawFiles = useMemo(() => {
    if (!currentUserId) return [];

    return allFiles.filter(file => {
        const ownerId = file.user_id || file.owner?._id || file.owner;
        
        return String(ownerId) !== String(currentUserId);
    });
  }, [allFiles, currentUserId]);

  // Apply additional hierarchy/soft-delete filters
  const visibleSharedFiles = useFileFilter(sharedRawFiles);

  const handleOpenFile = (file) => {
    const realId = file._id || file.id;
    router.push({
      pathname: '/file-viewer',
      params: { 
          id: realId, 
          name: file.name 
      }
    });
  };

  // 5. Navigation Handlers
  const handleNavigate = (item) => {
    if (item.type === 'folder') {
        router.push({ pathname: '/', params: { folderId: item.id, folderName: item.name } });
    }
  };

  return (
    <View style={layoutStyles.container}>
       
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : visibleSharedFiles.length === 0 ? (
        // Empty State
        <EmptyState 
            iconName="people-outline" 
            title="No shared files" 
            message="Files shared with you will appear here."
        />
      ) : (
        // Empty State
        <FileViewList 
            items={visibleSharedFiles} 
            isTrash={false}
            onFolderPress={handleNavigate}
            onFilePress={handleOpenFile}
        />
      )}
    </View>
  );
}