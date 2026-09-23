import { Tabs } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1F2937',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="student"
        options={{
          title: 'Sinh viên',
          tabBarIcon: ({ color }) => <Ionicons name="school" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
