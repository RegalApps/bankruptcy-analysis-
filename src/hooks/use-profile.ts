
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from "@/hooks/use-debounce";

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

export const useProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const debouncedProfile = useDebounce(profile, 1000);

  // Check if avatars bucket exists, create if necessary
  useEffect(() => {
    const checkAndCreateBucket = async () => {
      try {
        const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets();
        
        if (getBucketsError) {
          console.error('Error checking buckets:', getBucketsError);
          return;
        }
        
        const avatarBucketExists = buckets.some(bucket => bucket.name === 'avatars');
        
        if (!avatarBucketExists) {
          console.log('Creating avatars bucket');
          const { error: createBucketError } = await supabase.storage.createBucket('avatars', {
            public: true
          });
          
          if (createBucketError) {
            console.error('Error creating avatars bucket:', createBucketError);
          }
        }
      } catch (error) {
        console.error('Error in bucket check:', error);
      }
    };
    
    checkAndCreateBucket();
  }, []);

  const { isLoading: isLoadingProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updatedProfile: Partial<UserProfile>) => {
      if (isUpdatingProfile) return;
      setIsUpdatingProfile(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', profile?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsUpdatingProfile(false);
    },
    onError: (error) => {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
      setIsUpdatingProfile(false);
    },
  });

  return {
    profile,
    setProfile,
    isLoadingProfile,
    debouncedProfile,
    updateProfile,
    isUpdatingProfile
  };
};
