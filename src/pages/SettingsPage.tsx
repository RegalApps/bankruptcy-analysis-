
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntegrationsSection } from "@/components/crm/integrations/IntegrationsSection";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { MeetingIntegrationsSection } from "@/components/settings/MeetingIntegrationsSection";
import { useSettings } from "@/hooks/useSettings";

export const SettingsPage = () => {
  const { isLoading, generalSettings, securitySettings, saveSettings } = useSettings();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your application settings and integrations
              </p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="integrations">API Integrations</TabsTrigger>
                <TabsTrigger value="meetings">Meeting Integrations</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <GeneralSettings 
                  settings={generalSettings}
                  onSave={() => saveSettings("general")}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="integrations">
                <IntegrationsSection />
              </TabsContent>
              
              <TabsContent value="meetings">
                <MeetingIntegrationsSection />
              </TabsContent>

              <TabsContent value="security">
                <SecuritySettings 
                  settings={securitySettings}
                  onSave={() => saveSettings("security")}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
