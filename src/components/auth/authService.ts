
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

    // Only create profile if we have a user
    if (data?.user) {
      try {
        // Create profile for the user even though they haven't confirmed email yet
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: fullName,
            user_id: userId,
            avatar_url: avatarUrl,
            email: email,
          });

        if (profileError) throw profileError;
      } catch (error) {
        console.error("Error creating user profile:", error);
        // We don't throw here as the user is already created
        // Just log the error and continue
      }
    }

    return data;
  },

  async signIn(email: string, password: string) {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  },

  async signOut() {
    try {
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
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  },

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },

  async updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Update password error:", error);
      throw error;
    }
  },

  async refreshSession() {
    try {
      const { error, data } = await supabase.auth.refreshSession();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Session refresh error:", error);
      throw error;
    }
  }
};
