import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authorizedFetch from '../services/authorizedFetch';
import { API_URL } from '../config';

// 👇 ייבוא העיצוב מהקובץ הנפרד
import { styles } from '../styles/FileDetailsModal.styles';

const FileDetailsModal = ({ file, visible, onClose }) => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- Helper Functions ---
    const formatSize = (bytes) => {
        if (bytes === 0 || !bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('he-IL') + ' ' + 
               new Date(dateString).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    };

    // --- API Logic ---
    useEffect(() => {
        if (visible && file?.id) {
            fetchPermissions();
        }
    }, [visible, file]);

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            // התאמה לכתובת השרת
            const response = await authorizedFetch(`${API_URL}/files/${file.id}/permissions`);
            if (response.ok) {
                const data = await response.json();
                setPermissions(data);
            } else {
                setPermissions([]);
            }
        } catch (error) {
            console.error("Error fetching permissions:", error);
        } finally {
            setLoading(false);
        }
    };

    const owner = permissions.find(p => p.permission === 'owner');
    const collaborators = permissions.filter(p => p.permission !== 'owner');
    const isFolder = file?.type === 'folder';

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                {/* לחיצה בתוך המודאל לא תסגור אותו */}
                <View style={styles.sheetContainer} onStartShouldSetResponder={() => true}> 
                    
                    {/* פס גרירה קטן */}
                    <View style={styles.handleWrapper}>
                        <View style={styles.handle} />
                    </View>

                    {/* כותרת ואייקון */}
                    <View style={styles.header}>
                        <Ionicons 
                            name={isFolder ? "folder" : "document-text"} 
                            size={48} 
                            color={isFolder ? "#FFCA28" : "#146841"} 
                        />
                        <Text style={styles.title} numberOfLines={2}>{file?.name}</Text>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        
                        {/* --- חלק 1: פרטים טכניים --- */}
                        <Text style={styles.sectionTitle}>System Properties</Text>
                        <View style={styles.infoBox}>
                            <InfoRow label="Type" value={isFolder ? "Folder" : file?.name.split('.').pop().toUpperCase() + " File"} />
                            {!isFolder && <InfoRow label="Size" value={formatSize(file?.size)} />}
                            <InfoRow label="Created" value={formatDate(file?.created_at || file?.createdAt)} />
                            <InfoRow label="Modified" value={formatDate(file?.updated_at || file?.updatedAt)} />
                        </View>

                        {/* --- חלק 2: הרשאות --- */}
                        <Text style={styles.sectionTitle}>Who has access</Text>
                        <View style={styles.infoBox}>
                            {/* בעלים */}
                            {owner && (
                                <UserRow 
                                    username={owner.username} 
                                    role="Owner" 
                                    isOwner={true} 
                                />
                            )}

                            {loading ? (
                                <ActivityIndicator size="small" color="#000" style={{ marginTop: 10 }} />
                            ) : (
                                collaborators.map((p, index) => (
                                    <UserRow 
                                        key={index} 
                                        username={p.username} 
                                        role={p.permission} 
                                    />
                                ))
                            )}
                            
                            {!loading && !owner && collaborators.length === 0 && (
                                <Text style={styles.emptyText}>No permissions info available</Text>
                            )}
                        </View>

                    </ScrollView>
                </View>
            </Pressable>
        </Modal>
    );
};

// --- רכיבי עזר קטנים ---
// (השארתי אותם כאן כי הם פשוטים, אבל הם משתמשים ב-styles המיובא)

const InfoRow = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value} numberOfLines={1}>{value}</Text>
    </View>
);

const UserRow = ({ username, role, isOwner }) => (
    <View style={styles.userRow}>
        <View style={[styles.avatar, isOwner ? styles.avatarOwner : styles.avatarCollab]}>
            <Text style={styles.avatarText}>
                {username ? username.charAt(0).toUpperCase() : '?'}
            </Text>
        </View>
        <View>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.role}>{role}</Text>
        </View>
    </View>
);

export default FileDetailsModal;