
import { MainHeader } from "@/components/header/MainHeader";

export const ProfilePage = () => {
  return (
    <div className="pl-16">
      <MainHeader />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <p className="text-muted-foreground">Manage your profile settings here.</p>
      </div>
    </div>
  );
};
