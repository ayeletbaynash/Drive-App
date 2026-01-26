import React, { useState } from 'react';
import { Tabs, useRouter, useGlobalSearchParams } from 'expo-router';
import { View, Text, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { layoutStyles } from '../../styles/layoutStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react'
import ProfileButton from '../../components/ProfileButton';
import ThemeToggle from '../../components/ThemeToggle'; // הכפתור החדש
import { useAppTheme } from '../../context/ThemeContext'; // ה-Hook שלנו
import CreateFile from '../../components/operations/CreateFile'
import CreateFolder from '../../components/operations/CreateFolder'
import AntDesign from '@expo/vector-icons/AntDesign';
import FileUpload from '../../components/FileUpload';
import Entypo from '@expo/vector-icons/Entypo';
import CameraUpload from '../../components/operations/CameraUpload';


export default function TabsLayout() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const [isMenuVisible, setMenuVisible] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isCreateFileVisible, setIsCreateFileVisible] = useState(false)
  const [isCreateFolderVisible, setIsCreateFolderVisible] = useState(false)
  const { folderId } = useGlobalSearchParams();

  const fileUploadRef = useRef(null);  // ref to access FileUpload methods
  const cameraUploadRef = useRef(null);

  return (
    <>
      {/* 1. התפריט נמצא כאן, מחוץ ל-View הראשי כדי לצוף מעליו */}
      <SideMenu 
        visible={isMenuVisible} 
        onClose={() => setMenuVisible(false)} 
      />
    <View style={[layoutStyles.container, { backgroundColor: theme.background }]}>

      <View style={layoutStyles.container}>
      {/* logic only - not taking space */}
      <CreateFile visible={isCreateFileVisible} parentId={folderId || null} onClose={() => setIsCreateFileVisible(false)} />
      <CreateFolder visible={isCreateFolderVisible} parentId={folderId || null} onClose={() => setIsCreateFolderVisible(false)} />
      <FileUpload ref={fileUploadRef} folderId={folderId} />
      <CameraUpload ref={cameraUploadRef} folderId={folderId} />
      </View>
      {/* Top Bar & Tabs */}
      {/* <SafeAreaView edges={['top']} style={layoutStyles.safeArea}></SafeAreaView> */}

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
    
         <View style={layoutStyles.topBar}><Text style={layoutStyles.topBarText}>top bar</Text></View>
      </SafeAreaView>

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
            unmountOnBlur: true,
          }} 
        />
        <Tabs screenOptions={{ 
          headerShown: false, 
          tabBarActiveTintColor: layoutStyles.activeColor, 
          tabBarInactiveTintColor: layoutStyles.inactiveColor,
          tabBarStyle: layoutStyles.tabBarCustom 
          }}>
          
          <Tabs.Screen 
            name="index" 
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
              ),
              unmountOnBlur: true,
            }} 
          />

          <Tabs.Screen name="Starred" options={{
              tabBarLabel: 'Starred',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? 'star' : 'star-outline'} size={size} color={color} />
              ),
              unmountOnBlur: true,
          }} />

          <Tabs.Screen name="Shared" options={{
              tabBarLabel: 'Shared',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? 'people' : 'people-outline'} size={size} color={color} />
              ),
              unmountOnBlur: true,
          }} />

          <Tabs.Screen name="Files" options={{
              tabBarLabel: 'Files',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? 'folder' : 'folder-outline'} size={size} color={color} />
              ),
              unmountOnBlur: true,
          }} />

      </Tabs>
      </Tabs>
    </View>

      {/* options menu - must be above everything */}
      {isOpen && (
        <View style={layoutStyles.optionsContainer}>
          <TouchableOpacity style={layoutStyles.optionItem} onPress={() => { setIsOpen(false); setIsCreateFolderVisible(true); }}>
            <Text style={layoutStyles.optionText}>New Folder</Text>
            <View style={layoutStyles.iconCircle}><AntDesign name="folder-add" size={24} color="white" /></View>
          </TouchableOpacity>

          <TouchableOpacity style={layoutStyles.optionItem} onPress={() => { setIsOpen(false); fileUploadRef.current?.handleUpload(); }}>
            <Text style={layoutStyles.optionText}>Upload File</Text>
            <View style={layoutStyles.iconCircle}><Entypo name="upload" size={24} color="white" /></View>
          </TouchableOpacity>

          <TouchableOpacity style={layoutStyles.optionItem} onPress={() => { setIsOpen(false); setIsCreateFileVisible(true); }}>
            <Text style={layoutStyles.optionText}>New Text File</Text>
            <View style={layoutStyles.iconCircle}><Ionicons name="document-text-outline" size={24} color="white" /></View>
          </TouchableOpacity>
        </View>
      )}

      {/* camera button - Always on */}
      <TouchableOpacity 
        style={[layoutStyles.fab, layoutStyles.cameraFab]} 
        onPress={() => cameraUploadRef.current?.handleCamera()}
      >
        <Ionicons name="camera" size={24} color="white" />
      </TouchableOpacity>

      {/* plus button */}
      <TouchableOpacity 
        style={layoutStyles.fab} 
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.8}
      >
        <Ionicons name={isOpen ? "close" : "add"} size={35} color="white" />
      </TouchableOpacity>
    </View>
    </>
  );
}