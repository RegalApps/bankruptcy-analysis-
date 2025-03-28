
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Client } from "../../types";

interface ClientHeaderProps {
  client: Client;
  onBack: () => void;
}

export const ClientHeader = ({ client, onBack }: ClientHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2 p-0 h-8 w-8"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{client.name}</h2>
        {client.status && (
          <div className="ml-3 px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
            {client.status}
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        {/* Add action buttons here if needed */}
      </div>
    </div>
  );
};
