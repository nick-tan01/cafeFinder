import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useColorScheme } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

import { Amplify } from 'aws-amplify';
import { signIn, signInWithRedirect, resetPassword, confirmResetPassword } from "aws-amplify/auth";

import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);

export default function SignInScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
  
    try {
      const { isSignedIn, nextStep } = await signIn({ username: email, password });
  
      if (isSignedIn) {
        router.replace('/(tabs)'); // Success
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE') {
        // handle MFA here
        console.log('MFA required');
        // Use `confirmSignIn` in this case
      } else {
        console.log('Next step:', nextStep);
      }
  
    } catch (err) {
      console.error('Sign in error:', err);
      setError((err as Error).message || 'An error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (err) {
      console.error('Google Sign-In error:', err);
      setError((err as Error).message || 'Google Sign-In failed.');
    }
  };

  const handleRequestReset = async () => {
    setLoading(true);
    setError('');
    try {
      await resetPassword({ username: email });
      setShowResetForm(true); // Show the reset code input
    } catch (err) {
      setError((err as Error).message || 'Error sending reset code.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleConfirmReset = async () => {
    setLoading(true);
    setError('');
    try {
      await confirmResetPassword({ username: email, confirmationCode: resetCode, newPassword });
      alert('Password reset successful! You can now sign in.');
      setShowResetForm(false);
    } catch (err) {
      setError((err as Error).message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };
  

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

          <TouchableOpacity style={styles.forgotPassword} onPress={handleRequestReset}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          {showResetForm && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Reset Code</Text>
                <TextInput
                  style={styles.input}
                  value={resetCode}
                  onChangeText={setResetCode}
                  placeholder="Enter code from email"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#666"
                  secureTextEntry
                />
              </View>

              <TouchableOpacity 
                style={styles.signInButton}
                onPress={handleConfirmReset}
              >
                <Text style={styles.signInButtonText}>Confirm Reset</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity 
            style={[styles.signInButton, !email || !password ? styles.signInButtonDisabled : null]}
            onPress={handleSignIn}
            disabled={!email || !password}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.signInButton, { backgroundColor: '#DB4437' }]}
            onPress={handleGoogleSignIn}
          >
            <Text style={styles.signInButtonText}>Sign In with Google</Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
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
}); 