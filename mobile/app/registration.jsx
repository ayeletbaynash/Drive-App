import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { API_URL } from '../config';
import * as ImagePicker from 'expo-image-picker'; // for image upload
import AppLogo from '../components/AppLogo';
import { styles } from '../styles/authentication';
import { router } from 'expo-router';

const RegisterScreen = () => {
    const [formData, setFormData] = useState({
        firstName: '', username: '', password: '', confirmPassword: '', emailAddress: '', image: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setError('');

        // Validation - just like in WEB 
        if (formData.username.includes(' ')) {
            setError("Username cannot contain spaces");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        if (!passwordRegex.test(formData.password)) {
            setError("Password must include at least one uppercase letter, one lowercase letter, and one number.");
            return;
        }

        // Send to server (localhost is replaced computer IP)
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                alert("Account created successfully!");
                router.push('/login');
            } else {
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            setError("Connection failed. Check server and IP address.");
        }

    };

    const pickImage = async () => {
        // ask for permission to access media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        // open image picker
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // let user crop the image
            aspect: [1, 1],
            quality: 0.7, // compress image
            base64: true, // server expects base64 format
        });

        if (!result.canceled) {
        // Saving the image to State in a format that the server recognizes
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setFormData({ ...formData, image: base64Image });
        }
    };

    const takePhoto = async () => {
        // ask for permission to access camera
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true, 
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setFormData({ ...formData, image: result.assets[0].uri });
        }
        };

    return (
        <ScrollView
         contentContainerStyle={[styles.container, { paddingBottom: 60 }]}
         showsVerticalScrollIndicator={true}>
            <Text style={[styles.title, { marginBottom: -20 }]}>Create Account</Text>
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <AppLogo scale={1.7} />
            </View>
            
            {/* Visually display errors */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={styles.requiredNote}>* All marked fields are required</Text>

            <TextInput 
                style={styles.input} 
                placeholder="Your Name *" 
                onChangeText={(val) => setFormData({...formData, firstName: val})}
            />

            <TextInput 
                style={styles.input} 
                placeholder="Username *" 
                onChangeText={(val) => setFormData({...formData, username: val})}
            />

            <TextInput 
                style={styles.input} 
                placeholder="Email Address *" 
                keyboardType="email-address"
                onChangeText={(val) => setFormData({...formData, emailAddress: val})}
            />

            <TextInput 
                style={styles.input} 
                placeholder="Password *" 
                secureTextEntry={true} // hide input
                onChangeText={(val) => setFormData({...formData, password: val})}
            />

            <TextInput 
                style={styles.input} 
                placeholder="Confirm Password *" 
                secureTextEntry={true}
                onChangeText={(val) => setFormData({...formData, confirmPassword: val})}
            />

            <Text style={styles.sectionTitle}>Select Profile Picture</Text>

            <View style={styles.imageButtonsContainer}>
                <TouchableOpacity style={styles.halfButton} onPress={takePhoto}>
                    <Text style={styles.imageButtonTextInner}>📷    camera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.halfButton} onPress={pickImage}>
                    <Text style={styles.imageButtonTextInner}>🖼️    gallery</Text>
                </TouchableOpacity>
            </View>

            {/* show image preview if an image is selected */}
            {formData.image && (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: formData.image }} style={styles.imagePreview} />
                </View>
            )}
            
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            {/* Adding a little extra space at the bottom to ensure the button is clickable */}
            <View style={{ height: 20 }} />
        </ScrollView>
    );
};


export default RegisterScreen;