import React, { useState, useEffect, useMemo } from 'react';
import { View, DeviceEventEmitter, ActivityIndicator, Alert } from 'react-native';
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
  
  // 1. נתונים מהקונטקסט ומקומיים
  const { deletedFiles } = useFileActions();
  const [sharedFiles, setSharedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // טריגר לרענון
  const [refreshKey, setRefreshKey] = useState(0);

  // 2. פונקציית משיכת נתונים (קבצים ששותפו איתי)
  const fetchSharedFiles = async () => {
    setIsLoading(true);
    try {
        // הערה: ודאי שיש לך את הנתיב הזה בשרת, או שתשני למה שרלוונטי אצלך
        const response = await authorizedFetch(`${API_URL}/files/shared`);
        
        if (response.ok) {
            const data = await response.json();
            setSharedFiles(data);
        } else {
            // אם אין עדיין את הנתיב בשרת, זה לא יקריס את האפליקציה
            console.log("Failed to fetch shared files"); 
            setSharedFiles([]);
        }
    } catch (error) {
        console.error("Error fetching shared files:", error);
    } finally {
        setIsLoading(false);
    }
  };

  // 3. שימוש ב-Effect לטעינה ראשונית והאזנה לשינויים
  useEffect(() => {
    fetchSharedFiles();

    const listener = DeviceEventEmitter.addListener('somethingChange', () => {
      fetchSharedFiles(); // רענון מהשרת
      setRefreshKey(prev => prev + 1); // רענון פנימי לפילטר
    });

    return () => listener.remove();
  }, []);

  const visibleSharedFiles = useFileFilter(sharedFiles);
  // 5. ניווט
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
        />
      )}
    </View>
  );
}