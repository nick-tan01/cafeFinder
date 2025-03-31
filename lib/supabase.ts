import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://jwzznddtsvfmpcuuhass.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3enpuZGR0c3ZmbXBjdXVoYXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyOTk5MzYsImV4cCI6MjA1ODg3NTkzNn0.bURCz8l7cJkDmGZEhUpZ5hlozYA7vSFLPmI7eCOJkp8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})