
import { useState } from "react";
import { User, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  
  const handleOpenViewer = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewerAccess(client.id);
    
    // Add visual feedback
    toast.info(`Opening ${client.name}'s profile`, {
      description: "Loading client information and documents",
      duration: 2000
    });
  };
  
  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer relative transition-colors",
        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/30"
      )}
      onClick={() => onSelect(client.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-2 overflow-hidden">
        <div className={cn(
          "rounded-full p-1.5 flex-shrink-0",
          isSelected ? "bg-primary/20" : "bg-muted"
        )}>
          <User className="h-3.5 w-3.5 opacity-70" />
        </div>
        <span className="text-sm font-medium truncate">{client.name}</span>
      </div>
      
      {(isHovered || isSelected) && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleOpenViewer}
          title={`Open ${client.name}'s details`}
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};
