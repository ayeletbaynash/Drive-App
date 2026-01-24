import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
//import { AsyncStorage } from 'react-native'; // for storing token and user info
import { API_URL } from '../config';
import AppLogo from '../components/AppLogo';
import { styles } from '../styles/authentication'; // shared styles file
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation, onLogin }) => {
    // State to manage input fields (Matches Web structure)
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState(''); // State to manage error messages

    const handleSubmit = async () => {
        setError(''); // Reset error state before starting request

        try {
            // Sending login credentials to the Node.js API server (matching /tokens endpoint)
            const response = await fetch(`${API_URL}/tokens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            // Handling the server response
            const data = await response.json();

            if (response.ok) {
                /* SUCCESS: The server verified the credentials and sent back a JWT.
                   We store the token in AsyncStorage so it persists.
                */
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem('user', JSON.stringify(data));

                // Store the username and photo to personalize the UI later (Matching Web logic)
                if (data.id) await AsyncStorage.setItem('userId', String(data.id))
                if (data.firstName) await AsyncStorage.setItem('firstName', data.firstName);
                if (data.username) await AsyncStorage.setItem('username', data.username);
                if (data.image) await AsyncStorage.setItem('userImage', data.image);
                if (data.emailAddress) await AsyncStorage.setItem('userEmail', data.emailAddress);

                if (onLogin) {
                    onLogin(data); // This updates the global user state
                }
                
                // Redirect user to the home page 
                router.replace('/(tabs)')
            } else {
                // SERVER ERROR: e.g., Wrong password or user not found
                setError(data.message || 'Invalid username or password');
            }
        } catch (err) {
            console.log("Detailed Error:", err);
            // NETWORK ERROR: The server is down or unreachable
            setError('Connection to server failed. Please try again later.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Logo Wrapper matching your Web scale (1.6) */}
            <View style={styles.logoWrapper}>
                <AppLogo scale={1.6} />
            </View>
            <Text style={[styles.title, { marginTop: -30 }]}>Login to your account</Text>

            {/* Visually display errors like Alert in Bootstrap */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={{ marginTop: 10 }}>
                <TextInput 
                    style={styles.input} 
                    placeholder="User Name" 
                    placeholderTextColor="#999"
                    onChangeText={(val) => setFormData({...formData, username: val})}
                    autoCapitalize="none"
                />

                <TextInput 
                    style={styles.input} 
                    placeholder="Password" 
                    placeholderTextColor="#999"
                    secureTextEntry={true} 
                    onChangeText={(val) => setFormData({...formData, password: val})}
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>
            </View>

            {/* Register link matching your Web logic */}
            <View style={styles.linkContainer}>
                <Text style={styles.linkText}>
                    Don't have an account? {' '}
                    <Text 
                        style={styles.authLink} 
                        onPress={() => router.push('/registration')}
                    >
                        Register here
                    </Text>
                </Text>
            </View>
        </ScrollView>
    );
};

export default LoginScreen;