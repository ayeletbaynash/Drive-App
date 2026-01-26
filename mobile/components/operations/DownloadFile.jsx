import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { styles } from '../../styles/FileItem.styles'; 
import { API_URL } from '../../config';

const DownloadFile = ({ file, onComplete }) => {

    const handleDownload = async () => {
        try {
            // connecting to server to get file content
            const response = await fetch(`http://${API_URL}:8080/api/files/${file.id}`);
            const data = await response.json();

            if (!response.ok || !data.content) {
                throw new Error("Failed to get file content");
            }

            // 2. preparing the local file path on the phone
            const fileName = data.content.startsWith('data:') ? file.name : `${file.name}.txt`;
            const fileUri = FileSystem.cacheDirectory + fileName;

            // 3. writing the file to local storage
            if (data.content.startsWith('data:')) {
                // if it's an uploaded file
                const base64Data = data.content.split(',')[1];
                await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                    encoding: FileSystem.EncodingType.Base64,
                });
            } else {
                // if it's a created text file
                await FileSystem.writeAsStringAsync(fileUri, data.content, {
                    encoding: FileSystem.EncodingType.UTF8,
                });
            }

            // opening the mobile sharing/save menu
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert("Error", "Sharing is not available on this device");
            }

            if (onComplete) onComplete();
        } catch (error) {
            console.error("Error downloading:", error);
            Alert.alert("Download Error", "Could not download the file to your device.");
        }
    };

    return (
        <TouchableOpacity style={styles.simpleButton} onPress={handleDownload}>
            <Text style={{ fontSize: 16 }}>Download</Text>
        </TouchableOpacity>
    );
};

export default DownloadFile;