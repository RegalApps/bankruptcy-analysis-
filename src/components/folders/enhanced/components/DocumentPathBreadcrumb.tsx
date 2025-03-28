
import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentPathBreadcrumbProps {
  folderPath: { id: string; name: string }[];
  onFolderClick?: (folderId: string) => void;
}

export const DocumentPathBreadcrumb: React.FC<DocumentPathBreadcrumbProps> = ({
  folderPath,
  onFolderClick
}) => {
  if (!folderPath || folderPath.length === 0) {
    return (
      <div className="flex items-center text-sm mb-4">
        <Button variant="ghost" size="sm" className="flex items-center p-0 h-6">
          <Home className="h-3.5 w-3.5 mr-1" />
          <span>Home</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-wrap text-sm mb-4">
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center p-0 h-6 mr-1"
        onClick={() => onFolderClick && onFolderClick('')}
      >
        <Home className="h-3.5 w-3.5 mr-1" />
        <span>Home</span>
      </Button>
      
      {folderPath.map((folder, index) => (
        <div key={folder.id} className="flex items-center">
          <ChevronRight className="h-3.5 w-3.5 mx-1 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            className="h-6 p-0"
            onClick={() => onFolderClick && onFolderClick(folder.id)}
          >
            {folder.name}
          </Button>
        </div>
      ))}
    </div>
  );
};
