
import { UserCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientListItemProps {
  client: { id: string; name: string };
  isSelected: boolean;
  onSelect: (clientId: string) => void;
  onViewerAccess: (clientId: string) => void;
}

export const ClientListItem = ({
  client,
  isSelected,
  onSelect,
  onViewerAccess
}: ClientListItemProps) => {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 cursor-pointer group ${
        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted/50"
      }`}
      onClick={() => onSelect(client.id)}
    >
      <div className="flex items-center">
        <UserCircle className="h-4 w-4 mr-2 text-primary/70" />
        <span className="text-sm truncate">{client.name}</span>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onViewerAccess(client.id);
        }}
        title="Open client viewer"
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};
