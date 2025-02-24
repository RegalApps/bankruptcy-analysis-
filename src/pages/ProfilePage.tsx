
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { PersonalInfo } from "@/components/profile/sections/PersonalInfo";
import { SecuritySettings } from "@/components/profile/sections/SecuritySettings";
import { Preferences } from "@/components/profile/sections/Preferences";
import { TabsContent } from "@/components/ui/tabs";

export const ProfilePage = () => {
  return (
    <div>
      <MainSidebar />
      <div className="pl-16">
        <MainHeader />
        <div className="container mx-auto py-8 px-4">
          <ProfileHeader name="John Doe" role="manager" />
          
          <div className="max-w-4xl mx-auto">
            <ProfileTabs>
              <TabsContent value="personal">
                <PersonalInfo />
              </TabsContent>
              <TabsContent value="security">
                <SecuritySettings />
              </TabsContent>
              <TabsContent value="preferences">
                <Preferences />
              </TabsContent>
            </ProfileTabs>
          </div>
        </div>
      </div>
    </div>
  );
};
