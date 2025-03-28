
import { useState } from "react";
import { User, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className={cn(
        "flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer relative",
        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
      )}
      onClick={() => onSelect(client.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-2 overflow-hidden">
        <User className="h-4 w-4 opacity-70 flex-shrink-0" />
        <span className="text-sm truncate">{client.name}</span>
      </div>
      
      {isHovered && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 absolute right-1"
          onClick={(e) => {
            e.stopPropagation();
            onViewerAccess(client.id);
          }}
          title="Open client details"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};
