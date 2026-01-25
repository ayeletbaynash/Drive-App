import { useState, useEffect, useCallback } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { authorizedFetch } from '../services/authorizedFetch';
import { useFileActions } from './FileContext';

export const useRecentFiles = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { deletedFiles } = useFileActions();

  // --- Recursive Fetch Logic ---
  const fetchAllFilesRecursive = async (folderId = null) => {
    const url = folderId === null ? '/files' : `/files/${folderId}`;

    try {
      const response = await authorizedFetch(url);
      if (!response || !response.ok) return [];

      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.children || []);

      // Filter out files that are in the deletedFiles list from context
      const validItems = items.filter(item => !deletedFiles.some(d => d.id === item.id));
      
      const currentLevelFiles = validItems.filter(item => item.type === 'file');
      const currentLevelFolders = validItems.filter(item => item.type === 'folder');

      let allSubFiles = [];
      // Recursively fetch subfolders
      for (const folder of currentLevelFolders) {
        const subFiles = await fetchAllFilesRecursive(folder.id);
        allSubFiles = [...allSubFiles, ...subFiles];
      }

      return [...currentLevelFiles, ...allSubFiles];
    } catch (error) {
      console.error("Error in recursion:", error);
      return [];
    }
  };

  const onRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const allFetchedFiles = await fetchAllFilesRecursive(null);
      
      // Sort by updated_at (Newest first)
      const sortedFiles = allFetchedFiles.sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
      });

      setFiles(sortedFiles);
    } catch (error) {
      console.error("Failed to refresh recent files:", error);
    } finally {
      setIsLoading(false);
    }
  }, [deletedFiles]); // Re-run if deletedFiles changes

  // --- Listeners ---
  useEffect(() => {
    onRefresh();

    // Listen for global updates (like file uploads/changes)
    const subscription = DeviceEventEmitter.addListener('somethingChange', onRefresh);

    return () => {
      subscription.remove();
    };
  }, [onRefresh]);

  return { files, isLoading, onRefresh };
};