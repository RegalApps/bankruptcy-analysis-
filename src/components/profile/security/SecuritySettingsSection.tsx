
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, Smartphone, RefreshCw, Lock } from "lucide-react";
import { useState } from "react";

export const SecuritySettingsSection = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [deviceManagement, setDeviceManagement] = useState(true);

  return (
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
      </CardContent>
    </Card>
  );
};
