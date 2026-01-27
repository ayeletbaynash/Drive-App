import React, { useMemo } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createProfileStyles } from '../styles/Profile.styles';
import { useAppTheme } from '../context/ThemeContext';

export default function ProfileModal({ visible, onClose, user }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createProfileStyles(theme), [theme]);
  
  const handleLogout = async () => {
    try {
      // Clear all keys saved in LoginScreen
      await AsyncStorage.multiRemove([
        'token', 
        'user', 
        'userId', 
        'firstName', 
        'username', 
        'userImage',
        'userEmail'
      ]);
      
      onClose();
      router.replace('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Fallback color generator (same logic as your web app)
  const getAvatarColor = (name) => {
    const colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#e67e22', '#e74c3c'];
    let hash = 0;
    if (!name) return colors[0];
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Data mapping based on your LoginScreen keys
  const displayName = user?.firstName || user?.username || "User";
  const displayEmail = user?.userEmail || user?.emailAddress || user?.email || "";
  
  // We check for image in multiple places just to be safe
  const imageSource = user?.userImage || user?.image;
  const avatarColor = getAvatarColor(displayName);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={onClose}>
        
        {/* Stop click propagation so clicking the sheet doesn't close it */}
        <Pressable style={[styles.sheetContainer, { backgroundColor: theme.surface }]} onPress={() => {}}>
          
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.avatarContainer, { backgroundColor: imageSource ? 'transparent' : avatarColor }]}>
              {imageSource ? (
                <Image 
                  source={{ uri: imageSource }} 
                  style={styles.avatarImageLarge} 
                />
              ) : (
                <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
              )}
            </View>
            <Text style={[styles.greeting, { color: theme.textMain }]}>Hello, {displayName}!</Text>
            <Text style={[styles.email, { color: theme.textMuted }]}>{displayEmail}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.rowHover }]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={theme.error} />
              <Text style={[styles.logoutText, { color: theme.error }]}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.doneButton, { backgroundColor: theme.primary }]} onPress={onClose}>
              <Text style={[styles.doneText, { color: theme.white }]}>Done</Text>
            </TouchableOpacity>
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );
}