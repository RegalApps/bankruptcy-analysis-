
import { User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
}

interface ClientListItemProps {
  client: Client;
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
      className={cn(
        "group px-2 py-1.5 mx-1 my-0.5 rounded-md hover:bg-accent/20 transition-colors",
        isSelected ? "bg-accent/30" : ""
      )}
    >
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => onSelect(client.id)}
      >
        <div className="flex items-center truncate">
          <User className="h-4 w-4 text-primary/70 shrink-0 mr-2" />
          <span className="truncate text-sm font-medium">{client.name}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 hover:bg-accent flex-shrink-0 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onViewerAccess(client.id);
          }}
          title="Open Client Viewer"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
