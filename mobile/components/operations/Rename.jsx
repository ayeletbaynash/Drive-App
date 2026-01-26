import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, DeviceEventEmitter, Alert } from 'react-native';
import authorizedFetch from '../../services/authorizedFetch';
import styles from '../../styles/CreateFileStyles'
import { API_URL } from '../../config';
import { useFileActions } from '../../context/FileContext';

const Rename = ({ file, visible, onClose }) => {
    const [nameWithoutExt, setNameWithoutExt] = useState("");
    const [extension, setExtension] = useState("");
    const { updateFileInStarred } = useFileActions();

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
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Rename File</Text>
                    
                    <View style={styles.inputGroup}>
                        <TextInput 
                            style={styles.input}
                            value={nameWithoutExt} 
                            onChangeText={setNameWithoutExt} 
                            placeholder="File name" 
                            autoFocus 
                        />
                        <Text style={styles.extension}>{extension}</Text>
                    </View>

                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.btnSecondary} onPress={onClose}>
                            <Text style={styles.btnTextSecondary}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnPrimary} onPress={handleRename}>
                            <Text style={styles.btnTextPrimary}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default Rename;