
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
  if (clients.length === 0) {
    return <div className="w-56 border-r bg-background/95 shrink-0 flex items-center justify-center p-4">
      <p className="text-sm text-muted-foreground">No clients available</p>
    </div>;
  }
  
  return (
    <ClientSection 
      clients={clients} 
      onClientSelect={onClientSelect}
      onClientViewerAccess={onClientViewerAccess}
      selectedClientId={selectedClientId}
      className="h-full border-r bg-background/95 w-56 shrink-0"
    />
  );
};
