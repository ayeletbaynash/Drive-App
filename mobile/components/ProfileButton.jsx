import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authorizedFetch from '../services/authorizedFetch'; 
import ProfileModal from './ProfileModal';
import { profileStyles } from '../styles/Profile.styles';

export default function ProfileButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // 1. LOAD FROM CACHE FIRST (Instant display)
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedFirstName = await AsyncStorage.getItem('firstName');
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const storedImage = await AsyncStorage.getItem('userImage');
        const storedUsername = await AsyncStorage.getItem('username');

        // Set initial state from what we have locally
        setUser({
            id: storedUserId,
            firstName: storedFirstName,
            userEmail: storedEmail,
            userImage: storedImage,
            username: storedUsername
        });

        // 2. FETCH FRESH DATA (Background update)
        if (storedUserId) {
          const response = await authorizedFetch(`/users/${storedUserId}`);
          
          if (response && response.ok) {
            const serverData = await response.json();
            console.log("🔎 Server Response for User:", serverData);
            const realEmail = serverData.email || serverData.emailAddress;
            // Merge server data with local state
            setUser(prev => ({ 
                ...prev, 
                ...serverData,
                // אנו דורסים את המייל באופן מפורש כדי שהמודל יראה אותו
                userEmail: realEmail || prev.userEmail 
            }));
            
            // Optional: Update cache if image changed
            if (serverData.image) await AsyncStorage.setItem('userImage', serverData.image);
            if (realEmail) await AsyncStorage.setItem('userEmail', realEmail);
          }
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };

    loadUserData();
  }, []);

  // Determine which image to show
  const imageUri = user?.userImage || user?.image;

  return (
    <>
      <TouchableOpacity style={profileStyles.buttonContainer} onPress={() => setModalVisible(true)}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={profileStyles.buttonImage} />
        ) : (
          <Ionicons name="person-circle" size={34} color="#5f6368" />
        )}
      </TouchableOpacity>

      <ProfileModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        user={user}
      />
    </>
  );
}