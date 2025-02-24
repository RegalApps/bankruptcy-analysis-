
import { cn } from "@/lib/utils";
import { Folder, FolderOpen } from "lucide-react";
import { useState } from "react";

interface FolderIconProps {
  color?: string;
  isActive?: boolean;
  className?: string;
  variant?: "client" | "form" | "archive" | "uncategorized";
  isOpen?: boolean;
}

export const FolderIcon = ({ 
  color, 
  isActive, 
  className,
  variant = "client",
  isOpen = false
}: FolderIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case "client":
        return "from-blue-500 to-blue-600 text-blue-50";
      case "form":
        return "from-green-500 to-green-600 text-green-50";
      case "archive":
        return "from-gray-500 to-gray-600 text-gray-50";
      case "uncategorized":
        return "from-yellow-500 to-yellow-600 text-yellow-50";
      default:
        return "from-primary to-primary/80 text-primary-foreground";
    }
  };

  const Icon = isOpen ? FolderOpen : Folder;

  return (
    <div
      className={cn(
        "relative p-3 rounded-xl transition-all duration-200",
        "bg-gradient-to-br shadow-lg",
        "hover:shadow-xl hover:scale-105",
        isActive && "scale-105 ring-2 ring-primary/20",
        getVariantStyles(),
        className
      )}
      style={color ? {
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
      } : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon 
        className={cn(
          "h-6 w-6 transition-transform duration-200",
          isHovered && "transform rotate-2"
        )} 
      />
      {isHovered && (
        <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent animate-pulse" />
      )}
    </div>
  );
};
