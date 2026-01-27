import { Tabs, useGlobalSearchParams, router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { layoutStyles } from '../../styles/layoutStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef } from 'react'
import CreateFile from '../../components/operations/CreateFile'
import CreateFolder from '../../components/operations/CreateFolder'
import AntDesign from '@expo/vector-icons/AntDesign';
import FileUpload from '../../components/FileUpload';
import Entypo from '@expo/vector-icons/Entypo';
import CameraUpload from '../../components/operations/CameraUpload';


export default function TabsLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateFileVisible, setIsCreateFileVisible] = useState(false)
  const [isCreateFolderVisible, setIsCreateFolderVisible] = useState(false)
  const { folderId } = useGlobalSearchParams();

  const fileUploadRef = useRef(null);  // ref to access FileUpload methods
  const cameraUploadRef = useRef(null);

  const handleTabPress = (e, path) => {
    e.preventDefault()
    router.replace(path)
  }

  return (
    <View style={layoutStyles.container}>
      {/* logic only - not taking space */}
      <CreateFile visible={isCreateFileVisible} parentId={folderId || null} onClose={() => setIsCreateFileVisible(false)} />
      <CreateFolder visible={isCreateFolderVisible} parentId={folderId || null} onClose={() => setIsCreateFolderVisible(false)} />
      <FileUpload ref={fileUploadRef} folderId={folderId} />
      <CameraUpload ref={cameraUploadRef} folderId={folderId} />

      {/* Top Bar & Tabs */}
      <SafeAreaView edges={['top']} style={layoutStyles.safeArea}>
         <View style={layoutStyles.topBar}><Text style={layoutStyles.topBarText}>top bar</Text></View>
      </SafeAreaView>

      <View style={{ flex: 1 }}>
        <Tabs screenOptions={{ 
            headerShown: false,
            unmountOnBlur: true, 
            tabBarActiveTintColor: layoutStyles.activeColor,   
            tabBarInactiveTintColor: layoutStyles.inactiveColor, 
            tabBarStyle: layoutStyles.tabBarCustom,
        }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
            }}
            listeners={{
              tabPress: (e) => handleTabPress(e, '/(tabs)/'),
            }}
          />
          <Tabs.Screen
            name="Files"
            options={{
              title: 'Files',
              tabBarIcon: ({ color }) => <Ionicons name="folder" size={24} color={color} />,
            }}
            listeners={{
              tabPress: (e) => handleTabPress(e, '/(tabs)/Files'),
            }}
          />
          <Tabs.Screen
            name="Shared"
            options={{
              title: 'Shared',
              tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
            }}
            listeners={{
              tabPress: (e) => handleTabPress(e, '/(tabs)/Shared'),
            }}
          />
          <Tabs.Screen
            name="Starred"
            options={{
              title: 'Starred',
              tabBarIcon: ({ color }) => <Ionicons name="star" size={24} color={color} />,
            }}
            listeners={{
              tabPress: (e) => handleTabPress(e, '/(tabs)/Starred'),
            }}
          />
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
      >
        <Ionicons name={isOpen ? "close" : "add"} size={35} color="white" />
      </TouchableOpacity>
    </View>
  );
}