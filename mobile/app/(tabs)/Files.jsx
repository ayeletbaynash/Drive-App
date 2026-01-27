import React, { useState, useEffect, useMemo } from 'react';
import { View, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import EmptyState from '../../components/EmptyState';
import FileViewList from '../../components/FileViewList';
import { layoutStyles } from '../../styles/layoutStyles'; 
import authorizedFetch from '../../services/authorizedFetch';
import { API_URL } from '../../config';
import { Colors } from '../../constants/theme'; 
import { useFileFilter } from '../../context/useFileFilter';

export default function FilesScreen() {
  const router = useRouter();
  
  // 1. Local State
  const [allFiles, setAllFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);

  // 2. Fetch current User ID (to identify "my files" later)
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

  // 3. Fetch all files from server
  const fetchFiles = async () => {
    setIsLoading(true);
    try {
        const response = await authorizedFetch(`${API_URL}/files`);
        
        if (response.ok) {
            const data = await response.json();
            const filesList = data.files || data; 
            setAllFiles(Array.isArray(filesList) ? filesList : []);
        } else {
            setAllFiles([]);
        }
    } catch (error) {
        console.error("Error fetching files:", error);
    } finally {
        setIsLoading(false);
    }
  };

  // 4. Listen for global updates (uploads, deletions, etc.)
  useEffect(() => {
    fetchFiles();

    const listener = DeviceEventEmitter.addListener('somethingChange', () => {
      fetchFiles();
      setRefreshKey(prev => prev + 1);
    });

    return () => listener.remove();
  }, []);

  // 5. Filter Logic: Only show files owned by the current user
  const myRawFiles = useMemo(() => {
    if (!currentUserId) return [];

    return allFiles.filter(file => {
        const ownerId = file.user_id || file.owner?._id || file.owner;
        return String(ownerId) === String(currentUserId);
        
    });
  }, [allFiles, currentUserId]);

  // Apply hierarchy and soft-delete filters
  const myFinalFiles = useFileFilter(myRawFiles);

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

  // 6. Navigation Handlers
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
      ) : myFinalFiles.length === 0 ? (
        // Empty State
        <EmptyState 
            iconName="folder-open-outline" 
            title="No files found" 
            message="Files you upload or create will appear here."
        />
      ) : (
        // Files List
        <FileViewList 
            items={myFinalFiles} 
            isTrash={false} 
            onFolderPress={handleNavigate}
            onFilePress={handleOpenFile}
        />
      )}
    </View>
  );
}