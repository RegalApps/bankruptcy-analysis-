
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, KeyRound, Eye, EyeOff, Lock, Smartphone, RefreshCw, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecurityFormProps {
  onPasswordUpdate: () => void;
  passwordFields: PasswordUpdate;
  setPasswordFields: (fields: PasswordUpdate) => void;
  isUpdatingPassword: boolean;
}

export const SecurityForm = ({
  onPasswordUpdate,
  passwordFields,
  setPasswordFields,
  isUpdatingPassword,
}: SecurityFormProps) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [deviceManagement, setDeviceManagement] = useState(true);

  const handlePasswordUpdate = (field: keyof PasswordUpdate, value: string) => {
    setPasswordFields({ ...passwordFields, [field]: value });
  };

  const handleUpdatePassword = () => {
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    onPasswordUpdate();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              Password
            </CardTitle>
            <CardDescription>
              Update your password regularly to keep your account secure
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="relative">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordFields.currentPassword}
                  onChange={(e) => handlePasswordUpdate("currentPassword", e.target.value)}
                  placeholder="Enter your current password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordFields.newPassword}
                  onChange={(e) => handlePasswordUpdate("newPassword", e.target.value)}
                  placeholder="Enter new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordFields.confirmPassword}
                  onChange={(e) => handlePasswordUpdate("confirmPassword", e.target.value)}
                  placeholder="Confirm new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <p className="text-sm text-muted-foreground mb-2">Password requirements:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Minimum 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one number</li>
              <li>At least one special character</li>
            </ul>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword || !passwordFields.currentPassword || !passwordFields.newPassword || !passwordFields.confirmPassword}
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure additional security measures for your account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                Two-Factor Authentication
              </Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
              <Button 
                variant="outline" 
                size="sm"
                disabled={!twoFactorEnabled}
              >
                Setup
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                Auto Session Timeout
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically log out after 30 minutes of inactivity
              </p>
            </div>
            <Switch 
              checked={sessionTimeout}
              onCheckedChange={setSessionTimeout}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Device Management
              </Label>
              <p className="text-sm text-muted-foreground">
                View and manage devices that have access to your account
              </p>
            </div>
            <Button variant="outline" size="sm">Manage Devices</Button>
          </div>

          <div className="border-t pt-4 mt-2">
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <LogOut className="h-4 w-4 text-muted-foreground" />
                Active Sessions
              </h3>
              <div className="rounded-md border p-3 text-sm">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-xs text-muted-foreground">
                      Chrome on Windows • IP: 192.168.1.1
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Mobile App</p>
                    <p className="text-xs text-muted-foreground">
                      iPhone 13 • Last active: 2 hours ago
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7">Sign Out</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
