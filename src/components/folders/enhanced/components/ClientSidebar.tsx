
import { ClientSection } from "./ClientSection";

interface ClientSidebarProps {
  clients: { id: string; name: string }[];
  onClientSelect: (clientId: string) => void;
  onClientViewerAccess: (clientId: string) => void;
  selectedClientId?: string;
}

export const ClientSidebar = ({
  clients,
  onClientSelect,
  onClientViewerAccess,
  selectedClientId
}: ClientSidebarProps) => {
  if (clients.length === 0) return null;
  
  return (
    <ClientSection 
      clients={clients} 
      onClientSelect={onClientSelect}
      onClientViewerAccess={onClientViewerAccess}
      selectedClientId={selectedClientId}
    />
  );
};
