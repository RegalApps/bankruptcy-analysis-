
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { Profile } from '../types';

export const useCommentUser = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<Profile | undefined>(undefined);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        if (user) {
          setCurrentUser(user);
          
          // Get user profile info
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, full_name, avatar_url')
            .eq('id', user.id)
            .single();
            
          if (profileError) throw profileError;
          setUserProfile(profile as Profile);
        }
      } catch (error: any) {
        console.error('Error fetching user:', error);
        setLoadingError(error.message);
      }
    };
    
    fetchCurrentUser();
  }, []);

  return {
    currentUser,
    userProfile,
    loadingError
  };
};
