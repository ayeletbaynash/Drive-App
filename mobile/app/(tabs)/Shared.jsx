import React, { useState, useEffect, useMemo } from 'react';
import { View, DeviceEventEmitter, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import EmptyState from '../../components/EmptyState';
import FileViewList from '../../components/FileViewList';
import { layoutStyles } from '../../styles/layoutStyles'; 
import { useFileActions } from '../../context/FileContext';
import authorizedFetch from '../../services/authorizedFetch';
import { API_URL } from '../../config';
import { Colors } from '../../constants/theme';
import { useFileFilter } from '../../context/useFileFilter'; 

export default function SharedScreen() {
  const router = useRouter();
  
  const [allFiles, setAllFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // טריגר לרענון
  const [refreshKey, setRefreshKey] = useState(0);

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

  // 2. פונקציית משיכת נתונים (קבצים ששותפו איתי)
  const fetchFiles = async () => {
    setIsLoading(true);
    try {
        // הערה: ודאי שיש לך את הנתיב הזה בשרת, או שתשני למה שרלוונטי אצלך
        const response = await authorizedFetch(`${API_URL}/files`);
        
        if (response.ok) {
            const data = await response.json();
            const list = data.files || data;
            setAllFiles(Array.isArray(list) ? list : []);
        } else {
            // אם אין עדיין את הנתיב בשרת, זה לא יקריס את האפליקציה
            console.log("Failed to fetch files"); 
            setAllFiles([]);
        }
    } catch (error) {
        console.error("Error fetching files:", error);
    } finally {
        setIsLoading(false);
    }
  };

  // 3. שימוש ב-Effect לטעינה ראשונית והאזנה לשינויים
  useEffect(() => {
    fetchFiles();

    const listener = DeviceEventEmitter.addListener('somethingChange', () => {
      fetchFiles(); // רענון מהשרת
      setRefreshKey(prev => prev + 1); // רענון פנימי לפילטר
    });

    return () => listener.remove();
  }, []);

  const sharedRawFiles = useMemo(() => {
    if (!currentUserId) return [];

    return allFiles.filter(file => {
        // בדיקת הבעלים (תומך בכמה מבנים שהשרת עשוי להחזיר)
        const ownerId = file.user_id || file.owner?._id || file.owner;
        
        // אנחנו רוצים רק את מה ש**שונה** מה-ID שלי
        return String(ownerId) !== String(currentUserId);
    });
  }, [allFiles, currentUserId]);

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

  // 5. ניווט
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
        // מצב ריק
        <EmptyState 
            iconName="people-outline" 
            title="No shared files" 
            message="Files shared with you will appear here."
        />
      ) : (
        // רשימת הקבצים
        <FileViewList 
            items={visibleSharedFiles} 
            isTrash={false} // במסך שיתוף לא מציגים אשפה
            onFolderPress={handleNavigate}
            onFilePress={handleOpenFile}
        />
      )}
    </View>
  );
}