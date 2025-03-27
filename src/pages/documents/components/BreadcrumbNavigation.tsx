
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Document } from "@/components/DocumentList/types";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbNavigationProps {
  folderPath: { id: string; name: string }[];
  selectedItemId?: string;
  selectedItemType?: "folder" | "file";
  onFolderClick: (id: string) => void;
  documents: Document[];
}

export const BreadcrumbNavigation = ({
  folderPath,
  selectedItemId,
  selectedItemType,
  onFolderClick,
  documents
}: BreadcrumbNavigationProps) => {
  // Get the current document or folder name
  const getCurrentItemName = () => {
    if (!selectedItemId) return null;
    
    const selectedItem = documents.find(doc => doc.id === selectedItemId);
    if (!selectedItem) return null;
    
    return selectedItem.title || (selectedItemType === 'folder' ? 'Unnamed Folder' : 'Unnamed Document');
  };
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#" onClick={() => onFolderClick('')}>
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {folderPath.map((folder, index) => (
          <React.Fragment key={folder.id}>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink 
                href="#" 
                onClick={() => onFolderClick(folder.id)}
              >
                {folder.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
        
        {selectedItemId && selectedItemType === 'file' && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <span className="text-muted-foreground">
                {getCurrentItemName()}
              </span>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
