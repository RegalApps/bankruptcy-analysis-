
import { Mail, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Client } from "../../../types/client";

interface ClientInfoCardProps {
  client: Client;
}

export const ClientInfoCard = ({ client }: ClientInfoCardProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{client.name}</h3>
          <div className={`px-2 py-1 rounded-full text-sm ${
            client.status === 'active' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {client.status}
          </div>
        </div>

        <div className="space-y-2">
          {client.email && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="h-4 w-4 mr-2" />
              {client.email}
            </div>
          )}
          {client.phone && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="h-4 w-4 mr-2" />
              {client.phone}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
