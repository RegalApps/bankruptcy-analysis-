
import { ReactNode } from "react";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";

interface TabsContainerProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  generateLinkContent: ReactNode;
  requestsContent: ReactNode;
  templatesContent: ReactNode;
  settingsContent: ReactNode;
}

export const TabsContainer = ({
  currentTab,
  setCurrentTab,
  generateLinkContent,
  requestsContent,
  templatesContent,
  settingsContent
}: TabsContainerProps) => {
  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="generate-link">Generate Booking Link</TabsTrigger>
        <TabsTrigger value="requests">Booking Requests</TabsTrigger>
        <TabsTrigger value="templates">Email Templates</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="generate-link" className="space-y-4">
        {generateLinkContent}
      </TabsContent>
      
      <TabsContent value="requests">
        {requestsContent}
      </TabsContent>
      
      <TabsContent value="templates">
        {templatesContent}
      </TabsContent>
      
      <TabsContent value="settings">
        {settingsContent}
      </TabsContent>
    </Tabs>
  );
};
