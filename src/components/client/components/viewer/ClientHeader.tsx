
import { ArrowLeft, User, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Client } from "../../types";
import { Badge } from "@/components/ui/badge";

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
            <div className="flex items-center">
              <h2 className="text-lg font-semibold">
                {client ? client.name : 'Client Viewer'}
              </h2>
              <Badge 
                variant={client.status === 'active' ? "default" : "secondary"} 
                className="ml-2"
              >
                {client.status === 'active' ? 'Active Client' : 'Inactive Client'}
              </Badge>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              {client.email && (
                <div className="flex items-center mr-4">
                  <Mail className="h-3 w-3 mr-1" />
                  <span>{client.email}</span>
                </div>
              )}
              
              {client.phone && (
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  <span>{client.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="hidden sm:flex items-center space-x-2">
        <Button variant="outline" size="sm" className="text-xs">
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          Schedule Meeting
        </Button>
        <Button variant="default" size="sm" className="text-xs">
          Contact Client
        </Button>
      </div>
    </div>
  );
};
