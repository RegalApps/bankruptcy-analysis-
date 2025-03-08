
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, UserCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                className="flex items-center justify-between p-2 bg-muted/50 hover:bg-accent/50 rounded-md text-sm group cursor-pointer"
                onClick={() => onClientSelect(client.id)}
              >
                <div className="flex items-center gap-2 truncate">
                  <UserCircle className="h-5 w-5 text-primary/70 shrink-0" />
                  <span className="truncate font-medium">{client.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">View</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
