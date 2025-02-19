
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
        }
      }
    });
    
    if (signUpError) throw signUpError;

    // Only create profile if we have a user
    if (data?.user) {
      // Sign in immediately after signup to ensure we have a valid session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Now create the profile with the authenticated session
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
    }

    return data;
  },

  async signIn(email: string, password: string) {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  }
};
