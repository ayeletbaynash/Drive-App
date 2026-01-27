import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, DeviceEventEmitter, Alert} from 'react-native';
import  authorizedFetch  from '../../services/authorizedFetch'
import createCreateFileStyles from '../../styles/CreateFileStyles';
import { API_URL } from '../../config';
import { useAppTheme } from '../../context/ThemeContext';


const CreateFile = ({ visible, onClose, onSuccess, parentId }) => {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const { theme } = useAppTheme();
    const styles = createCreateFileStyles(theme);

    const handleCreate = async () => {

        const bodyData = {
            name: `${name}.txt`,
            type: 'file',
            parent_id: parentId,
            content: content || "" 
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
        setContent('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={closeAndReset}
        >
            <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.modalTitle, { color: theme.textMain }]}>Create New File</Text>
                    
                    <View style={styles.inputGroup}>
                        <TextInput 
                            style={[styles.input, { color: theme.textMain, borderColor: theme.border, backgroundColor: theme.rowBackground }]}
                            value={name} 
                            onChangeText={setName} 
                            placeholder="File name" 
                            placeholderTextColor={theme.placeholder}
                            autoFocus 
                        />
                        <Text style={[styles.extension, { color: theme.textMuted }]}>.txt</Text>
                    </View>

                    <TextInput 
                        style={[styles.input, styles.textArea, { color: theme.textMain, borderColor: theme.border, backgroundColor: theme.rowBackground }]}
                        value={content} 
                        onChangeText={setContent} 
                        placeholder="File content (optional)..."
                        placeholderTextColor={theme.placeholder}
                        multiline={true}
                        numberOfLines={5}
                        textAlignVertical="top"
                    />

                    <View style={styles.modalActions}>
                        <TouchableOpacity style={[styles.btnSecondary, { backgroundColor: theme.rowHover }]} onPress={closeAndReset}>
                            <Text style={[styles.btnTextSecondary, { color: theme.textMain }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: theme.primary }]} onPress={handleCreate}>
                            <Text style={[styles.btnTextPrimary, { color: theme.white }]}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CreateFile;