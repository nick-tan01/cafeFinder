import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Alert, useColorScheme, AppState } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { TokenResponse } from 'expo-auth-session';

import { supabase } from '../../lib/supabase';

// Initialize WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function SignInScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '826580028121-ajld04ru0ucgn6d20ofa78dpicdkp7r4.apps.googleusercontent.com',
    webClientId: '826580028121-9m72cato1ca4j6m4gmgv75e9m90c0cp3.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@nathanlee727/cafe_complete',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      console.log('Sign in successful');
      router.replace('/(tabs)');
    } else if (response?.type === 'error') {
      console.error('Sign in error:', response.error);
      Alert.alert('Error', 'Could not sign in with Google');
    }
  }, [response]);

  async function handleGoogleSignIn() {
    try {
      setLoading(true);
      await promptAsync();
    } catch (error) {
      console.error('Google Sign In Error:', error);
      Alert.alert('Error', 'Could not sign in with Google');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

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
          title: 'Sign In',
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        }} 
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          Welcome Back
        </Text>
        <Text style={styles.subtitle}>
          Sign in to continue to your account
        </Text>

        <View style={styles.form}>
          <TouchableOpacity 
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <View style={styles.googleButtonContent}>
              <AntDesign name="google" size={20} color="#4285F4" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.orLine} />
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
              placeholder="Enter your password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.signInButton, !email || !password ? styles.signInButtonDisabled : null]}
            onPress={handleSignIn}
            disabled={!email || !password || loading}
          >
            <Text style={styles.signInButtonText}>Sign In with Email</Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {loading && <ActivityIndicator style={{ marginTop: 8 }} />}
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
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  signInButtonDisabled: {
    opacity: 0.5,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signUpText: {
    color: '#666',
    fontSize: 14,
  },
  signUpLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dadce0',
    marginTop: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: '#3c4043',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.25,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#dadce0',
  },
  orText: {
    color: '#666',
    fontSize: 14,
    marginHorizontal: 16,
  },
}); 