import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { Monitor, Moon, Sun, Globe2, Save, Loader2, Coins } from "lucide-react";

interface GeneralSettingsProps {
  settings: {
    language: string;
    setLanguage: (value: string) => void;
    timeZone: string;
    setTimeZone: (value: string) => void;
    autoSave: boolean;
    setAutoSave: (value: boolean) => void;
    documentSync: boolean;
    setDocumentSync: (value: boolean) => void;
    defaultCurrency: string;
    setDefaultCurrency: (value: string) => void;
  };
  onSave: () => void;
  isLoading: boolean;
}

export const GeneralSettings = ({ settings, onSave, isLoading }: GeneralSettingsProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">General Settings</h2>
        <p className="text-muted-foreground">
          Manage your application preferences and appearance
        </p>
      </div>

      <Card className="border-2 hover:border-primary/20 transition-colors duration-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Appearance</CardTitle>
              <CardDescription className="mt-1.5">
                Customize how SecureFiles AI looks on your device
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              className="w-full h-24 flex flex-col gap-2 hover:bg-primary/10 transition-colors"
              onClick={() => setTheme('light')}
            >
              <Sun className="h-6 w-6" />
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              className="w-full h-24 flex flex-col gap-2 hover:bg-primary/10 transition-colors"
              onClick={() => setTheme('dark')}
            >
              <Moon className="h-6 w-6" />
              Dark
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              className="w-full h-24 flex flex-col gap-2 hover:bg-primary/10 transition-colors"
              onClick={() => setTheme('system')}
            >
              <Monitor className="h-6 w-6" />
              System
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 hover:border-primary/20 transition-colors duration-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Language & Region</CardTitle>
              <CardDescription className="mt-1.5">
                Set your preferred language, timezone, and currency
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Language</Label>
              <Select value={settings.language} onValueChange={settings.setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Timezone</Label>
              <Select value={settings.timeZone} onValueChange={settings.setTimeZone}>
                <SelectTrigger>
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
              <Label className="text-sm font-medium">Currency</Label>
              <Select value={settings.defaultCurrency} onValueChange={settings.setDefaultCurrency}>
                <SelectTrigger>
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
        </CardContent>
      </Card>

      <Card className="border-2 hover:border-primary/20 transition-colors duration-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Save className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Document Settings</CardTitle>
              <CardDescription className="mt-1.5">
                Configure document handling preferences
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <Label className="text-base">Auto-Save Documents</Label>
              <CardDescription>
                Automatically save documents while editing
              </CardDescription>
            </div>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={settings.setAutoSave}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-t">
            <div className="space-y-0.5">
              <Label className="text-base">Document Sync</Label>
              <CardDescription>
                Keep documents in sync across devices
              </CardDescription>
            </div>
            <Switch
              checked={settings.documentSync}
              onCheckedChange={settings.setDocumentSync}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={onSave} 
          disabled={isLoading} 
          size="lg"
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
