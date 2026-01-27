import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import { styles } from '../../styles/FileItem.styles'; 
import { API_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

const DownloadFile = ({ file, onComplete }) => {

    const handleDownload = async () => {
        try {
            const token = await AsyncStorage.getItem('token'); // get auth token
            // connecting to server to get file content
            console.log("Starting download for ID:", file.id);
            const response = await fetch(`${API_URL}/files/${file.id}`, {
                method: 'GET', 
                headers: {
                'Authorization': `Bearer ${token}`, // include auth token in headers
                },
            });

            const responseText = await response.text(); 
            console.log("SERVER RESPONSE TEXT:", responseText);

            //const data = await response.json(); 

            if (!response.ok) {
            throw new Error(`Server status: ${response.status} - ${responseText}`);
            }

            const data = JSON.parse(responseText); // parsing the response text to JSON
            if (!data.content) {
            throw new Error("File content is missing in JSON");
            }

            // 2. preparing the local file path on the phone
            const fileName = data.content.startsWith('data:') ? file.name : `${file.name}.txt`;
            const fileUri = FileSystem.cacheDirectory + fileName;

            // 3. writing the file to local storage
            const isBase64 = data.content.length > 100 && !data.content.includes(" ");

            if (data.content.startsWith('data:') || isBase64) {
                const base64Data = data.content.includes(',') ? data.content.split(',')[1] : data.content;
                await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                    encoding: 'base64',
                });
            } else {
                await FileSystem.writeAsStringAsync(fileUri, data.content, {
                    encoding: 'utf8',
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