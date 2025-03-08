
import { User, Mail, Phone, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status?: string;
  last_interaction?: string;
  engagement_score?: number;
}

interface ClientInfoPanelProps {
  client: Client;
  documentCount: number;
  lastActivityDate?: string;
}

export const ClientInfoPanel = ({ client, documentCount, lastActivityDate }: ClientInfoPanelProps) => {
  return (
    <div className="p-4 h-full border-r">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-full">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{client.name}</h2>
          <div className={`px-2 py-0.5 text-xs inline-block rounded-full ${
            client.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {client.status || 'Unknown Status'}
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        {client.email && (
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{client.phone}</span>
          </div>
        )}
        {client.last_interaction && (
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Last Contact: {new Date(client.last_interaction).toLocaleDateString()}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Client Summary</h3>
        <Card className="bg-muted/50">
          <CardContent className="p-3">
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Total Documents:</span> {documentCount}
              </p>
              <p>
                <span className="font-medium">Last Activity:</span> {
                  lastActivityDate
                    ? new Date(lastActivityDate).toLocaleDateString()
                    : 'No recent activity'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
