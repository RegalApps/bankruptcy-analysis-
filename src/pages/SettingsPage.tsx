
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { AccessControlSettings } from "@/components/settings/AccessControlSettings";
import { MeetingIntegrationsSection } from "@/components/settings/MeetingIntegrationsSection";
import { useSettings } from "@/hooks/useSettings";
import { toast } from "sonner";

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
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="border-b w-full justify-start rounded-none p-0">
            <TabsTrigger 
              value="general" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              General
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="access" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Access Control
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Integrations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <GeneralSettings 
              settings={settings.generalSettings} 
              onSave={handleSaveGeneralSettings}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <SecuritySettings 
              settings={settings.securitySettings} 
              onSave={handleSaveSecuritySettings}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="access" className="mt-6">
            <AccessControlSettings />
          </TabsContent>
          
          <TabsContent value="integrations" className="mt-6">
            <MeetingIntegrationsSection />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
