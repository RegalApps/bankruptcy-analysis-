
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Client } from "../../types";

interface ClientHeaderProps {
  client: Client;
  onBack: () => void;
}

export const ClientHeader = ({ client, onBack }: ClientHeaderProps) => {
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
          {client ? `Client: ${client.name}` : 'Client Viewer'}
        </h2>
      </div>
    </div>
  );
};
