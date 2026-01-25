import React, { useState } from 'react';
import { Tabs, useRouter, useGlobalSearchParams } from 'expo-router';
import { View, Text, TouchableOpacity, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { layoutStyles } from '../../styles/layoutStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileButton from '../../components/ProfileButton';
import ThemeToggle from '../../components/ThemeToggle'; // הכפתור החדש
import { useAppTheme } from '../../context/ThemeContext'; // ה-Hook שלנו
import SideMenu from '../../components/SideMenu';
import React, { useState } from 'react'
import CreateFile from '../../components/operations/CreateFile'
import CreateFolder from '../../components/operations/CreateFolder'
import AntDesign from '@expo/vector-icons/AntDesign';


export default function TabsLayout() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const [isMenuVisible, setMenuVisible] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isCreateFileVisible, setIsCreateFileVisible] = useState(false)
  const [isCreateFolderVisible, setIsCreateFolderVisible] = useState(false)
  const { folderId } = useGlobalSearchParams();

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
      </View>

      {/* the options of the + menu */}
      {isOpen && (
        <View style={layoutStyles.optionsContainer}>

   {/*the text "new folder".click on him will open the modal for this */}

          <TouchableOpacity 
            style={layoutStyles.optionItem} 
            onPress={() => { 
                setIsOpen(false); 
                setIsCreateFolderVisible(true); 
            }}
          >
            <Text style={layoutStyles.optionText}>New Folder</Text>
            <View style={layoutStyles.iconCircle}>
              <AntDesign name="folder-add" size={24} color="white" /> 
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={layoutStyles.optionItem} 
            onPress={() => { console.log("Upload File"); setIsOpen(false); }}
          >

            <Text style={layoutStyles.optionText}>Upload File</Text>
            <View style={layoutStyles.iconCircle}>
              <Ionicons name="folder-add" size={24} color="white" />
            </View>
          </TouchableOpacity>


              {/*the text "new text file".click on him will open the modal for this */}
          <TouchableOpacity 
            style={layoutStyles.optionItem} 
            onPress={() => { 
                setIsOpen(false); 
                setIsCreateFileVisible(true); 
            }}
          >
            <Text style={layoutStyles.optionText}>New Text File</Text>
            <View style={layoutStyles.iconCircle}>
              <Ionicons name="document-text-outline" size={24} color="white" />
            </View>
          </TouchableOpacity>

        </View>
      )}

      {/*button + */}
      <TouchableOpacity 
        style={[layoutStyles.fab]} 
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.8}
      >
        <Ionicons name={isOpen ? "close" : "add"} size={35} color="white" />
      </TouchableOpacity>
{/* the component of create file */}
<CreateFile 
        visible={isCreateFileVisible}
        parentId={folderId || null} 
        onClose={() => setIsCreateFileVisible(false)} 
        onSuccess={() => {
            console.log("File created successfully!");
            setIsCreateFileVisible(false);
        }}
      />
      {/* the component of create folder */}
      <CreateFolder 
        visible={isCreateFolderVisible} 
        parentId={folderId || null} 
        onClose={() => setIsCreateFolderVisible(false)} 
        onSuccess={() => setIsCreateFolderVisible(false)}
      />
    </View>
    </>
  );
}