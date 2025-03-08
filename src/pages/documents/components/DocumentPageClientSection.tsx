
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle } from "lucide-react";

interface DocumentPageClientSectionProps {
  clients: { id: string; name: string }[];
  onClientSelect: (clientId: string) => void;
}

export const DocumentPageClientSection = ({
  clients,
  onClientSelect,
}: DocumentPageClientSectionProps) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <UserCircle className="h-4 w-4 mr-1.5" />
          Clients
        </h3>
        
        {clients.length === 0 ? (
          <div className="text-center py-2 bg-muted/30 rounded-md">
            <p className="text-sm text-muted-foreground">
              No clients available. Client information will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center p-2 bg-muted/50 hover:bg-accent/50 rounded-md text-sm cursor-pointer"
                onClick={() => onClientSelect(client.id)}
              >
                <UserCircle className="h-5 w-5 text-primary/70 shrink-0 mr-2" />
                <span className="truncate font-medium">{client.name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
