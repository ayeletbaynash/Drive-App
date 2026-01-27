import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, DeviceEventEmitter, Alert } from 'react-native';
import authorizedFetch from '../../services/authorizedFetch';
import createCreateFileStyles from '../../styles/CreateFileStyles'
import { API_URL } from '../../config';
import { useFileActions } from '../../context/FileContext';
import { useAppTheme } from '../../context/ThemeContext';

const Rename = ({ file, visible, onClose }) => {
    const [nameWithoutExt, setNameWithoutExt] = useState("");
    const [extension, setExtension] = useState("");
    const { updateFileInStarred } = useFileActions();
    const { theme } = useAppTheme();
    const styles = createCreateFileStyles(theme);

    // Split name and extension when modal opens
    useEffect(() => {
        if (file && visible) {
            const lastDotIndex = file.name.lastIndexOf('.');
            if (lastDotIndex !== -1) {
                setNameWithoutExt(file.name.substring(0, lastDotIndex));
                setExtension(file.name.substring(lastDotIndex));
            } else {
                setNameWithoutExt(file.name);
                setExtension("");
            }
        }
    }, [file, visible]);

    const handleRename = async () => {
        const finalName = `${nameWithoutExt}${extension}`;
        
        if (!nameWithoutExt.trim()) {
            Alert.alert("Error", "File name cannot be empty");
            return;
        }

        try {
            const response = await authorizedFetch(`${API_URL}/files/${file.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: finalName })
            });

            if (response.ok) {
                // Update Context if the file is starred
                updateFileInStarred(file.id, { name: finalName });
                
                // Emit event to refresh the list in Home screen
                DeviceEventEmitter.emit('somethingChange');
                
                onClose();
            } else {
                Alert.alert("Error", "Failed to update name");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong");
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.modalTitle, { color: theme.textMain }]}>Rename File</Text>
                    
                    <View style={styles.inputGroup}>
                        <TextInput 
                            style={[styles.input, { color: theme.textMain, borderColor: theme.border, backgroundColor: theme.rowBackground }]}
                            value={nameWithoutExt} 
                            onChangeText={setNameWithoutExt} 
                            placeholder="File name" 
                            placeholderTextColor={theme.placeholder}
                            autoFocus 
                        />
                        <Text style={[styles.extension, { color: theme.textMuted }]}>{extension}</Text>
                    </View>

                    <View style={styles.modalActions}>
                        <TouchableOpacity style={[styles.btnSecondary, { backgroundColor: theme.rowHover }]} onPress={onClose}>
                            <Text style={[styles.btnTextSecondary, { color: theme.textMain }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: theme.primary }]} onPress={handleRename}>
                            <Text style={[styles.btnTextPrimary, { color: theme.white }]}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default Rename;