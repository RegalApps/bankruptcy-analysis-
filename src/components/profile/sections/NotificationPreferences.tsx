
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export const NotificationPreferences = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    activityDigest: true,
    documentUpdates: true,
    meetingReminders: true,
    securityAlerts: true,
  });

  const handleChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    toast.success("Notification preferences saved successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates about your activity
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pushNotifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your devices
              </p>
            </div>
            <Switch
              id="pushNotifications"
              checked={notifications.pushNotifications}
              onCheckedChange={(checked) => handleChange("pushNotifications", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="activityDigest">Weekly Activity Digest</Label>
              <p className="text-sm text-muted-foreground">
                Receive a weekly summary of your activity
              </p>
            </div>
            <Switch
              id="activityDigest"
              checked={notifications.activityDigest}
              onCheckedChange={(checked) => handleChange("activityDigest", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="documentUpdates">Document Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when documents are updated
              </p>
            </div>
            <Switch
              id="documentUpdates"
              checked={notifications.documentUpdates}
              onCheckedChange={(checked) => handleChange("documentUpdates", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="meetingReminders">Meeting Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive reminders before scheduled meetings
              </p>
            </div>
            <Switch
              id="meetingReminders"
              checked={notifications.meetingReminders}
              onCheckedChange={(checked) => handleChange("meetingReminders", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="securityAlerts">Security Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about security-related events
              </p>
            </div>
            <Switch
              id="securityAlerts"
              checked={notifications.securityAlerts}
              onCheckedChange={(checked) => handleChange("securityAlerts", checked)}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Notification Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
};
