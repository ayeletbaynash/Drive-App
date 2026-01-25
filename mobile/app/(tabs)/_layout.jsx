import { Tabs, useGlobalSearchParams } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { layoutStyles } from '../../styles/layoutStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react'
import CreateFile from '../../components/operations/CreateFile'
import CreateFolder from '../../components/operations/CreateFolder'
import AntDesign from '@expo/vector-icons/AntDesign';


export default function TabsLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateFileVisible, setIsCreateFileVisible] = useState(false)
  const [isCreateFolderVisible, setIsCreateFolderVisible] = useState(false)
  const { folderId } = useGlobalSearchParams();

  return (
    <View style={layoutStyles.container}>
      
      {/* Top Bar */}
      <SafeAreaView edges={['top']} style={layoutStyles.safeArea}>
        <View style={layoutStyles.topBar}>
          <Text style={layoutStyles.topBarText}>top bar</Text>
        </View>
      </SafeAreaView>

      {/* Tabs */}
      <View style={{ flex: 1 }}>
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
  );
}