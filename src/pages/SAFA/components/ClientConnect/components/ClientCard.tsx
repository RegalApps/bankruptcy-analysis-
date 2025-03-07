
import { Card } from "@/components/ui/card";
import { UserCircle, Mail, Phone, Calendar, ChevronRight } from "lucide-react";
import { Client } from "../../../types/client";

interface ClientCardProps {
  client: Client;
  onSelect: (client: Client) => void;
}

export const ClientCard = ({ client, onSelect }: ClientCardProps) => {
  return (
    <Card 
      key={client.id}
      className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
      onClick={() => onSelect(client)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <UserCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{client.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground space-x-4">
              {client.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {client.email}
                </div>
              )}
              {client.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {client.phone}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-medium">
              Engagement Score: {client.engagement_score.toFixed(1)}
            </div>
            {client.last_interaction && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(client.last_interaction).toLocaleDateString()}
              </div>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </Card>
  );
};
