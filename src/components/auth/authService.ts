
import { supabase } from '@/lib/supabase';

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  userId: string;
  avatarUrl: string | null;
}

export const authService = {
  async signUp({ email, password, fullName, userId, avatarUrl }: SignUpData) {
    // First, sign up the user
    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_id: userId,
          avatar_url: avatarUrl,
        },
        emailRedirectTo: window.location.origin,
      }
    });
    
    if (signUpError) throw signUpError;

    // Don't try to create the profile record here because it violates RLS
    // The profile will be created automatically through the database trigger
    // that was set up in Supabase (handle_new_user function)

    return data;
  },

  async signIn(email: string, password: string) {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    // Clean up local storage and session storage
    try {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
    } catch (e) {
      console.log('Error clearing storage:', e);
    }
    
    // Call Supabase signOut method
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Force a full page reload to ensure all auth state is completely cleared
    window.location.href = '/';
    
    return true;
  }
};
