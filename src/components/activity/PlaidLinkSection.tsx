
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Add Plaid types
declare global {
  interface Window {
    Plaid: {
      create: (config: any) => Promise<{
        open: () => void;
        exit: () => void;
      }>;
    };
  }
}

export const PlaidLinkSection = () => {
  const [isLinking, setIsLinking] = useState(false);

  const initializePlaidLink = useCallback(async () => {
    setIsLinking(true);
    try {
      const { data, error } = await supabase.functions.invoke('initialize-plaid-link', {
        body: { }
      });

      if (error) throw error;

      // Create Plaid Link instance and handle bank linking
      if (data?.link_token) {
        const handler = await window.Plaid.create({
          token: data.link_token,
          onSuccess: async (public_token: string) => {
            try {
              const { error } = await supabase.functions.invoke('exchange-plaid-token', {
                body: { public_token }
              });
              
              if (error) throw error;

              toast.success("Bank account linked successfully!");
            } catch (error) {
              console.error("Error exchanging token:", error);
              toast.error("Failed to link bank account. Please try again.");
            }
          },
          onExit: () => {
            setIsLinking(false);
          },
        });
        handler.open();
      }
    } catch (error) {
      console.error("Error initializing Plaid:", error);
      toast.error("Failed to initialize bank linking. Please try again.");
      setIsLinking(false);
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Link Bank Account
        </CardTitle>
        <CardDescription>
          Connect your bank account to automatically import transactions and improve expense tracking.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={initializePlaidLink}
          disabled={isLinking}
          className="w-full"
        >
          {isLinking ? "Connecting..." : "Connect Bank Account"}
        </Button>
      </CardContent>
    </Card>
  );
};
