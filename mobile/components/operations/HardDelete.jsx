import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authorizedFetch from '../../services/authorizedFetch';
import { useFileActions } from '../../context/FileContext';
import { createHardDeleteStyles } from '../../styles/hardDeleteStyles';
import { API_URL } from '../../config';
import { useAppTheme } from '../../context/ThemeContext';

const HardDelete = ({ file, onComplete }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useAppTheme();
    const styles = createHardDeleteStyles(theme);
    
    // Using these functions to remove the file from local context lists (e.g., trash bin)
    const { 
        restoreFromFileDeletionList, 
        starredFiles, 
        toggleStarFile 
    } = useFileActions();

    const handleDeleteForever = async () => {
        setIsLoading(true);
        try {
            const response = await authorizedFetch(`${API_URL}/files/${file.id}`, {
                method: 'DELETE',
            });

            if (response && response.ok) {
                // 1. Update local context: Remove from "deleted files" list
                await restoreFromFileDeletionList(file.id);

                // If the file was starred, remove it from the starred list as well
                const isStarred = starredFiles.some(f => f.id === file.id);
                if (isStarred) {
                    await toggleStarFile(file); 
                }
                
                // 2. Notify other parts of the app to refresh data
                DeviceEventEmitter.emit('somethingChange');
                
                // 3. Close modal and trigger completion callback
                setModalVisible(false);
                if (onComplete) onComplete();
            } else {
                alert("Failed to delete file from server");
            }
        } catch (error) {
            console.error("Hard delete error:", error);
            alert("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Button inside ActionSheet */}
            <TouchableOpacity 
                style={styles.menuButton} 
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="trash-bin" size={22} color={theme.error} />
                <Text style={[styles.menuText, { color: theme.error }]}>Delete Forever</Text>
            </TouchableOpacity>

            {/* Confirmation Modal */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        
                        {/* Header */}
                        <View style={styles.headerContainer}>
                            <Ionicons name="warning" size={40} color={theme.error} />
                            <Text style={[styles.title, { color: theme.textMain }]}>Delete Forever?</Text>
                        </View>

                        {/* Body Text */}
                        <Text style={[styles.bodyText, { color: theme.textMain }]}>
                            Are you sure you want to permanently delete <Text style={styles.bold}>"{file.name}"</Text>?
                        </Text>
                        <Text style={[styles.warningText, { color: theme.error }]}>
                            This action cannot be undone.
                        </Text>

                        {/* Buttons */}
                        <View style={styles.actions}>
                            <TouchableOpacity 
                                style={styles.btnCancel} 
                                onPress={() => setModalVisible(false)}
                                disabled={isLoading}
                            >
                                <Text style={styles.btnTextCancel}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.btnDelete} 
                                onPress={handleDeleteForever}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.btnTextDelete}>Delete</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </>
    );
};

export default HardDelete;