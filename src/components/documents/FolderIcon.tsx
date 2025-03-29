import { Folder, FileText, FolderOpen, Files, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

type FolderType = 'client' | 'estate' | 'form' | 'financials' | 'default';

interface FolderIconProps {
  type: FolderType;
  isExpanded?: boolean;
  className?: string;
  fileName?: string;
}

export const FolderIcon = ({ type, isExpanded = false, className, fileName }: FolderIconProps) => {
  // Determine file type from extension if this is a file
  const getFileIcon = () => {
    if (!fileName) return <FileText className={cn("h-4 w-4", className)} />;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') {
      return <FileText className={cn("h-4 w-4 text-red-500", className)} />;
    } else if (['xlsx', 'xls', 'csv'].includes(extension || '')) {
      return <FileSpreadsheet className={cn("h-4 w-4 text-green-600", className)} />;
    } else if (['doc', 'docx'].includes(extension || '')) {
      return <FileText className={cn("h-4 w-4 text-blue-500", className)} />;
    } else {
      return <FileText className={cn("h-4 w-4", className)} />;
    }
  };
  
  // If type is 'file', return a file icon based on the extension
  if (type === 'default' && fileName) {
    return getFileIcon();
  }
  
  // Otherwise return the appropriate folder icon
  switch (type) {
    case 'client':
      return isExpanded 
        ? <FolderOpen className={cn("h-4 w-4 text-blue-500", className)} />
        : <Folder className={cn("h-4 w-4 text-blue-500", className)} />;
    case 'estate':
      return isExpanded 
        ? <FolderOpen className={cn("h-4 w-4 text-purple-500", className)} />
        : <Folder className={cn("h-4 w-4 text-purple-500", className)} />;
    case 'form':
      return isExpanded 
        ? <FolderOpen className={cn("h-4 w-4 text-green-500", className)} />
        : <Folder className={cn("h-4 w-4 text-green-500", className)} />;
    case 'financials':
      return isExpanded 
        ? <FolderOpen className={cn("h-4 w-4 text-yellow-500", className)} />
        : <Folder className={cn("h-4 w-4 text-yellow-500", className)} />;
    default:
      return isExpanded 
        ? <FolderOpen className={cn("h-4 w-4", className)} />
        : <Folder className={cn("h-4 w-4", className)} />;
  }
};
