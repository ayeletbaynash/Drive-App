import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';
import { createFolderItemStyles } from '../../styles/FolderItem.styles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '../../context/ThemeContext';

const DownloadFolder = ({ folder, onSuccess }) => {
    const { theme } = useAppTheme();
    const styles = createFolderItemStyles(theme);
    const [isLoading, setIsLoading] = useState(false);
    const isCancelled = useRef(false);

    const getExtensionFromMime = (dataUri) => {
        const mime = dataUri.match(/data:([^;]+);/);
        if (mime && mime[1]) {
            return mime[1].split('/')[1];
        }
        return 'txt';
    };

    // function to download a single file by ID
    const downloadSingleFile = async (id, fileName) => {
        if (isCancelled.current) return;
        
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_URL}/files/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok && data.content) {
            let finalFileName = fileName;

            if (data.content.startsWith('data:')) {
                const extension = getExtensionFromMime(data.content);
                if (!finalFileName.toLowerCase().endsWith(`.${extension}`)) {
                    finalFileName = `${finalFileName}.${extension}`;
                }
            } else if (!finalFileName.includes('.')) {
                finalFileName = `${finalFileName}.txt`;
            }

            const fileUri = FileSystem.cacheDirectory + finalFileName;

            const isBase64 = data.content.startsWith('data:') || (data.content.length > 100 && !data.content.includes(" "));
            
            if (isBase64) {
                const base64Data = data.content.includes(',') ? data.content.split(',')[1] : data.content;
                await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: 'base64' });
            } else {
                await FileSystem.writeAsStringAsync(fileUri, data.content, { encoding: 'utf8' });
            }
            console.log(`Downloaded: ${fileName}`);
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            }
            return fileUri;
        }
    };

    // recursive function to process folder contents
    const processFolder = async (folderId, visited = new Set()) => {
        if (isCancelled.current) return;
        if (visited.has(String(folderId))) return;
        visited.add(String(folderId));

        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_URL}/files/${folderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        const allItems = data.children || [];

        for (const item of allItems) {
            if (isCancelled.current) break;

            if (item.type === 'folder') {
                await processFolder(item.id, visited);
            } else {
                await downloadSingleFile(item.id, item.name);
                await new Promise(r => setTimeout(r, 300));
            }
        }
    };

    const handleFolderDownload = async () => {
        setIsLoading(true);
        isCancelled.current = false;

        try {
            await processFolder(folder.id);
            Alert.alert("Success", "All folder contents downloaded to cache!");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Recursive download error:", error);
            Alert.alert("Error", "Failed to download folder content");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TouchableOpacity 
            onPress={handleFolderDownload}
            disabled={isLoading}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
        >
            {isLoading ? (
                <ActivityIndicator color={theme.primary} />
            ) : (
                <>
        <MaterialCommunityIcons name="folder-download-outline" size={24} color={theme.textMain} />
        <Text style={{ color: theme.textMain }}> Download Folder Content</Text>
    </>
            )}
        </TouchableOpacity>
    );
};

export default DownloadFolder;