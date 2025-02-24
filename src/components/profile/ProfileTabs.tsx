
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, User } from "lucide-react";

interface ProfileTabsProps {
  children: React.ReactNode;
}

export const ProfileTabs = ({ children }: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="personal" className="gap-2">
          <User className="h-4 w-4" />
          Personal Info
        </TabsTrigger>
        <TabsTrigger value="security" className="gap-2">
          <Shield className="h-4 w-4" />
          Security
        </TabsTrigger>
        <TabsTrigger value="preferences" className="gap-2">
          <Settings className="h-4 w-4" />
          Preferences
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};
