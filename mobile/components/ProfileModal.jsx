import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { profileStyles } from '../styles/Profile.styles';

export default function ProfileModal({ visible, onClose, user }) {
  
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
      <Pressable style={profileStyles.overlay} onPress={onClose}>
        
        {/* Stop click propagation so clicking the sheet doesn't close it */}
        <Pressable style={profileStyles.sheetContainer} onPress={() => {}}>
          
          <View style={profileStyles.handle} />

          {/* Header */}
          <View style={profileStyles.header}>
            <View style={[profileStyles.avatarContainer, { backgroundColor: imageSource ? 'transparent' : avatarColor }]}>
              {imageSource ? (
                <Image 
                  source={{ uri: imageSource }} 
                  style={profileStyles.avatarImageLarge} 
                />
              ) : (
                <Text style={profileStyles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
              )}
            </View>
            <Text style={profileStyles.greeting}>Hello, {displayName}!</Text>
            <Text style={profileStyles.email}>{displayEmail}</Text>
          </View>

          <View style={profileStyles.divider} />

          {/* Actions */}
          <View style={profileStyles.actions}>
            <TouchableOpacity style={profileStyles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color='#277d3f' />
              <Text style={profileStyles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={profileStyles.doneButton} onPress={onClose}>
              <Text style={profileStyles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );
}