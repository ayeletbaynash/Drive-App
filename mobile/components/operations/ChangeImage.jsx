import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, Alert, DeviceEventEmitter } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';
import { FontAwesome } from '@expo/vector-icons';
import createCreateFileStyles from '../../styles/CreateFileStyles'; 
import { useAppTheme } from '../../context/ThemeContext';

const ChangeImage = forwardRef(({ file, onAction }, ref) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { theme } = useAppTheme();
    const styles = createCreateFileStyles(theme);

    useImperativeHandle(ref, () => ({
        open: () => setIsModalVisible(true)
    }));

    const handlePickImage = async (mode) => {
        let result;
        const options = { allowsEditing: true, base64: true, quality: 0.7 };

        try {
            if (mode === 'camera') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') return Alert.alert('error', 'no camera permission');
                result = await ImagePicker.launchCameraAsync(options);
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') return Alert.alert('error', 'no gallery permission');
                result = await ImagePicker.launchImageLibraryAsync(options);
            }

            if (!result.canceled) {
                setIsModalVisible(false);
                uploadNewImage(result.assets[0].base64, result.assets[0].uri);
            }
        } catch (err) {
            Alert.alert('error', 'failed to open camera/gallery');
        }
    };

    const uploadNewImage = async (base64Data, uri) => {
        setIsUploading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const extension = uri.split('.').pop();
            const base64String = `data:image/${extension};base64,${base64Data}`;

            const response = await fetch(`${API_URL}/files/${file.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: base64String })
            });

            if (response.ok) {
                DeviceEventEmitter.emit('somethingChange');
                if (onAction) onAction(); 
            } else {
                Alert.alert('error', 'upload failed');
            }
        } catch (error) {
            Alert.alert('error', 'server connection failed');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            {/* Modal for image source selection */}
            <Modal visible={isModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.textMain, marginBottom: 20 }]}>
                            choose image source
                        </Text>
                        <View style={{ width: '100%', gap: 12, marginBottom: 20 }}>
                            <TouchableOpacity 
                                style={{ 
                                    flexDirection: 'row', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    paddingVertical: 14,
                                    backgroundColor: theme.rowBackground, 
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: theme.border
                                }} 
                                onPress={() => handlePickImage('camera')}
                            >
                                <FontAwesome name="camera" size={20} color={theme.primary} />
                                <Text style={{ color: theme.textMain, marginLeft: 10, fontWeight: 'bold' }}>
                                    take a photo
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={{ 
                                    flexDirection: 'row', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    paddingVertical: 14,
                                    backgroundColor: theme.rowBackground,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: theme.border
                                }}
                                onPress={() => handlePickImage('library')}
                            >
                                <FontAwesome name="photo" size={20} color={theme.primary} />
                                <Text style={{ color: theme.textMain, marginLeft: 10, fontWeight: 'bold' }}>
                                    choose from gallery
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                            style={{ 
                                backgroundColor: theme.primary, 
                                width: '100%', 
                                padding: 14, 
                                borderRadius: 12,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }} 
                            onPress={() => setIsModalVisible(false)}
                        >
                            <Text style={{ 
                                color: theme.white, 
                                fontSize: 16, 
                                fontWeight: 'bold', 
                                textAlign: 'center' 
                            }}>
                                cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal for uploading */}
            {isUploading && (
                <Modal transparent>
                    <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                        <View style={{ backgroundColor: theme.surface, padding: 30, borderRadius: 15, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={theme.primary} />
                            <Text style={{ marginTop: 15, fontWeight: 'bold', color: theme.textMain }}>Uploading image...</Text>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
});

export default ChangeImage;