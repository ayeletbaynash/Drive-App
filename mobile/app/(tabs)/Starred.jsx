import React, { useState, useEffect, useRef } from 'react';
import { View, DeviceEventEmitter, ActivityIndicator } from 'react-native';
import EmptyState from '../../components/EmptyState';
import FileViewList from '../../components/FileViewList';
import { layoutStyles } from '../../styles/layoutStyles'; 
import { useFileActions } from '../../context/FileContext';
import { Colors } from '../../constants/theme'; 
import authorizedFetch from '../../services/authorizedFetch';
import { API_URL } from '../../config';
import { useLocalSearchParams, useRouter } from 'expo-router'

export default function Starred() {
  const router = useRouter();
  const { folderId } = useLocalSearchParams()
  
  // Context & State
  const { starredFiles, deletedFiles, refreshStarredFiles } = useFileActions();
  
  const [visibleFiles, setVisibleFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Optimization: Cache folder ancestry checks to reduce server calls
  const folderCache = useRef(new Map());

  // Logic: Check if any ancestor folder is deleted
  const isUnderDeletedFolder = async (file) => {
    if (deletedFiles.some(d => d.id === file.id)) return true;

    let currentId = file.parent_id;

    // Climb up the directory tree
    while (currentId !== null) {
      if (deletedFiles.some(d => d.id === currentId)) {
        folderCache.current.set(currentId, { isDeleted: true, parentId: null });
        return true; 
      }

      // Check cache to avoid re-fetching known folders
      if (folderCache.current.has(currentId)) {
        const cached = folderCache.current.get(currentId);
        if (cached.isDeleted) return true;
        currentId = cached.parentId;
        continue;
      }

      // Verify parent existence on server (handles deletions made on other devices)
      try {
        const response = await authorizedFetch(`${API_URL}/files/${currentId}`);
        if (!response.ok) {
           folderCache.current.set(currentId, { isDeleted: true, parentId: null });
           return true;
        }
        const folder = await response.json();
        folderCache.current.set(currentId, { isDeleted: false, parentId: folder.parent_id });
        currentId = folder.parent_id;
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  // Sync with Server & Event Listeners
  useEffect(() => {
    if (refreshStarredFiles) refreshStarredFiles();

    const listener = DeviceEventEmitter.addListener('somethingChange', async () => {
      if (refreshStarredFiles) await refreshStarredFiles();
    });

    return () => listener.remove();
  }, []);

  // Filter Logic: Process files asynchronously
  useEffect(() => {
    const runFilter = async () => {
        setLoading(true);
        folderCache.current.clear();

        const checks = starredFiles.map(async (file) => {
            const shouldHide = await isUnderDeletedFolder(file);
            return shouldHide ? null : file;
        });

        const results = await Promise.all(checks);
        setVisibleFiles(results.filter(f => f !== null));
        setLoading(false);
    };

    runFilter();
  }, [starredFiles, deletedFiles]);

  const handleOpenFile = (file) => {
    const realId = file._id || file.id; 
    router.push({
      pathname: '/file-viewer',
      params: { 
          id: realId, 
          name: file.name,
          parentId: folderId
      }
    });
  };

  const handleNavigate = (item) => {
    if (item.type === 'folder') {
      const targetId = item._id || item.id
        router.push({ pathname: '/(tabs)/Starred', params: { folderId: targetId, folderName: item.name, parentId: folderId } });
    }
  };

  return (
    <View style={layoutStyles.container}>
       
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : visibleFiles.length === 0 ? (
        <EmptyState 
            iconName="star-outline" 
            title="No starred files" 
            message="Add files to Starred to find them easily later."
        />
      ) : (
        <FileViewList 
            items={visibleFiles} 
            isTrash={false} 
            onFolderPress={handleNavigate}
            onFilePress={handleOpenFile}
        />
      )}
    </View>
  );
}