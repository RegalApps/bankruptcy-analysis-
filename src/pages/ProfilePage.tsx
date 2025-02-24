import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";

export const ProfilePage = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="glass-panel rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <input type="text" className="w-full mt-1 p-2 rounded-md border" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <input type="text" className="w-full mt-1 p-2 rounded-md border" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" className="w-full mt-1 p-2 rounded-md border" />
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <input type="text" className="w-full mt-1 p-2 rounded-md border" disabled />
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Security</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Current Password</label>
                  <input type="password" className="w-full mt-1 p-2 rounded-md border" />
                </div>
                <div>
                  <label className="text-sm font-medium">New Password</label>
                  <input type="password" className="w-full mt-1 p-2 rounded-md border" />
                </div>
                <div>
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <input type="password" className="w-full mt-1 p-2 rounded-md border" />
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive email updates about your activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-muted-foreground">Toggle dark mode theme</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 rounded-md border hover:bg-muted transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
