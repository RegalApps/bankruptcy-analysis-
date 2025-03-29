
import { Folder, FolderOpen, FileText, Users, Hash, FileCheck } from "lucide-react";

interface FolderIconProps {
  type: string;
  isExpanded: boolean;
}

export const FolderIcon = ({ type, isExpanded }: FolderIconProps) => {
  switch (type) {
    case 'client':
      return isExpanded ? 
        <div className="flex items-center justify-center bg-blue-100 rounded-md p-0.5">
          <Users className="h-4 w-4 text-blue-600" />
        </div> : 
        <div className="flex items-center justify-center rounded-md p-0.5">
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>;
    case 'estate':
      return isExpanded ? 
        <div className="flex items-center justify-center bg-purple-100 rounded-md p-0.5">
          <Hash className="h-4 w-4 text-purple-600" />
        </div> : 
        <div className="flex items-center justify-center rounded-md p-0.5">
          <Hash className="h-4 w-4 text-muted-foreground" />
        </div>;
    case 'form':
      return isExpanded ? 
        <div className="flex items-center justify-center bg-green-100 rounded-md p-0.5">
          <FileCheck className="h-4 w-4 text-green-600" />
        </div> : 
        <div className="flex items-center justify-center rounded-md p-0.5">
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </div>;
    default:
      return isExpanded ? 
        <div className="flex items-center justify-center bg-gray-100 rounded-md p-0.5">
          <FolderOpen className="h-4 w-4 text-primary" />
        </div> : 
        <div className="flex items-center justify-center rounded-md p-0.5">
          <Folder className="h-4 w-4 text-muted-foreground" />
        </div>;
  }
};
