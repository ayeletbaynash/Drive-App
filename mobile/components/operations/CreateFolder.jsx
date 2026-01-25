import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, DeviceEventEmitter, Alert} from 'react-native';
import  authorizedFetch  from '../../services/authorizedFetch'
import styles from '../../styles/CreateFileStyles';
import { API_URL } from '../../config';


const CreateFolder = ({ visible, onClose, onSuccess, parentId }) => {
    const [name, setName] = useState('');

    const handleCreate = async () => {

        const bodyData = {
            name: name,
            type: 'folder',
            parent_id: parentId,
        };

        try {
            const response = await authorizedFetch(`${API_URL}/files`, { 
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData)
            });

            if (response.ok) {
                closeAndReset();
                if (onSuccess) onSuccess();
                
                DeviceEventEmitter.emit('somethingChange');
            } else {
                const errorData = await response.json().catch(() => ({}));
                Alert.alert('Error', errorData.message || 'Failed to create file');
            }
        } catch (error) {
            console.error("The exact error is:", error);
            Alert.alert('Error', 'Something went wrong in the code execution');
        }
    };

    const closeAndReset = () => {
        setName('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={closeAndReset}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Create New Folder</Text>
                    
                    <View style={styles.inputGroup}>
                        <TextInput 
                            style={styles.input}
                            value={name} 
                            onChangeText={setName} 
                            placeholder="File name" 
                            autoFocus 
                        />
                    </View>

                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.btnSecondary} onPress={closeAndReset}>
                            <Text style={styles.btnTextSecondary}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnPrimary} onPress={handleCreate}>
                            <Text style={styles.btnTextPrimary}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CreateFolder;