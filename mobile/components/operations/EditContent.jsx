import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, DeviceEventEmitter, Alert, ActivityIndicator } from 'react-native';
import authorizedFetch from '../../services/authorizedFetch';
import createCreateFileStyles from '../../styles/CreateFileStyles';
import { API_URL } from '../../config';
import { useAppTheme } from '../../context/ThemeContext';

const EditContent = ({ file, visible, onClose }) => {
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useAppTheme();
    const styles = createCreateFileStyles(theme);

    const fetchFileContent = async () => {
        setIsLoading(true);
        try {
            const response = await authorizedFetch(`${API_URL}/files/${file.id}`, { 
                method: 'GET' 
            });
            const data = await response.json();
            setContent(data.content || ''); 
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not load content");
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (visible && file) {
            fetchFileContent();
        }
    }, [visible]);

    const handleEditContent = async () => {
        try {
            const response = await authorizedFetch(`${API_URL}/files/${file.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: content })
            });

            if (response.ok) {
                DeviceEventEmitter.emit('somethingChange');
                onClose();
            } else {
                Alert.alert("Error", "Failed to save changes");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to save");
        }
    };

    return (
        <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
            <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                <View style={[styles.modalContent, { width: '90%', maxHeight: '80%', backgroundColor: theme.surface }]}>
                    <Text style={[styles.modalTitle, { color: theme.textMain }]}>Edit "{file?.name}"</Text>

                    {isLoading ? (
                        <View style={{ padding: 50, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={theme.primary} />
                        </View>
                    ) : (
                        <View style={{ width: '100%' }}>
                            <TextInput 
                                style={[
                                    styles.input, 
                                    styles.textArea, 
                                    { 
                                        height: 250, 
                                        textAlignVertical: 'top',
                                        marginBottom: 20,
                                        color: theme.textMain,
                                        borderColor: theme.border,
                                        backgroundColor: theme.rowBackground
                                    }
                                ]}
                                value={content} 
                                onChangeText={setContent} 
                                multiline={true}
                                scrollEnabled={true}
                                autoFocus
                                placeholderTextColor={theme.placeholder}
                            />

                            <View style={[styles.modalActions, { marginTop: 0 }]}>
                                <TouchableOpacity style={[styles.btnSecondary, { backgroundColor: theme.rowHover }]} onPress={onClose}>
                                    <Text style={[styles.btnTextSecondary, { color: theme.textMain }]}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: theme.primary }]} onPress={handleEditContent}>
                                    <Text style={[styles.btnTextPrimary, { color: theme.white }]}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default EditContent;








