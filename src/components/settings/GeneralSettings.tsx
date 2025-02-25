
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface GeneralSettingsProps {
  settings: {
    timeZone: string;
    setTimeZone: (value: string) => void;
    language: string;
    setLanguage: (value: string) => void;
    autoSave: boolean;
    setAutoSave: (value: boolean) => void;
    compactView: boolean;
    setCompactView: (value: boolean) => void;
    documentSync: boolean;
    setDocumentSync: (value: boolean) => void;
    defaultCurrency: string;
    setDefaultCurrency: (value: string) => void;
  };
  onSave: () => void;
  isLoading: boolean;
}

export const GeneralSettings = ({ settings, onSave, isLoading }: GeneralSettingsProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-6">General Settings</h2>
          
          {/* Regional Settings */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-muted-foreground">Regional Preferences</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select value={settings.timeZone} onValueChange={settings.setTimeZone}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="CST">Central Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={settings.language} onValueChange={settings.setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select value={settings.defaultCurrency} onValueChange={settings.setDefaultCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Application Preferences */}
          <div className="mt-8 space-y-6">
            <h3 className="text-sm font-medium text-muted-foreground">Application Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autosave">Auto-save Documents</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save documents while editing
                  </p>
                </div>
                <Switch
                  id="autosave"
                  checked={settings.autoSave}
                  onCheckedChange={settings.setAutoSave}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compact">Compact View</Label>
                  <p className="text-sm text-muted-foreground">
                    Use condensed spacing in document lists
                  </p>
                </div>
                <Switch
                  id="compact"
                  checked={settings.compactView}
                  onCheckedChange={settings.setCompactView}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sync">Document Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep documents synchronized across devices
                  </p>
                </div>
                <Switch
                  id="sync"
                  checked={settings.documentSync}
                  onCheckedChange={settings.setDocumentSync}
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
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
