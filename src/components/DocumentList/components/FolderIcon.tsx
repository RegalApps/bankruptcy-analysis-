
import { cn } from "@/lib/utils";
import { Folder } from "lucide-react";

interface FolderIconProps {
  color?: string;
  isActive?: boolean;
  className?: string;
  variant?: "client" | "form" | "archive" | "uncategorized";
}

export const FolderIcon = ({ 
  color, 
  isActive, 
  className,
  variant = "client" 
}: FolderIconProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "client":
        return "text-blue-500 bg-blue-500/10";
      case "form":
        return "text-green-500 bg-green-500/10";
      case "archive":
        return "text-gray-500 bg-gray-500/10";
      case "uncategorized":
        return "text-yellow-500 bg-yellow-500/10";
      default:
        return "text-primary bg-primary/10";
    }
  };

  return (
    <div
      className={cn(
        "p-2 rounded-md transition-all duration-200",
        "group-hover:scale-105 group-hover:shadow-sm",
        isActive && "scale-105 shadow-sm",
        getVariantStyles(),
        className
      )}
      style={color ? {
        backgroundColor: `${color}10`,
        color: color
      } : undefined}
    >
      <Folder className="h-6 w-6" />
    </div>
  );
};
