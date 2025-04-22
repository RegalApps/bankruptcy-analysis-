
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { AccessControlSettings } from "@/components/settings/AccessControlSettings";
import { MeetingIntegrationsSection } from "@/components/settings/MeetingIntegrationsSection";
import { useSettings } from "@/hooks/useSettings";
import { toast } from "sonner";
import { Settings, Shield, Users, Link, Layers } from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const settings = useSettings();

  const handleSaveGeneralSettings = async () => {
    setIsLoading(true);
    try {
      await settings.saveSettings("general");
      toast.success("General settings saved successfully");
    } catch (error) {
      toast.error("Failed to save general settings");
      console.error("Settings save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSecuritySettings = async () => {
    setIsLoading(true);
    try {
      await settings.saveSettings("security");
      toast.success("Security settings saved successfully");
    } catch (error) {
      toast.error("Failed to save security settings");
      console.error("Settings save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 max-w-[1200px] px-4">
        <div className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-8 md:p-10">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-primary-foreground mb-2">Settings</h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">
              Customize your workspace preferences and security settings
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start p-1 gap-1 bg-muted rounded-xl border border-border shadow-sm overflow-x-auto">
              <TabsTrigger
                value="general"
                className="flex items-center gap-2 px-4 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Settings className="h-5 w-5" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex items-center gap-2 px-4 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger
                value="access"
                className="flex items-center gap-2 px-4 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Users className="h-5 w-5" />
                <span>Access Control</span>
              </TabsTrigger>
              <TabsTrigger
                value="integrations"
                className="flex items-center gap-2 px-4 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Layers className="h-5 w-5" />
                <span className="relative">
                  Integrations
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary opacity-50 group-data-[state=active]:opacity-100 transition-opacity"></span>
                </span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 bg-card shadow-sm rounded-xl border border-border p-6">
              <TabsContent value="general">
                <GeneralSettings 
                  settings={settings.generalSettings} 
                  onSave={handleSaveGeneralSettings}
                  isLoading={isLoading}
                />
              </TabsContent>
              
              <TabsContent value="security">
                <SecuritySettings 
                  settings={settings.securitySettings} 
                  onSave={handleSaveSecuritySettings}
                  isLoading={isLoading}
                />
              </TabsContent>
              
              <TabsContent value="access">
                <AccessControlSettings />
              </TabsContent>
              
              <TabsContent value="integrations">
                <MeetingIntegrationsSection />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
