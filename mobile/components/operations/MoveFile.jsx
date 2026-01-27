import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator, Alert, DeviceEventEmitter } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { moveFileStyles as styles } from '../../styles/moveFileStyles'
import { Colors } from '../../constants/theme';
import authorizedFetch from '../../services/authorizedFetch';
import { API_URL } from '../../config';
import { useFileActions } from '../../context/FileContext';

const MoveFile = ({ file, visible, onClose }) => {
    const [allFolders, setAllFolders] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFolderId, setSelectedFolderId] = useState(undefined);
    const { deletedFiles } = useFileActions()

    const fetchFoldersRecursive = async (folderId) => {
        const url = (folderId === null) ? `${API_URL}/files` : `${API_URL}/files/${folderId}`
        try {
            const response = await authorizedFetch(url);
            if (!response || !response.ok) return [];
            const data = await response.json();
            const items = Array.isArray(data) ? data : (data.children || []);
            const validFolders = items.filter(item => 
                item.type === 'folder' && 
                !deletedFiles.some(d => d.id === item.id) &&
                item.id !== file.id
            );
            let foundFolders = [...validFolders];
            for (const folder of validFolders) {
                const subFolders = await fetchFoldersRecursive(folder.id);
                foundFolders = [...foundFolders, ...subFolders];
            }
            return foundFolders;
        } catch (error) {
            return [];
        }
    };

    useEffect(() => { if (visible) loadFolders(); }, [visible]);

    const loadFolders = async () => {
        setIsLoading(true);
        setSelectedFolderId(undefined);
        const folders = await fetchFoldersRecursive(null)
        const allOptions = [{ id: null, name: "Main Drive (Root)" },...folders]
        const filteredOptions = allOptions.filter(folder => folder.id !== file.parent_id)
        setAllFolders(filteredOptions);
        setIsLoading(false);
    };

    const executeMove = async () => {
        try {
            const response = await authorizedFetch(`${API_URL}/files/${file.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ parent_id: selectedFolderId })
            });
            if (response && response.ok) {
                DeviceEventEmitter.emit('somethingChange');
                onClose();
            }
        } catch (error) {
            Alert.alert("Error", "Move failed");
        }
    };

    const renderFolderItem = ({ item }) => {
        const isSelected = selectedFolderId === item.id;
        return (
            <TouchableOpacity 
                style={[styles.folderItem, isSelected && styles.selectedFolderItem]}
                onPress={() => setSelectedFolderId(item.id)}
            >
                <Ionicons 
                    name={item.id === null ? 'home' : 'folder'} 
                    size={22} 
                    color={isSelected ? Colors.light.primary : '#888'} 
                    style={styles.folderIcon}
                />
                <Text style={[styles.folderName, isSelected && styles.selectedFolderName]}>
                    {item.name}
                </Text>
                {isSelected && <Ionicons name="checkmark" size={20} color={Colors.light.primary} />}
            </TouchableOpacity>
        );
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Move to...</Text>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.light.primary} />
                            <Text style={styles.loadingText}>Scanning folders...</Text>
                        </View>
                    ) : (
                        <>
                            <FlatList
                                data={allFolders}
                                keyExtractor={(item) => (item.id === null ? 'root' : item.id.toString())}
                                renderItem={renderFolderItem}
                                style={styles.folderList}
                                showsVerticalScrollIndicator={false}
                            />
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.button, styles.confirmButton, selectedFolderId === undefined && styles.disabledButton]}
                                    onPress={executeMove}
                                    disabled={selectedFolderId === undefined}
                                >
                                    <Text style={styles.confirmButtonText}>Move Here</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default MoveFile;