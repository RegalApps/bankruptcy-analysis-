
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Shield, Clock, Globe, Bell } from "lucide-react";
import { Loader2 } from "lucide-react";

interface SecuritySettingsProps {
  settings: {
    twoFactorEnabled: boolean;
    setTwoFactorEnabled: (value: boolean) => void;
    sessionTimeout: string;
    setSessionTimeout: (value: string) => void;
    ipWhitelisting: boolean;
    setIpWhitelisting: (value: boolean) => void;
    loginNotifications: boolean;
    setLoginNotifications: (value: boolean) => void;
    documentEncryption: boolean;
    setDocumentEncryption: (value: boolean) => void;
    passwordExpiry: string;
    setPasswordExpiry: (value: string) => void;
  };
  onSave: () => void;
  isLoading: boolean;
}

export const SecuritySettings = ({ settings, onSave, isLoading }: SecuritySettingsProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Authentication</CardTitle>
          </div>
          <CardDescription>
            Configure your account security and authentication preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </div>
            <Switch
              checked={settings.twoFactorEnabled}
              onCheckedChange={settings.setTwoFactorEnabled}
            />
          </div>

          <div className="space-y-2">
            <Label>Session Timeout</Label>
            <CardDescription className="mb-2">
              Automatically log out after a period of inactivity
            </CardDescription>
            <Select
              value={settings.sessionTimeout}
              onValueChange={settings.setSessionTimeout}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeout duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle>Access Control</CardTitle>
          </div>
          <CardDescription>
            Manage IP restrictions and access settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>IP Whitelisting</Label>
              <CardDescription>
                Restrict access to specific IP addresses
              </CardDescription>
            </div>
            <Switch
              checked={settings.ipWhitelisting}
              onCheckedChange={settings.setIpWhitelisting}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Login Notifications</Label>
              <CardDescription>
                Receive alerts for new login attempts
              </CardDescription>
            </div>
            <Switch
              checked={settings.loginNotifications}
              onCheckedChange={settings.setLoginNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Password Policy</CardTitle>
          </div>
          <CardDescription>
            Configure password expiration and security policies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Password Expiry</Label>
            <CardDescription className="mb-2">
              Require password changes after a specific period
            </CardDescription>
            <Select
              value={settings.passwordExpiry}
              onValueChange={settings.setPasswordExpiry}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select expiry period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
