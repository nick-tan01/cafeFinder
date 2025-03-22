import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function CafeAdminLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#000' : '#fff',
        },
        headerTintColor: isDark ? '#fff' : '#000',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="dashboard"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="orders"
        options={{
          title: 'Orders',
        }}
      />
      <Stack.Screen
        name="menu"
        options={{
          title: 'Menu',
        }}
      />
      <Stack.Screen
        name="analytics"
        options={{
          title: 'Analytics',
        }}
      />
      <Stack.Screen
        name="reviews"
        options={{
          title: 'Reviews',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Stack>
  );
} 