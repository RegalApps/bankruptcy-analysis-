import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntegrationsSection } from "@/components/crm/integrations/IntegrationsSection";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const SettingsPage = () => {
  const [timeZone, setTimeZone] = useState("UTC");
  const [language, setLanguage] = useState("en");
  const [autoSave, setAutoSave] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [documentSync, setDocumentSync] = useState(true);
  const [defaultCurrency, setDefaultCurrency] = useState("CAD");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your application settings and integrations
              </p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
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
                            <Select value={timeZone} onValueChange={setTimeZone}>
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
                            <Select value={language} onValueChange={setLanguage}>
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
                            <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
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
                              checked={autoSave}
                              onCheckedChange={setAutoSave}
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
                              checked={compactView}
                              onCheckedChange={setCompactView}
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
                              checked={documentSync}
                              onCheckedChange={setDocumentSync}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="mt-8 flex justify-end">
                        <Button>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="integrations">
                <IntegrationsSection />
              </TabsContent>

              <TabsContent value="security">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
                  {/* Security settings content will go here */}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
