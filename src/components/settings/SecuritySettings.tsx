
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
    <Card className="p-6">
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-6">Security Settings</h2>

          {/* Authentication Security */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-muted-foreground">Authentication</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="2fa">Two-Factor Authentication (2FA)</Label>
                  <p className="text-sm text-muted-foreground">
                    Require a verification code in addition to your password
                  </p>
                </div>
                <Switch
                  id="2fa"
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={settings.setTwoFactorEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="loginNotifications">Login Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for new login attempts
                  </p>
                </div>
                <Switch
                  id="loginNotifications"
                  checked={settings.loginNotifications}
                  onCheckedChange={settings.setLoginNotifications}
                />
              </div>
            </div>
          </div>

          {/* Session Security */}
          <div className="mt-8 space-y-6">
            <h3 className="text-sm font-medium text-muted-foreground">Session Management</h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Select value={settings.sessionTimeout} onValueChange={settings.setSessionTimeout}>
                    <SelectTrigger id="sessionTimeout">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Select value={settings.passwordExpiry} onValueChange={settings.setPasswordExpiry}>
                    <SelectTrigger id="passwordExpiry">
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
              </div>
            </div>
          </div>

          {/* Document Security */}
          <div className="mt-8 space-y-6">
            <h3 className="text-sm font-medium text-muted-foreground">Document Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="encryption">Document Encryption</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable end-to-end encryption for sensitive documents
                  </p>
                </div>
                <Switch
                  id="encryption"
                  checked={settings.documentEncryption}
                  onCheckedChange={settings.setDocumentEncryption}
                />
              </div>
            </div>
          </div>

          {/* Access Control */}
          <div className="mt-8 space-y-6">
            <h3 className="text-sm font-medium text-muted-foreground">Access Control</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ipWhitelist">IP Whitelisting</Label>
                  <p className="text-sm text-muted-foreground">
                    Restrict access to specific IP addresses
                  </p>
                </div>
                <Switch
                  id="ipWhitelist"
                  checked={settings.ipWhitelisting}
                  onCheckedChange={settings.setIpWhitelisting}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={onSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Security Settings"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
