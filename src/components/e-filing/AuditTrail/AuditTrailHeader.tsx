
import { useState } from "react";
import { ChevronDown, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Mock client data
const clients = [
  { id: 1, name: "Acme Corporation", avatar: "/placeholder.svg" },
  { id: 2, name: "Globex Industries", avatar: "/placeholder.svg" },
  { id: 3, name: "Oceanic Airlines", avatar: "/placeholder.svg" },
  { id: 4, name: "Stark Enterprises", avatar: "/placeholder.svg" },
  { id: 5, name: "Wayne Industries", avatar: "/placeholder.svg" },
];

interface AuditTrailHeaderProps {
  onClientChange: (clientId: number) => void;
}

export const AuditTrailHeader = ({ onClientChange }: AuditTrailHeaderProps) => {
  const [selectedClient, setSelectedClient] = useState(clients[0]);

  const handleClientSelect = (client: typeof clients[0]) => {
    setSelectedClient(client);
    onClientChange(client.id);
  };

  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">SecureFiles AI Audit Trail</h2>
        <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          Secure • Compliant • Immutable
        </span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent/20 transition-colors">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={selectedClient.avatar} alt={selectedClient.name} />
              <AvatarFallback><Users className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <span>{selectedClient.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          {clients.map((client) => (
            <DropdownMenuItem 
              key={client.id}
              onClick={() => handleClientSelect(client)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={client.avatar} alt={client.name} />
                <AvatarFallback><Users className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              <span>{client.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
