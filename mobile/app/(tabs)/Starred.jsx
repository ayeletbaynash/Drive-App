import React, { useState, useEffect, useRef } from 'react';
import { View, DeviceEventEmitter, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import EmptyState from '../../components/EmptyState';
import FileViewList from '../../components/FileViewList';
import { layoutStyles } from '../../styles/layoutStyles'; 
import { useFileActions } from '../../context/FileContext';
import { Colors } from '../../constants/theme'; 
import authorizedFetch from '../../services/authorizedFetch';
import { API_URL } from '../../config';

export default function Starred() {
  const router = useRouter();
  
  // 1. שליפת המידע והפונקציה החדשה
  const { starredFiles, deletedFiles, refreshStarredFiles } = useFileActions();
  
  const [visibleFiles, setVisibleFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cache לחיסכון בביצועים
  const folderCache = useRef(new Map());

  // --- פונקציית הסינון החכם (בודקת גם הורים וסבים) ---
  const isUnderDeletedFolder = async (file) => {
    // 1. האם הקובץ עצמו במחוקים המקומיים?
    if (deletedFiles.some(d => d.id === file.id)) return true;

    let currentId = file.parent_id;

    // מטפסים למעלה בעץ התיקיות
    while (currentId !== null) {
      // האם האבא במחוקים המקומיים?
      if (deletedFiles.some(d => d.id === currentId)) {
        folderCache.current.set(currentId, { isDeleted: true, parentId: null });
        return true; 
      }

      // האם בדקנו אותו כבר?
      if (folderCache.current.has(currentId)) {
        const cached = folderCache.current.get(currentId);
        if (cached.isDeleted) return true;
        currentId = cached.parentId;
        continue;
      }

      // בדיקה מול השרת ליתר ביטחון (למקרים של סבא שנמחק במכשיר אחר)
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

  // --- אפקט שמאזין לשינויים ומרענן מהשרת ---
  useEffect(() => {
    // טעינה ראשונית מהשרת (פותר את בעיית הכניסה מחדש)
    if (refreshStarredFiles) refreshStarredFiles();

    const listener = DeviceEventEmitter.addListener('somethingChange', async () => {
      // כשיש שינוי, נרענן מהשרת כדי לוודא שאין יתומים
      if (refreshStarredFiles) await refreshStarredFiles();
    });

    return () => listener.remove();
  }, []);

  // --- אפקט שמסנן את הרשימה המוצגת ---
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
    const realId = file._id || file.id; // נרמול מזהה
    router.push({
      pathname: '/file-viewer',
      params: { 
          id: realId, 
          name: file.name 
      }
    });
  };

  const handleNavigate = (item) => {
    if (item.type === 'folder') {
        router.push({ pathname: '/', params: { folderId: item.id, folderName: item.name } });
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