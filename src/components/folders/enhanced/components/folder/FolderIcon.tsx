
import { Folder, FolderOpen, FileText, Users, Hash, FileCheck } from "lucide-react";

interface FolderIconProps {
  type: string;
  isExpanded: boolean;
}

export const FolderIcon = ({ type, isExpanded }: FolderIconProps) => {
  switch (type) {
    case 'client':
      return isExpanded ? 
        <Users className="h-4 w-4 text-blue-500 mr-2" /> : 
        <Users className="h-4 w-4 text-muted-foreground mr-2" />;
    case 'estate':
      return isExpanded ? 
        <Hash className="h-4 w-4 text-purple-500 mr-2" /> : 
        <Hash className="h-4 w-4 text-muted-foreground mr-2" />;
    case 'form':
      return isExpanded ? 
        <FileCheck className="h-4 w-4 text-green-500 mr-2" /> : 
        <FileCheck className="h-4 w-4 text-muted-foreground mr-2" />;
    default:
      return isExpanded ? 
        <FolderOpen className="h-4 w-4 text-primary mr-2" /> : 
        <Folder className="h-4 w-4 text-muted-foreground mr-2" />;
  }
};
