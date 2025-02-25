
import { useState, useEffect } from "react";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { usePreferences } from "@/hooks/use-preferences";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { SecurityForm } from "@/components/profile/SecurityForm";

interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ProfilePage = () => {
  const { toast } = useToast();
  const [passwordFields, setPasswordFields] = useState<PasswordUpdate>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const {
    profile,
    setProfile,
    isLoadingProfile,
    debouncedProfile,
    updateProfile,
    isUpdatingProfile
  } = useProfile();

  const {
    preferences,
    isLoadingPreferences,
    handlePreferencesUpdate
  } = usePreferences();

  // Only update when debounced profile changes and we're not already updating
  useEffect(() => {
    if (debouncedProfile && profile && !isUpdatingProfile && JSON.stringify(debouncedProfile) !== JSON.stringify(profile)) {
      updateProfile.mutate(debouncedProfile);
    }
  }, [debouncedProfile, profile, isUpdatingProfile]);

  const handleProfileChange = (field: keyof typeof profile, value: string) => {
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
                </div>

                <ProfileForm
                  profile={profile}
                  onProfileChange={handleProfileChange}
                  onAvatarUpload={handleAvatarUpload}
                />
              </div>

              <div className="glass-panel rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Security</h2>
                <SecurityForm
                  onPasswordUpdate={handlePasswordUpdate}
                  passwordFields={passwordFields}
                  setPasswordFields={setPasswordFields}
                  isUpdatingPassword={isUpdatingPassword}
                />
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
    </div>
  );
};
