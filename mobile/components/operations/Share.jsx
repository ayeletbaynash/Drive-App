import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Alert, DeviceEventEmitter } from 'react-native';
import { shareStyles as styles } from '../../styles/shareStyles'; // Path to your style file
import authorizedFetch from '../../services/authorizedFetch';
import { API_URL } from '../../config';

const Share = ({ file, visible, onClose }) => {
    const [permissions, setPermissions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newRole, setNewRole] = useState("read");

    // Fetch existing permissions from the server
    const fetchPermissions = async () => {
        setIsLoading(true);
        try {
            const response = await authorizedFetch(`${API_URL}/files/${file.id}/permissions`);
            if (response.ok) {
                const data = await response.json();
                setPermissions(data);
            }
        } catch (error) {
            console.error("Fetch permissions error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Refetch data every time the modal becomes visible
    useEffect(() => {
        if (visible) fetchPermissions();
    }, [visible]);

    // Add a new user permission
    const handleAddPermission = async () => {
        if (!newUsername) return;
        try {
            const response = await authorizedFetch(`${API_URL}/files/${file.id}/permissions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: newUsername, permission: newRole })
            });

            if (response.ok) {
                setNewUsername("");
                fetchPermissions();
                DeviceEventEmitter.emit('somethingChange');
            } else {
                const err = await response.json();
                Alert.alert("Error", err.error || "Failed to invite user");
            }
        } catch (error) {
            console.error("Add permission error:", error);
        }
    };

    // Remove a user's permission
    const handleDelete = async (pId) => {
        try {
            const response = await authorizedFetch(`${API_URL}/files/${file.id}/permissions/${pId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchPermissions();
                DeviceEventEmitter.emit('somethingChange');
            }
        } catch (error) {
            console.error("Delete permission error:", error);
        }
    };

    // Update an existing user's role (Viewer/Editor/Owner)
    const handleUpdateRole = async (pId, role) => {
        try {
            const response = await authorizedFetch(`${API_URL}/files/${file.id}/permissions/${pId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ permission: role })
            });
            if (response.ok) {
                fetchPermissions();
                DeviceEventEmitter.emit('somethingChange');
            }
        } catch (error) {
            console.error("Update role error:", error);
        }
    };

    // Helper to open a native selection menu for roles
    const openRolePicker = (callback) => {
        Alert.alert("Select Role", "Choose permission level:", [
            { text: "Viewer", onPress: () => callback("read") },
            { text: "Editor", onPress: () => callback("write") },
            { text: "Owner", onPress: () => callback("owner") },
            { text: "Cancel", style: "cancel" }
        ]);
    };

    // Render individual user item in the list
    const renderPermissionItem = ({ item }) => (
        <View style={styles.permissionItem}>
            <Text style={styles.usernameText}>{item.username} ({item.permission})</Text>
            
            <View style={styles.itemActions}>
                <TouchableOpacity onPress={() => openRolePicker((role) => handleUpdateRole(item.pId, role))}>
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(item.pId)}>
                    <Text style={styles.deleteText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    
                    <Text style={styles.modalTitle}>Share: {file.name}</Text>

                    {/* Add New User Section */}
                    <View style={styles.addSection}>
                        <TextInput 
                            placeholder="Enter username"
                            value={newUsername}
                            onChangeText={setNewUsername}
                            style={styles.input}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => openRolePicker(setNewRole)} style={styles.rolePickerButton}>
                            <Text>Role: {newRole}</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={handleAddPermission} style={styles.inviteButton}>
                            <Text style={styles.inviteButtonText}>Invite</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Permissions List Section */}
                    <Text style={styles.listHeader}>People with access:</Text>
                    {isLoading ? (
                        <ActivityIndicator size="small" />
                    ) : (
                        <FlatList 
                            data={permissions}
                            keyExtractor={(item) => item.pId.toString()}
                            renderItem={renderPermissionItem}
                            style={styles.list}
                        />
                    )}

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Done</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};

export default Share;