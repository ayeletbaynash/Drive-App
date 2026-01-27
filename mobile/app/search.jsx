import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, ActivityIndicator, DeviceEventEmitter } from 'react-native'; // <-- הוספנו DeviceEventEmitter
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import authorizedFetch from '../services/authorizedFetch'; 
import { useFileActions } from '../context/FileContext';
import FileItem from '../components/FileItem';
import FolderItem from '../components/FolderItem';
import { createSearchStyles } from '../styles/searchStyles';
import { API_URL } from '../config';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { theme } = useAppTheme();
  const searchStyles = useMemo(() => createSearchStyles(theme), [theme]);
  const router = useRouter();
  const { deletedFiles } = useFileActions();
  
  const folderCache = useRef(new Map());

  // Hierarchy Check (Soft Delete)
  const isUnderDeletedFolder = async (file) => {
    if (deletedFiles.some(d => d.id === file.id)) return true;

    let currentId = file.parent_id;

    while (currentId !== null) {
      if (deletedFiles.some(d => d.id === currentId)) {
        folderCache.current.set(currentId, { isDeleted: true, parentId: null });
        return true;
      }

      if (folderCache.current.has(currentId)) {
        const cached = folderCache.current.get(currentId);
        if (cached.isDeleted) return true;
        currentId = cached.parentId;
        continue;
      }

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
        console.error("Error checking ancestry:", e);
        return false;
      }
    }
    return false;
  };

  // Execute Search
  const performSearch = async (text, signal) => {
    if (!text.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    folderCache.current.clear();

    try {
      const response = await authorizedFetch(`${API_URL}/search/${encodeURIComponent(text)}`, { signal });
      if (response.ok) {
        const data = await response.json();
        const lowerQuery = text.toLowerCase();
        
        const filterPromises = data.map(async (item) => {
            const fileName = (item.name || "").toLowerCase();
            const isImageOrPdf = fileName.endsWith('.png') || 
                                 fileName.endsWith('.jpg') || 
                                 fileName.endsWith('.jpeg') ||
                                 fileName.endsWith('.pdf');
            
            if (isImageOrPdf) {
                if (!fileName.includes(lowerQuery)) {
                    return null; 
                }
            }

            // Check against soft-delete hierarchy
            const isDeleted = await isUnderDeletedFolder(item);
            return isDeleted ? null : item;
        });

        const resolvedResults = await Promise.all(filterPromises);
        const validResults = resolvedResults.filter(item => item !== null);

        setResults(validResults); 
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Search error:", error);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Effects

  // 1. Debounce search input
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      performSearch(query, controller.signal);
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, deletedFiles]); 

  // 2. Listen for external updates (Rename, Upload, etc.)
  useEffect(() => {
    const refreshSearch = () => {
        if (query.trim().length > 0) {
            performSearch(query); 
        }
    };

    const subscription = DeviceEventEmitter.addListener('somethingChange', refreshSearch);

    return () => {
        subscription.remove();
    };
  }, [query]); 

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

  const handleOpenFolder = (folder) => {
    const realId = folder._id || folder.id;
    router.push({
        pathname: '/(tabs)', 
        params: { 
            folderId: realId, 
            folderName: folder.name 
        }
    });
  };
  
  // Render Item Logic
  const renderSearchResult = ({ item }) => {
    const fileName = item.name || "";
    const isFolder = item.type === 'folder' || (fileName.length > 0 && !fileName.includes('.'));
    const normalizedItem = { ...item, id: item._id || item.id };

    if (isFolder) {
        return (
            <FolderItem 
                folder={normalizedItem} 
                isTrash={false} 
                onFolderPress={handleOpenFolder} 
            />
        );
    }

    // Render regular file
    return (
        <FileItem 
            file={normalizedItem} 
            onOpen={() => handleOpenFile(normalizedItem)} 
            isTrash={false}
        />
    );
  };

  return (
    <SafeAreaView 
       edges={['left', 'right', 'bottom']}
       style={searchStyles.container}
    >
      <View style={searchStyles.header}>
        <TouchableOpacity onPress={() => router.back()} style={searchStyles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.textMuted} />
        </TouchableOpacity>

        <View style={searchStyles.inputWrapper}>
          <Ionicons name="search" size={20} color={theme.textMuted} />
          <TextInput
            style={searchStyles.input}
            placeholder="Search in Drive"
            placeholderTextColor={theme.textMuted}
            autoFocus={true}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {isSearching && <ActivityIndicator size="small" color={theme.primary} />}
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id || item._id}
        contentContainerStyle={searchStyles.listContent}
        keyboardShouldPersistTaps="handled"
        renderItem={renderSearchResult}
        ListEmptyComponent={
          !isSearching && query.length > 0 && (
            <View style={searchStyles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={theme.textMuted} style={{ opacity: 0.5 }} />
              <Text style={searchStyles.emptyText}>No results found</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}