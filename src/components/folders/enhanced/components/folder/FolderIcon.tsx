
import { Folder, FolderOpen, FileText, Users } from "lucide-react";

interface FolderIconProps {
  type: string;
  isExpanded: boolean;
}

export const FolderIcon = ({ type, isExpanded }: FolderIconProps) => {
  if (type === 'client') {
    return isExpanded ? 
      <Users className="h-4 w-4 text-blue-500 mr-2" /> : 
      <Users className="h-4 w-4 text-muted-foreground mr-2" />;
  } else if (type === 'form') {
    return isExpanded ? 
      <FileText className="h-4 w-4 text-green-500 mr-2" /> : 
      <FileText className="h-4 w-4 text-muted-foreground mr-2" />;
  } else {
    return isExpanded ? 
      <FolderOpen className="h-4 w-4 text-primary mr-2" /> : 
      <Folder className="h-4 w-4 text-muted-foreground mr-2" />;
  }
};
