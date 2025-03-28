
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientErrorStateProps {
  onBack: () => void;
  error?: Error;
  message?: string;
}

export const ClientErrorState = ({ onBack, error, message }: ClientErrorStateProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="text-destructive">
        <XCircle className="h-16 w-16 mx-auto mb-4" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Unable to load client data</h2>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        {message || error?.message || "There was an error loading the client information. Please try again."}
      </p>
      <Button onClick={onBack}>
        Go Back
      </Button>
    </div>
  );
};
