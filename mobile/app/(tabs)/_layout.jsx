import React, { useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { layoutStyles } from '../../styles/layoutStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileButton from '../../components/ProfileButton';
import ThemeToggle from '../../components/ThemeToggle'; // הכפתור החדש
import { useAppTheme } from '../../context/ThemeContext'; // ה-Hook שלנו
import SideMenu from '../../components/SideMenu';

export default function TabsLayout() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const [isMenuVisible, setMenuVisible] = useState(false);

  return (
    <>
      {/* 1. התפריט נמצא כאן, מחוץ ל-View הראשי כדי לצוף מעליו */}
      <SideMenu 
        visible={isMenuVisible} 
        onClose={() => setMenuVisible(false)} 
      />
    <View style={[layoutStyles.container, { backgroundColor: theme.background }]}>

      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background }}> 
        <View style={[layoutStyles.topBarContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
          
          {/* 2. התיקון: הוספנו onPress לכפתור */}
            <TouchableOpacity 
              style={layoutStyles.iconButton}
              onPress={() => setMenuVisible(true)} 
            >
              <Ionicons name="menu" size={28} color={theme.textMuted} />
            </TouchableOpacity>

          {/* Search Bar - שינוי צבע דינמי */}
          <TouchableOpacity 
            style={[layoutStyles.searchContainer, { backgroundColor: theme.surface, flex: 1 }]} 
            onPress={() => router.push('/search')} // Navigate to Search Screen
            activeOpacity={0.7}
          >
            <Ionicons name="search" size={20} color={theme.textMuted} />
            <Text style={[layoutStyles.searchPlaceholder, { color: theme.textMuted }]}>
              Search in Drive
            </Text>
          </TouchableOpacity>

          {/* Right Actions */}
          <View style={layoutStyles.rightActions}>
            <ThemeToggle />
            <ProfileButton />
          </View>

        </View>
      </SafeAreaView>

      {/* Tabs */}
      <View style={{ flex: 1 }}>
      <Tabs screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: theme.tabActive, 
          tabBarInactiveTintColor: theme.tabInactive,
          tabBarStyle: [layoutStyles.tabBarCustom, { 
            backgroundColor: theme.surface, 
            borderTopColor: theme.border 
          }]
      }}>
        
        <Tabs.Screen 
          name="index" 
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
            ),
          }} 
        />

        <Tabs.Screen name="Starred" options={{
            tabBarLabel: 'Starred',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'star' : 'star-outline'} size={size} color={color} />
            ),
        }} />

        <Tabs.Screen name="Shared" options={{
            tabBarLabel: 'Shared',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'people' : 'people-outline'} size={size} color={color} />
            ),
        }} />

        <Tabs.Screen name="Files" options={{
            tabBarLabel: 'Files',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'folder' : 'folder-outline'} size={size} color={color} />
            ),
        }} />

      </Tabs>
    </View>
    </View>
    </>
  );
}