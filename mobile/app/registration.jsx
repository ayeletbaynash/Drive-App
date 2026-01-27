import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { API_URL } from '../config';
import * as ImagePicker from 'expo-image-picker'; // for image upload
import AppLogo from '../components/AppLogo';
import { createAuthenticationStyles } from '../styles/authentication';
import { useAppTheme } from '../context/ThemeContext';
import { router } from 'expo-router';

const RegisterScreen = () => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createAuthenticationStyles(theme), [theme]);
    const [formData, setFormData] = useState({
        firstName: '', username: '', password: '', confirmPassword: '', emailAddress: '', image: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        console.log("Button clicked! Form data:", formData); /// Debugging line
        setError('');

        // Validation - just like in WEB 
        if (formData.username.includes(' ')) {
            showError("Username cannot contain spaces");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showError("Passwords do not match!");
            return;
        }

        if (formData.password.length < 8) {
            showError("Password must be at least 8 characters long");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        if (!passwordRegex.test(formData.password)) {
            showError("Password must include at least one uppercase letter, one lowercase letter, and one number.");
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
            console.log("Server Response:", data);
            if (response.ok) {
                alert("Account created successfully!");
                router.push('/login');
            } else {
                showError(data.error || "Registration failed");
            }
        } catch (err) {
            showError("Connection failed. Check server and IP address.");
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
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setFormData({ ...formData, image: base64Image });
            }
        };


    // create refs for inputs to jump between them
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmRef = useRef();
    // refs for scrolling and input focus
    const scrollRef = useRef();

    const showError = (message) => {
        setError(message);
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
        <ScrollView
         ref={scrollRef}
         contentContainerStyle={{ padding: 20, paddingTop: 50, paddingBottom: 80 }}
         keyboardShouldPersistTaps="handled"
         showsVerticalScrollIndicator={true}
         >
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
                returnKeyType="next"
                onSubmitEditing={() => usernameRef.current.focus()}
                onFocus={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
                onChangeText={(val) => setFormData({...formData, firstName: val})}
            />

            <TextInput 
                ref={usernameRef}
                style={styles.input} 
                placeholder="Username *" 
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current.focus()}
                onFocus={() => scrollRef.current?.scrollTo({ y: 80, animated: true })}
                onChangeText={(val) => setFormData({...formData, username: val})}
            />

            <TextInput 
                ref={emailRef}
                style={styles.input} 
                placeholder="Email Address *" 
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current.focus()}
                onFocus={() => scrollRef.current?.scrollTo({ y: 160, animated: true })}
                onChangeText={(val) => setFormData({...formData, emailAddress: val})}
            />

            <TextInput 
                ref={passwordRef}
                style={styles.input} 
                placeholder="Password *" 
                secureTextEntry={true} // hide input
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current.focus()}
                onFocus={() => scrollRef.current?.scrollTo({ y: 240, animated: true })}
                onChangeText={(val) => setFormData({...formData, password: val})}
            />

            <TextInput 
                ref={confirmRef}
                style={styles.input} 
                placeholder="Confirm Password *" 
                secureTextEntry={true}
                returnKeyType="done"
                onFocus={() => scrollRef.current?.scrollTo({ y: 320, animated: true })}
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
            <View style={{ height: 100 }} />
        </ScrollView>
        </KeyboardAvoidingView>);
};


export default RegisterScreen;