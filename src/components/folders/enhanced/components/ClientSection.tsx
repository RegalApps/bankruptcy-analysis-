
import { UserCircle, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientSectionProps {
  clients: { id: string; name: string }[];
  onClientSelect: (clientId: string) => void;
  onClientViewerAccess: (clientId: string) => void;
  selectedClientId?: string;
}

export const ClientSection = ({ 
  clients, 
  onClientSelect, 
  onClientViewerAccess,
  selectedClientId
}: ClientSectionProps) => {
  return (
    <div className="h-full border-r bg-background/95 w-56 shrink-0">
      <h3 className="text-sm font-medium p-3 flex items-center border-b">
        <UserCircle className="h-4 w-4 mr-1.5" />
        Clients
      </h3>
      <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
        {clients.map((client) => (
          <div
            key={client.id}
            className={`p-2 border-b border-border/40 hover:bg-accent/20 text-sm cursor-pointer ${selectedClientId === client.id ? 'bg-accent/30' : ''}`}
          >
            <div 
              className="flex items-center justify-between"
              onClick={() => onClientSelect(client.id)}
            >
              <div className="flex items-center truncate">
                <UserCircle className="h-4 w-4 text-primary/70 shrink-0 mr-2" />
                <span className="truncate">{client.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full hover:bg-accent ml-1 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onClientViewerAccess(client.id);
                }}
                title="Access Client Viewer"
              >
                <FolderOpen className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
