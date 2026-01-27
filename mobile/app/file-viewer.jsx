import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { API_URL } from '../config'; 
import authorizedFetch from '../services/authorizedFetch'; 
import { styles } from '../styles/FileViewer.styles';
import { Colors } from '../constants/theme';
import { decode as atob } from 'base-64';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

export default function FileViewer() {
    const { id, name } = useLocalSearchParams();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFileContent();
    }, [id]);

    const fetchFileContent = async () => {
        try {
            const response = await authorizedFetch(`${API_URL}/files/${id}`);
            if (!response) throw new Error("No response");
            
            const data = await response.json();
            if (response.ok) {
                setContent(data.content || "");
            } else {
                Alert.alert("Error", data.error || "Failed to load");
            }
        } catch (error) {
            console.error("View Error:", error);
            setContent("Could not connect to server");
        } finally {
            setLoading(false);
        }
    };

    const openPdf = async (base64Data, fileName) => {
    try {
        const safeFileName = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;
        const fileUri = `${FileSystem.cacheDirectory}${safeFileName}`;
        
        const base64Code = base64Data.replace(/^data:application\/pdf;base64,/, "");

        // using FileSystem to write the PDF file
        await FileSystem.writeAsStringAsync(fileUri, base64Code, {
            encoding: 'base64', 
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, {
                mimeType: 'application/pdf',
                dialogTitle: 'Open PDF',
                UTI: 'com.adobe.pdf'
            });
        } else {
            Alert.alert("Error", "Sharing is not available");
        }
        
    } catch (error) {
        console.error("Error opening PDF:", error);
        Alert.alert("Error", "Could not process PDF file");
    }
};

    const renderContent = () => {
        if (!content) return <Text>File is empty</Text>;

        const fileName = name.toLowerCase();

        // 1. Images
        if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            const imageUri = content.startsWith('data:') ? content : `data:image/jpeg;base64,${content}`;
            return (
                <Image 
                    source={{ uri: imageUri }} 
                    style={styles.fullImage} 
                    resizeMode="contain" 
                />
            );
        }

        // 2. PDF
        if (fileName.endsWith('.pdf')) {
            const pdfUri = content.startsWith('data:') ? content : `data:application/pdf;base64,${content}`;
            return (
                <View style={styles.centered}>
                    <Text style={{fontSize: 80}}>📄</Text>
                    <Text style={styles.fileName}>{name}</Text>
                    <TouchableOpacity 
                        style={styles.pdfButton}
                        onPress={() => openPdf(content, name)}
                    >
                        <Text style={styles.pdfLink}>View PDF Document</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        // 3. txt
        if (fileName.endsWith('.txt')) {
        let displayText = content;

        // check if file was uploaded as Base64 or created as plain text
        if (content.startsWith('data:text/plain;base64,')) {
            try {
                const base64Part = content.split(',')[1];
                displayText = atob(base64Part);
            } catch (e) {
                console.error("Base64 decode failed", e);
            }
        } 
        // we check if there are no spaces and it looks like encoded content
        else if (!content.includes(' ') && content.length > 20) {
            try {
                displayText = atob(content);
            } catch (e) {
                // if failed, it's probably just a long text without spaces, so we keep it as is
                displayText = content;
            }
        }

        return (
            <ScrollView style={styles.textContainer}>
                <Text style={styles.textContent}>{displayText}</Text>
            </ScrollView>
        );
    }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{name}</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.light.primary} style={{ flex: 1 }} />
            ) : (
                <View style={styles.contentBody}>
                    {renderContent()}
                </View>
            )}
        </View>
    );
}