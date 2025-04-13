import React from 'react';
import { Tabs, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
          tabBarInactiveTintColor: colorScheme === 'dark' ? '#666' : '#999',
          tabBarStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Explore',
            headerTitle: 'Explore Cafes',
            tabBarIcon: ({ color }) => <FontAwesome name="compass" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            headerTitle: 'Search',
            tabBarIcon: ({ color }) => <FontAwesome name="search" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: 'Orders',
            headerTitle: 'My Orders',
            tabBarIcon: ({ color }) => <FontAwesome name="list" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerTitle: 'My Profile',
            tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
