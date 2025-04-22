
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { AccessControlSettings } from "@/components/settings/AccessControlSettings";
import { MeetingIntegrationsSection } from "@/components/settings/MeetingIntegrationsSection";
import { useSettings } from "@/hooks/useSettings";
import { toast } from "sonner";
import { Settings, Shield, Users, Link } from "lucide-react";

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
      <div className="container mx-auto py-8 max-w-[1200px]">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Customize your workspace preferences and security settings.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-72 shrink-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
              <TabsList className="h-auto flex flex-col w-full p-1 gap-1 bg-card shadow-inner rounded-xl border-2">
                <TabsTrigger 
                  value="general" 
                  className="w-full justify-start gap-3 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
                >
                  <Settings className="h-5 w-5" />
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold">General</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      Appearance, language and regional settings
                    </span>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="security" 
                  className="w-full justify-start gap-3 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
                >
                  <Shield className="h-5 w-5" />
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold">Security</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      Password, 2FA and access management
                    </span>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="access" 
                  className="w-full justify-start gap-3 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
                >
                  <Users className="h-5 w-5" />
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold">Access Control</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      User roles and permissions
                    </span>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="integrations" 
                  className="w-full justify-start gap-3 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
                >
                  <Link className="h-5 w-5" />
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold">Integrations</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      Connect external services
                    </span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="bg-card shadow-sm rounded-xl border-2 p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="general" className="mt-0">
                  <GeneralSettings 
                    settings={settings.generalSettings} 
                    onSave={handleSaveGeneralSettings}
                    isLoading={isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="security" className="mt-0">
                  <SecuritySettings 
                    settings={settings.securitySettings} 
                    onSave={handleSaveSecuritySettings}
                    isLoading={isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="access" className="mt-0">
                  <AccessControlSettings />
                </TabsContent>
                
                <TabsContent value="integrations" className="mt-0">
                  <MeetingIntegrationsSection />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
