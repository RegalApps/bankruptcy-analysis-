import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserCircle2 } from "lucide-react";
import { ProfilePicture } from "@/components/ProfilePicture";
import { useDebounce } from "@/hooks/use-debounce";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ProfilePage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [passwordFields, setPasswordFields] = useState<PasswordUpdate>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const debouncedProfile = useDebounce(profile, 1000);

  // Fetch user profile
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

  // Fetch user preferences
  const { data: preferences, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ['user-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (updatedProfile: Partial<UserProfile>) => {
      if (isUpdatingProfile) return; // Prevent multiple simultaneous updates
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

  // Effect to handle debounced profile updates
  useEffect(() => {
    if (debouncedProfile && profile && !isUpdatingProfile) {
      updateProfile.mutate(debouncedProfile);
    }
  }, [debouncedProfile]);

  // Handle theme changes
  useEffect(() => {
    if (preferences?.dark_mode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences?.dark_mode]);

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordFields.newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });

      setPasswordFields({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleAvatarUpload = (url: string) => {
    if (profile) {
      handleProfileChange('avatar_url', url);
    }
  };

  const handlePreferencesUpdate = async ({ key, value }: { key: string; value: boolean }) => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({ [key]: value })
        .eq('user_id', profile?.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
      toast({
        title: "Preferences updated",
        description: `${key === 'dark_mode' ? 'Theme' : 'Email notifications'} preference has been updated.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating preferences",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isLoading = isLoadingProfile || isLoadingPreferences;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="glass-panel rounded-lg p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">Profile Settings</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your account settings and preferences
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <ProfilePicture
                      url={profile?.avatar_url || null}
                      onUpload={handleAvatarUpload}
                      size={120}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profile?.full_name || ''}
                        onChange={(e) => handleProfileChange('full_name', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile?.email || ''}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Security</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordFields.currentPassword}
                      onChange={(e) => setPasswordFields(prev => ({
                        ...prev,
                        currentPassword: e.target.value
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordFields.newPassword}
                      onChange={(e) => setPasswordFields(prev => ({
                        ...prev,
                        newPassword: e.target.value
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordFields.confirmPassword}
                      onChange={(e) => setPasswordFields(prev => ({
                        ...prev,
                        confirmPassword: e.target.value
                      }))}
                    />
                  </div>
                  <Button
                    onClick={handlePasswordUpdate}
                    disabled={isUpdatingPassword || !passwordFields.currentPassword || !passwordFields.newPassword || !passwordFields.confirmPassword}
                    className="w-full"
                  >
                    {isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                  </Button>
                </div>
              </div>

              <div className="glass-panel rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your activity
                      </p>
                    </div>
                    <Switch
                      checked={preferences?.email_notifications ?? false}
                      onCheckedChange={(checked) => handlePreferencesUpdate({
                        key: 'email_notifications',
                        value: checked
                      })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Dark Mode</h3>
                      <p className="text-sm text-muted-foreground">
                        Toggle dark mode theme
                      </p>
                    </div>
                    <Switch
                      checked={preferences?.dark_mode ?? false}
                      onCheckedChange={(checked) => handlePreferencesUpdate({
                        key: 'dark_mode',
                        value: checked
                      })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Toaster />
    </div>
  );
};

