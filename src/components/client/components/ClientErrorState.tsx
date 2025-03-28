
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientErrorStateProps {
  onBack: () => void;
  error?: Error;
  message?: string;
}

export const ClientErrorState = ({ onBack, error, message }: ClientErrorStateProps) => {
  const errorMessage = message || error?.message || "There was a problem loading the client information";
  
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="bg-destructive/10 rounded-full p-3 mb-4">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h2 className="text-xl font-medium mb-2">Client Data Error</h2>
      <p className="text-center text-muted-foreground mb-6 max-w-md">
        {errorMessage}
      </p>
      <Button onClick={onBack} className="flex items-center">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Documents
      </Button>
    </div>
  );
};
