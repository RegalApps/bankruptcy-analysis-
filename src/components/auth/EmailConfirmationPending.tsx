
import { Mail, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface EmailConfirmationPendingProps {
  confirmationEmail: string | null;
  onSignOut: () => void;
}

export const EmailConfirmationPending = ({ 
  confirmationEmail, 
  onSignOut 
}: EmailConfirmationPendingProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResendConfirmation = async () => {
    if (!confirmationEmail) return;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: confirmationEmail,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Confirmation Email Sent",
        description: `A new confirmation email has been sent to ${confirmationEmail}`,
      });
    } catch (error: any) {
      console.error("Error resending confirmation email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to resend confirmation email",
      });
    }
  };

  return (
    <div className="min-h-screen h-screen w-full bg-background flex items-center justify-center">
      <div className="text-center p-6 max-w-md border rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <Mail className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Confirm Your Email</h2>
        <p className="text-muted-foreground mb-6">
          We've sent a confirmation link to <strong>{confirmationEmail}</strong>. 
          Please check your email and click the link to activate your account.
        </p>
        
        <Alert className="mb-6 bg-muted">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You need to confirm your email before you can use all features of the application.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <Button onClick={handleResendConfirmation} variant="outline" className="w-full">
            Resend Confirmation Email
          </Button>
          <Button 
            onClick={onSignOut}
            variant="secondary"
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
