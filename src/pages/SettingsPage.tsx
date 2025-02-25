
import { useState } from "react";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { KeyRound } from "lucide-react";

export const SettingsPage = () => {
  const { toast } = useToast();
  const [plaidClientId, setPlaidClientId] = useState("");
  const [plaidSecret, setPlaidSecret] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePlaidConfig = async () => {
    if (!plaidClientId || !plaidSecret) {
      toast({
        title: "Validation Error",
        description: "Please provide both Plaid Client ID and Secret",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.functions.invoke('update-plaid-config', {
        body: {
          clientId: plaidClientId,
          secret: plaidSecret,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Plaid API configuration has been saved successfully",
      });

      // Clear the form
      setPlaidClientId("");
      setPlaidSecret("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Plaid configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold">Settings</h1>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5" />
                  Plaid API Configuration
                </CardTitle>
                <CardDescription>
                  Configure your Plaid API credentials for bank account integration.
                  You can find these in your Plaid Dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Plaid Client ID</Label>
                  <Input
                    id="clientId"
                    type="password"
                    value={plaidClientId}
                    onChange={(e) => setPlaidClientId(e.target.value)}
                    placeholder="Enter your Plaid Client ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secret">Plaid Secret</Label>
                  <Input
                    id="secret"
                    type="password"
                    value={plaidSecret}
                    onChange={(e) => setPlaidSecret(e.target.value)}
                    placeholder="Enter your Plaid Secret"
                  />
                </div>
                <Button
                  onClick={handleSavePlaidConfig}
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? "Saving..." : "Save Plaid Configuration"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};
