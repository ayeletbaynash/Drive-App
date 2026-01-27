import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';
import createCreateFileStyles from '../../styles/CreateFileStyles'; 
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAppTheme } from '../../context/ThemeContext';

const CopyFile = ({ file, onAction, onSuccess }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const [newName, setNewName] = useState('');
    const { theme } = useAppTheme();
    const styles = createCreateFileStyles(theme);

    // make the copy modal visible and suggest a name
    const openCopyModal = () => {
        const nameParts = file.name.split('.');
        let suggestedName;
        
        if (nameParts.length > 1) {
            nameParts.pop(); //remove extension
            suggestedName = `${nameParts.join('.')}_copy`;
        } else {
            suggestedName = `${file.name}_copy`;
        }
        
        setNewName(suggestedName);
        setIsModalVisible(true);
    };

    const handleCopy = async () => {
        if (!newName.trim()) {
            Alert.alert("error", "Please enter a valid name");
            return;
        }

        setIsCopying(true);
        try {
            const token = await AsyncStorage.getItem('token');
            
            // Fetch the original file data
            const getRes = await fetch(`${API_URL}/files/${file.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const fullFileData = await getRes.json();

            if (!getRes.ok) throw new Error("Fetch original failed");

            // create the new file name with extension if applicable
            const extension = file.name.includes('.') ? `.${file.name.split('.').pop()}` : '';
            const finalFileName = `${newName}${extension}`;

            // create the copy
            const response = await fetch(`${API_URL}/files`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: finalFileName,
                    type: file.type || 'file',
                    parent_id: file.parent_id,
                    content: fullFileData.content 
                })
            });

            if (response.ok) {
                setIsModalVisible(false);
                DeviceEventEmitter.emit('somethingChange');
                if (onSuccess) onSuccess(); 
                if (onAction) onAction();   
            } else {
                Alert.alert('error', 'Failed to copy file');
            }
        } catch (error) {
            console.error("Copy process error:", error);
            Alert.alert('error', 'Failed to copy file');
        } finally {
            setIsCopying(false);
        }
    };

    return (
        <View>
            {/* The button that appears inside fileitem */}
            <TouchableOpacity 
                onPress={openCopyModal} 
                style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    paddingVertical: theme.spacing?.md || 16,
                    paddingHorizontal: theme.spacing?.md || 16
                }}
            >
                {/* icon */}
                <FontAwesome name="copy" size={20} color={theme.textMain} />

                <Text style={{ 
                    color: theme.textMain, 
                    fontSize: theme.fontSize?.md || 16,
                    marginLeft: 10 
                }}>
                    Make a Copy
                </Text>
            </TouchableOpacity>

            {/* Modal for entering the copy name */}
            <Modal visible={isModalVisible} transparent animationType="fade">
                <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.textMain }]}>Copy File</Text>

                        <View style={styles.inputGroup}>
                            <TextInput
                                style={[styles.input, { color: theme.textMain, borderColor: theme.border }]}
                                value={newName}
                                onChangeText={setNewName}
                                placeholder="New name"
                                placeholderTextColor={theme.placeholder}
                                autoFocus
                            />
                            {file.name.includes('.') && (
                                <Text style={[styles.extension, { color: theme.textMuted }]}>.{file.name.split('.').pop()}</Text>
                            )}
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={[styles.btnSecondary, { backgroundColor: theme.rowHover }]} 
                                onPress={() => setIsModalVisible(false)}
                                disabled={isCopying}
                            >
                                <Text style={[styles.btnTextSecondary, { color: theme.textMain }]}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.btnPrimary, { backgroundColor: theme.primary }]} 
                                onPress={handleCopy}
                                disabled={isCopying || !newName.trim()}
                            >
                                {isCopying ? (
                                    <ActivityIndicator color={theme.white} />
                                ) : (
                                    <Text style={[styles.btnTextPrimary, { color: theme.white }]}>Copy</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default CopyFile;