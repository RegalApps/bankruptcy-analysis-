
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Client } from "../../types";

interface ClientHeaderProps {
  client: Client;
  onBack: () => void;
}

export const ClientHeader = ({ client, onBack }: ClientHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-3"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex items-center">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {client ? client.name : 'Client Viewer'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {client.status === 'active' ? 'Active Client' : 'Inactive Client'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
