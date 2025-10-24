import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hhawezsgcbosghieqduz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoYXdlenNnY2Jvc2doaWVxZHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMTc2NjMsImV4cCI6MjA3NTU5MzY2M30.hzj3IYLXQynJxa9_qivIVreH6bkbx0FHMDEAwBy-uek'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
