
import { UserCircle } from "lucide-react";

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
            className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-sm cursor-pointer text-sm"
            onClick={() => onClientSelect(client.id)}
          >
            <UserCircle className="h-4 w-4 text-primary/70" />
            <span className="truncate">{client.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
