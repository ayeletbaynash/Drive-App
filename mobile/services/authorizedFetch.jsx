import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export const authorizedFetch = async (url, options = {}) => {
    try {
        // retrieve stored authentication data from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');

        //  Build headers with Authorization and User ID
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            'Authorization': `Bearer ${token}`, 
            'user-id': userId 
        };

        // Execute the fetch request
        const response = await fetch(url, { 
            ...options, 
            headers 
        });

        // Handle Unauthorized access (e.g., expired token)
        if (response.status === 401) {
            console.warn("Token expired or invalid, logging out...");
            
            // Clear all user data from storage
            await AsyncStorage.multiRemove([
                'token', 
                'user', 
                'userId', 
                'firstName', 
                'username', 
                'userImage',
                'userEmail'
            ]);

            // Redirect to login and reset navigation stack
            router.replace('/login');
            return null;
        }

        return response;

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("Request aborted (search typing)"); 
        } else {
            console.error("AuthorizedFetch Error:", error);
        }
        
        throw error;
    }
};