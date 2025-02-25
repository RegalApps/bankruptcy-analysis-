
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntegrationsSection } from "@/components/crm/integrations/IntegrationsSection";
import { Card } from "@/components/ui/card";

export const SettingsPage = () => {
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

            <Tabs defaultValue="integrations" className="space-y-6">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">General Settings</h2>
                  {/* General settings content will go here */}
                </Card>
              </TabsContent>

              <TabsContent value="integrations">
                <IntegrationsSection />
              </TabsContent>

              <TabsContent value="security">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
                  {/* Security settings content will go here */}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
