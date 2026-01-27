import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, Pressable, Animated, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLogo from './AppLogo';
import { createSideMenuStyles } from '../styles/SideMenuStyles';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75;

export default function SideMenu({ visible, onClose }) {
  const { theme } = useAppTheme();
  const router = useRouter();
  const pathname = usePathname();
  
  const styles = createSideMenuStyles(theme);

  // Animation Values
  // 1. Menu Position (Starts off-screen to the left)
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  // 2. Backdrop Opacity (Starts transparent)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Effect: Run Entry Animation when 'visible' changes
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300, 
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Exit Animation & Close Handler
  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -MENU_WIDTH, 
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0, 
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose(); 
    });
  };

  // Navigation Handler
  const navigateTo = (path) => {
    handleClose(); 
    setTimeout(() => router.push(path), 200);
  };

  // Helper Component for Menu Items
  const MenuItem = ({ label, icon, path }) => {
    const isActive = pathname === path; 
    
    return (
      <TouchableOpacity 
        style={[
          styles.navItem, 
          isActive && { backgroundColor: theme.rowHover } 
        ]} 
        onPress={() => navigateTo(path)}
      >
        <Ionicons 
          name={isActive ? icon : `${icon}-outline`} 
          size={24} 
          color={theme.primary} 
        />
        <Text style={[styles.navText, isActive && { fontWeight: 'bold' }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        {/* 1. Dark Backdrop (Click to close) */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
           <Pressable style={{ flex: 1 }} onPress={handleClose} />
        </Animated.View>

        {/* 2. Sliding Menu Container */}
        <Animated.View 
          style={[
            styles.menuContainer, 
            { transform: [{ translateX: slideAnim }] } 
          ]}
        >
          <SafeAreaView style={{ flex: 1 }}>
            
            {/* Header / Logo */}
            <View style={styles.logoContainer}>
              <View pointerEvents="none"> 
                 <AppLogo scale={1.2} />
              </View>
            </View>

            {/* Navigation Items */}
            <View style={styles.navItems}>
              
              <MenuItem label="Recent" icon="time" path="/recent" />
              <MenuItem label="Trash" icon="trash" path="/trash" />
                          
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>AwesoMe Drive v1.0</Text>
            </View>

          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}