import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator, DeviceEventEmitter, Alert, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/theme';
import { layoutStyles } from '../../styles/layoutStyles'
import FileViewList from '../../components/FileViewList'
import  authorizedFetch  from '../../services/authorizedFetch'
import { API_URL } from '../../config';
import { useLocalSearchParams, useRouter } from 'expo-router'

export default function HomeScreen() {
    const { folderId } = useLocalSearchParams(); 
    const router = useRouter();
    
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentFolder, setCurrentFolder] = useState({ id: null, name: null });

    const onRefresh = async () => {
        setIsLoading(true);
        try {
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

    useEffect(() => {
        onRefresh();

        const subscription = DeviceEventEmitter.addListener('somethingChange', () => {
            onRefresh();
        });

        return () => {
            subscription.remove();
        };
    }, [folderId]);

    const handleNavigate = (item) => {
        if (item.type === 'folder') {
            router.push({ pathname: '/', params: { folderId: item.id } });
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
                {isLoading ? 'Loading...' : currentFolder.name}
            </Text>
        </View>
    ) : null}

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.light.primary} />
                </View>
            ) : (
                <FileViewList 
                    items={files} 
                    isTrash={false} 
                    onFolderPress={handleNavigate} 
                />
            )}
        </View>
    );
}