import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { layoutStyles } from '../../styles/layoutStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabsLayout() {
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
  );
}