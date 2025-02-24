
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";

export const ProfilePage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user preferences
  const { data: preferences, isLoading } = useQuery({
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

  // Update preferences mutation
  const updatePreferences = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: boolean }) => {
      const { error } = await supabase
        .from('user_preferences')
        .update({ [key]: value })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
      toast({
        title: "Preferences updated",
        description: `${variables.key === 'dark_mode' ? 'Theme' : 'Email notifications'} preference has been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating preferences",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle theme changes
  useEffect(() => {
    if (preferences?.dark_mode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences?.dark_mode]);

  const handleThemeChange = (checked: boolean) => {
    updatePreferences.mutate({ key: 'dark_mode', value: checked });
  };

  const handleNotificationsChange = (checked: boolean) => {
    updatePreferences.mutate({ key: 'email_notifications', value: checked });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="glass-panel rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <input type="text" className="w-full mt-1 p-2 rounded-md border" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <input type="text" className="w-full mt-1 p-2 rounded-md border" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" className="w-full mt-1 p-2 rounded-md border" />
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <input type="text" className="w-full mt-1 p-2 rounded-md border" disabled />
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Security</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Current Password</label>
                  <input type="password" className="w-full mt-1 p-2 rounded-md border" />
                </div>
                <div>
                  <label className="text-sm font-medium">New Password</label>
                  <input type="password" className="w-full mt-1 p-2 rounded-md border" />
                </div>
                <div>
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <input type="password" className="w-full mt-1 p-2 rounded-md border" />
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive email updates about your activity</p>
                  </div>
                  <Switch
                    checked={preferences?.email_notifications ?? false}
                    onCheckedChange={handleNotificationsChange}
                    disabled={isLoading || updatePreferences.isPending}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-muted-foreground">Toggle dark mode theme</p>
                  </div>
                  <Switch
                    checked={preferences?.dark_mode ?? false}
                    onCheckedChange={handleThemeChange}
                    disabled={isLoading || updatePreferences.isPending}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 rounded-md border hover:bg-muted transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};
