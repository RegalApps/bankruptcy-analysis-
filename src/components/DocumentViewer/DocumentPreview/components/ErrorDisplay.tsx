
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry
}) => {
  const navigate = useNavigate();
  const [isAuthError, setIsAuthError] = React.useState(false);

  React.useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthError(!session && (
        error.toLowerCase().includes('session') ||
        error.toLowerCase().includes('login') ||
        error.toLowerCase().includes('authentication')
      ));
    };

    checkAuthStatus();
  }, [error]);

  const handleRetry = async () => {
    if (isAuthError) {
      // Redirect to auth page if it's an auth error
      navigate('/');
    } else {
      onRetry();
    }
  };

  return (
    <Alert className="mt-4" variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Analysis Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
      <Button 
        onClick={handleRetry} 
        className="mt-2" 
        variant="outline" 
        size="sm"
      >
        {isAuthError ? "Sign In Again" : "Try Analysis Again"}
      </Button>
    </Alert>
  );
};
