
import { Eye, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientSectionProps {
  clients: { id: string; name: string }[];
  onClientSelect: (clientId: string) => void;
}

export const ClientSection = ({ clients, onClientSelect }: ClientSectionProps) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <UserCircle className="h-4 w-4 mr-1.5" />
        Clients
      </h3>
      <div className="space-y-1 pl-2">
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-sm text-sm group cursor-pointer"
            onClick={() => onClientSelect(client.id)}
          >
            <div className="flex items-center gap-2 truncate">
              <UserCircle className="h-4 w-4 text-primary/70 shrink-0" />
              <span className="truncate">{client.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">View</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
