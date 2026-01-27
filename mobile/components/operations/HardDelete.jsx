import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authorizedFetch from '../../services/authorizedFetch';
import { useFileActions } from '../../context/FileContext';
import { hardDeleteStyles as styles } from '../../styles/hardDeleteStyles';
import { API_URL } from '../../config';

const HardDelete = ({ file, onComplete }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // אנו משתמשים בפונקציה הזו כדי להסיר את הקובץ מרשימת ה-deletedFiles הלוקאלית
    // ברגע שהוא נמחק מהשרת, אנחנו לא צריכים לראות אותו יותר באשפה
    const { 
        restoreFromFileDeletionList, 
        starredFiles, 
        toggleStarFile 
    } = useFileActions();

    const handleDeleteForever = async () => {
        setIsLoading(true);
        try {
            // קריאה לשרת למחיקה פיזית
            const response = await authorizedFetch(`${API_URL}/files/${file.id}`, {
                method: 'DELETE',
            });

            if (response && response.ok) {
                // 1. מעדכנים את הקונטקסט הלוקאלי (מסירים מהרשימה)
                await restoreFromFileDeletionList(file.id);

                const isStarred = starredFiles.some(f => f.id === file.id);
                if (isStarred) {
                    await toggleStarFile(file); 
                }
                
                // 2. מודיעים לשאר האפליקציה (אם צריך רענון)
                DeviceEventEmitter.emit('somethingChange');
                
                // 3. סוגרים את הכל
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
            {/* הכפתור שמופיע בתוך ה-ActionSheet */}
            <TouchableOpacity 
                style={styles.menuButton} 
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="trash-bin" size={22} color="#dc3545" />
                <Text style={styles.menuText}>Delete Forever</Text>
            </TouchableOpacity>

            {/* חלון האישור (Modal) */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        
                        {/* כותרת */}
                        <View style={styles.headerContainer}>
                            <Ionicons name="warning" size={40} color="#dc3545" />
                            <Text style={styles.title}>Delete Forever?</Text>
                        </View>

                        {/* תוכן */}
                        <Text style={styles.bodyText}>
                            Are you sure you want to permanently delete <Text style={styles.bold}>"{file.name}"</Text>?
                        </Text>
                        <Text style={styles.warningText}>
                            This action cannot be undone.
                        </Text>

                        {/* כפתורים */}
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