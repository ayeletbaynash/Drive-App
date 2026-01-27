import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, ActivityIndicator, DeviceEventEmitter, Alert, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/theme';
import { createLayoutStyles } from '../../styles/layoutStyles.js';
import { useAppTheme } from '../../context/ThemeContext';
import FileViewList from '../../components/FileViewList'
import authorizedFetch from '../../services/authorizedFetch.jsx'
import { API_URL } from '../../config';
import { useFileActions } from '../../context/FileContext'
import EmptyState from '../../components/EmptyState'; 
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useFileFilter } from '../../context/useFileFilter';

export default function HomeScreen() {
    const { folderId, folderName } = useLocalSearchParams(); 
    const router = useRouter()
    const { theme } = useAppTheme();
    const layoutStyles = useMemo(() => createLayoutStyles(theme), [theme]);
    const { deletedFiles } = useFileActions();
    
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentFolder, setCurrentFolder] = useState({ id: null, name: null });

    // 1. Data Fetching Logic
    const onRefresh = async () => {
        setIsLoading(true);
        try {
            // Determine API endpoint: Root vs Specific Folder
            const url = folderId ? `${API_URL}/files/${folderId}` : `${API_URL}/files`;
            const response = await authorizedFetch(url);

            if (response && response.ok) {
                const data = await response.json();
                if (folderId) {
                    setFiles(data.children || []);
                    setCurrentFolder({ id: data.id, name: data.name });
                } else {
                    setFiles(data.files || data);
                    setCurrentFolder({ id: null, name: null });
                }
            } else if (response) {
                const errorData = await response.json().catch(() => ({}));
                Alert.alert("Error", errorData.message || "Could not fetch files");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            Alert.alert("Connection Error", "Please check your server and IP address");
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Side Effects & Listeners 
    useEffect(() => {
        onRefresh();

        const subscription = DeviceEventEmitter.addListener('somethingChange', () => {
            onRefresh();
        });

        return () => {
            subscription.remove();
        };
    }, [folderId]);

    // 3. Filtering (Soft Delete)
    const visibleFiles = useFileFilter(files);

    // 4. Navigation
    const handleNavigate = (item) => {
        if (item.type === 'folder') {
            router.push({ pathname: '/', params: { folderId: item.id, folderName: item.name } });
        }
    };

    return (
        <View style={layoutStyles.container}>
           {folderId ? (
        <View style={layoutStyles.headerContainer}>
            <TouchableOpacity 
                onPress={() => {
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.replace('/'); 
                    }
                }} 
                style={layoutStyles.backButton}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
                <Text style={layoutStyles.backIcon}>←</Text>
            </TouchableOpacity>
            
            <Text style={layoutStyles.headerTitle} numberOfLines={1}>
                {folderName || currentFolder.name || (isLoading ? 'Loading...' : 'Folder')}
            </Text>
        </View>
    ) : null}

        <View style={{ flex: 1 }}>
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.light.primary} />
                </View>
            ) : visibleFiles.length === 0 ? (
                <EmptyState 
                    iconName={folderId ? "folder-open-outline" : "cloud-upload-outline"} 
                        title={folderId ? "Empty Folder" : "No files yet"} 
                        message={folderId ? "This folder is empty." : "Use the + button to upload files or create new folders."}
                />
            ) : (
                <FileViewList 
                    items={visibleFiles} 
                    isTrash={false} 
                    onFolderPress={handleNavigate} 
                />
            )}
        </View>
        </View>
    );
}