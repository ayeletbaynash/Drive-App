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
  
  // 1. נתונים מהקונטקסט
  const [allFiles, setAllFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);

  // 2. שליפת ה-ID של המשתמש המחובר (כדי לדעת מה "שלי")
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

  // 3. משיכת כל הקבצים
  const fetchFiles = async () => {
    setIsLoading(true);
    try {
        // מביאים את כל הקבצים (נניח שזה הנתיב שמחזיר הכל)
        const response = await authorizedFetch(`${API_URL}/files`);
        
        if (response.ok) {
            const data = await response.json();
            // אם ה-API מחזיר אובייקט עם files, נשתמש בו, אחרת בדאטה עצמו
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

  // 4. האזנה לשינויים
  useEffect(() => {
    fetchFiles();

    const listener = DeviceEventEmitter.addListener('somethingChange', () => {
      fetchFiles();
      setRefreshKey(prev => prev + 1);
    });

    return () => listener.remove();
  }, []);

  // 5. ה"מסנן החכם" - בעלות + מחיקות + היררכיה
  const myRawFiles = useMemo(() => {
    if (!currentUserId) return [];

    return allFiles.filter(file => {
        const ownerId = file.user_id || file.owner?._id || file.owner;
        return String(ownerId) === String(currentUserId);
        
    });
  }, [allFiles, currentUserId]);

  const myFinalFiles = useFileFilter(myRawFiles);

  // 6. ניווט
  const handleNavigate = (item) => {
    if (item.type === 'folder') {
        router.push({ pathname: '/', params: { folderId: item.id } });
    }
  };

  return (
    <View style={layoutStyles.container}>
       
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : myFinalFiles.length === 0 ? (
        // מצב ריק
        <EmptyState 
            iconName="folder-open-outline" 
            title="No files found" 
            message="Files you upload or create will appear here."
        />
      ) : (
        // רשימת הקבצים
        <FileViewList 
            items={myFinalFiles} 
            isTrash={false} 
            onFolderPress={handleNavigate}
        />
      )}
    </View>
  );
}