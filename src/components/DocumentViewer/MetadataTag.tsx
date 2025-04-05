
import React from "react";
import { Badge } from "@/components/ui/badge";
import { FileCheck } from "lucide-react";

interface MetadataTagProps {
  label: string;
  variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning";
  icon?: React.ReactNode;
}

export const MetadataTag: React.FC<MetadataTagProps> = ({
  label,
  variant = "default",
  icon = <FileCheck className="h-3 w-3 mr-1" />
}) => {
  return (
    <Badge 
      variant={variant} 
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium"
    >
      {icon}
      {label}
    </Badge>
  );
};
