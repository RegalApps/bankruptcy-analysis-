
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import { Loader2 } from "lucide-react";

interface GeneralSettingsProps {
  settings: any;
  onSave: () => void;
  isLoading: boolean;
}

export const GeneralSettings = ({ settings, onSave, isLoading }: GeneralSettingsProps) => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how Secure Files AI looks on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <CardDescription>
                Switch between light and dark themes
              </CardDescription>
            </div>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <CardDescription>
            Choose your preferred language for the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={settings?.language === "en" ? "default" : "outline"}
              className="w-full"
              onClick={() => {
                if (settings) settings.language = "en";
              }}
            >
              English
            </Button>
            <Button
              variant={settings?.language === "fr" ? "default" : "outline"}
              className="w-full"
              onClick={() => {
                if (settings) settings.language = "fr";
              }}
            >
              French
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};
