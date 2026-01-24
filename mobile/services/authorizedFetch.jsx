import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export const authorizedFetch = async (url, options = {}) => {
    try {
        // 1. Retrieve stored authentication data from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');

        // 2. Build headers with Authorization and User ID
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            'Authorization': `Bearer ${token}`, 
            'user-id': userId 
        };

        // 3. Execute the fetch request
        const response = await fetch(url, { 
            ...options, 
            headers 
        });

        // 4. Handle Unauthorized access (e.g., expired token)
        if (response.status === 401) {
            console.warn("Token expired or invalid, logging out...");
            
            // Clear all user data from storage
            await AsyncStorage.multiRemove([
                'token', 
                'user', 
                'userId', 
                'firstName', 
                'username', 
                'userImage'
            ]);

            // Redirect to login and reset navigation stack
            router.replace('/login');
            return null;
        }

        return response;

    } catch (error) {
        console.error("AuthorizedFetch Error:", error);
        throw error;
    }
};