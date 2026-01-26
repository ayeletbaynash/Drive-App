import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';
import { styles } from '../../styles/FolderItem.styles';

const DownloadFolder = ({ folder, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const isCancelled = useRef(false);

    // function to download a single file by ID
    const downloadSingleFile = async (id, fileName) => {
        if (isCancelled.current) return;
        
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_URL}/files/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok && data.content) {
            const fileUri = FileSystem.cacheDirectory + fileName;
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
                <ActivityIndicator color="#0000ff" />
            ) : (
                <Text style={{ color: 'blue' }}>📁 Download Folder Content</Text>
            )}
        </TouchableOpacity>
    );
};

export default DownloadFolder;