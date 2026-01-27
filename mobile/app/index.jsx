import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { Redirect } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFileActions } from '../context/FileContext';
import { useAppTheme } from '../context/ThemeContext';

export default function Index() {
    const { userId, setUserId } = useFileActions();
    const { theme } = useAppTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                //Check if a user is already saved in device storage
                const savedUser = await AsyncStorage.getItem('user');
                
                if (savedUser) {
                    const user = JSON.parse(savedUser);
                    // Update the Global Context so the app knows the user is logged in
                    setUserId(user.id);
                    setHasToken(true);
                }
            } catch (e) {
                console.error("Error checking auth", e);
            } finally {
                //  Stop the loading spinner once the check is complete
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // While checking storage, show a loading spinner
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    // Decide where to go:
    // If we have a token -> Redirect to Tabs (Home)
    // If no token -> Redirect to Login
    return hasToken !== null ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />
}