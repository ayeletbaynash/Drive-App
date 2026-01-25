import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, DeviceEventEmitter, Alert } from 'react-native';
import { Colors } from '../../constants/theme';
import { layoutStyles } from '../../styles/layoutStyles';
import FileViewList from '../../components/FileViewList';
import authorizedFetch from '../../services/authorizedFetch';
import { API_URL } from '../../config';

export default function HomeScreen() {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const onRefresh = async () => {
        setIsLoading(true);
        try {
            const response = await authorizedFetch(`${API_URL}/files`);

            if (response.ok) {
                const data = await response.json();
                setFiles(data)
            } else {
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
            console.log("Change detected, refreshing...");
            onRefresh();
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <View style={layoutStyles.container}>
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.light.primary} />
                </View>
            ) : (
                <FileViewList items={files} isTrash={false} />
            )}
        </View>
    );
}