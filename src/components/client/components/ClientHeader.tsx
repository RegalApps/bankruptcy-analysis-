
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientHeaderProps {
  onBack: () => void;
  clientName?: string;
}

export const ClientHeader = ({ onBack, clientName }: ClientHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-lg font-semibold">
          {clientName ? `Client: ${clientName}` : 'Client Viewer'}
        </h2>
      </div>
    </div>
  );
};
