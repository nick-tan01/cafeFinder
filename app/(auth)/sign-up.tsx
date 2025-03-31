import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useColorScheme, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

import { supabase } from '../../lib/supabase';

export default function SignUpScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  async function handleSignUp() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }
// Confirm Email
  
  

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }
    ]}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Create Account',
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        }} 
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          Create Account
        </Text>
        <Text style={styles.subtitle}>
          Sign up to start ordering from your favorite cafes
        </Text>

        <View style={styles.form}>
          <View style={[
            styles.inputContainer,
            { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f5f5f5' }
          ]}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
              placeholder="Enter your full name"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={[
            styles.inputContainer,
            { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f5f5f5' }
          ]}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={[
            styles.inputContainer,
            { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f5f5f5' }
          ]}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
              placeholder="Create a password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          {showConfirm && (
            <>
              <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f5f5f5' }]}>
                <Text style={styles.label}>Confirmation Code</Text>
                <TextInput
                  style={[styles.input, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
                  placeholder="Enter code sent to email"
                  placeholderTextColor="#666"
                  value={confirmCode}
                  onChangeText={setConfirmCode}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity style={styles.signUpButton}>
                <Text style={styles.signUpButtonText}>Confirm Account</Text>
              </TouchableOpacity>
            </>
          )}

          {!showConfirm && (
            <TouchableOpacity
              style={[styles.signUpButton, !name || !email || !password ? styles.signUpButtonDisabled : null]}
              onPress={handleSignUp}
              disabled={!name || !email || !password}
            >
              <Text style={styles.signUpButtonText}>Create Account</Text>
            </TouchableOpacity>
          )}


          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/sign-in')}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
          {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}
          {loading && <Text style={{ marginTop: 8 }}>Processing...</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    padding: 0,
  },
  signUpButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  signUpButtonDisabled: {
    opacity: 0.5,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signInText: {
    color: '#666',
    fontSize: 14,
  },
  signInLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
}); 