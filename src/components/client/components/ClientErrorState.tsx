
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";

interface ClientErrorStateProps {
  onBack: () => void;
  message?: string;
  error?: Error;
}

export const ClientErrorState = ({ onBack, message, error }: ClientErrorStateProps) => {
  const errorMessage = message || error?.message || "An error occurred while loading client data";
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <Button variant="ghost" onClick={onBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Client Loading Error</h3>
          <p className="text-muted-foreground mb-4">{errorMessage}</p>
          <Button variant="outline" onClick={onBack}>
            Return to Folders
          </Button>
        </div>
      </div>
    </div>
  );
};
