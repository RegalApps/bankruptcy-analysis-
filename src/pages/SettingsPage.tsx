
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
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your application preferences and security settings.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 shrink-0">
            <div className="space-y-4">
              <TabsList className="h-auto flex flex-col w-full bg-muted p-2 rounded-lg">
                <TabsTrigger 
                  value="general" 
                  className="w-full justify-start gap-2 p-3"
                  onClick={() => setActiveTab("general")}
                  data-state={activeTab === "general" ? "active" : ""}
                >
                  <Settings className="h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="w-full justify-start gap-2 p-3"
                  onClick={() => setActiveTab("security")}
                  data-state={activeTab === "security" ? "active" : ""}
                >
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger 
                  value="access" 
                  className="w-full justify-start gap-2 p-3"
                  onClick={() => setActiveTab("access")}
                  data-state={activeTab === "access" ? "active" : ""}
                >
                  <Users className="h-4 w-4" />
                  Access Control
                </TabsTrigger>
                <TabsTrigger 
                  value="integrations" 
                  className="w-full justify-start gap-2 p-3"
                  onClick={() => setActiveTab("integrations")}
                  data-state={activeTab === "integrations" ? "active" : ""}
                >
                  <Link className="h-4 w-4" />
                  Integrations
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
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
    </MainLayout>
  );
};

export default SettingsPage;
