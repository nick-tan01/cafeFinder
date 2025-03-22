import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function AdminLogin() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#fff' : '#000';
  const bgColor = isDark ? '#000' : '#fff';
  const inputBgColor = isDark ? '#1c1c1e' : '#f2f2f7';

  const handleLogin = () => {
    // For demo purposes, using hardcoded credentials
    if (username === 'admin' && password === 'admin') {
      router.push('/(cafe-admin)/dashboard');
    } else {
      Alert.alert('Error', 'Invalid credentials. Please try again.');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Cafe Admin Login",
          headerStyle: {
            backgroundColor: bgColor,
          },
          headerTintColor: textColor,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      />
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.logoContainer}>
          <FontAwesome name="coffee" size={64} color="#007AFF" />
          <Text style={[styles.title, { color: textColor }]}>Cafe Admin Portal</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={[styles.inputContainer, { backgroundColor: inputBgColor }]}>
            <FontAwesome name="user" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Username"
              placeholderTextColor="#666"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: inputBgColor }]}>
            <FontAwesome name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, { opacity: (!username || !password) ? 0.7 : 1 }]}
            onPress={handleLogin}
            disabled={!username || !password}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 