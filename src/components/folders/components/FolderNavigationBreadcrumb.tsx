
import { Document } from "@/components/DocumentList/types";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, Folder, ChevronRight } from "lucide-react";

interface FolderNavigationBreadcrumbProps {
  documents: Document[];
  currentFolderId?: string | null;
  onNavigate: (folderId: string | null) => void;
}

export const FolderNavigationBreadcrumb = ({ 
  documents, 
  currentFolderId, 
  onNavigate 
}: FolderNavigationBreadcrumbProps) => {
  // Find the current folder
  const currentFolder = currentFolderId 
    ? documents.find(doc => doc.id === currentFolderId)
    : null;

  // Build the folder path
  const buildFolderPath = (): { id: string; title: string }[] => {
    const path: { id: string; title: string }[] = [];
    
    let folder = currentFolder;
    while (folder && folder.parent_folder_id) {
      path.unshift({ id: folder.id, title: folder.title });
      
      folder = documents.find(doc => doc.id === folder.parent_folder_id);
    }
    
    if (folder) {
      path.unshift({ id: folder.id, title: folder.title });
    }
    
    return path;
  };

  const folderPath = buildFolderPath();

  return (
    <Breadcrumb className="mb-4 pb-2 border-b border-border">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink 
            onClick={() => onNavigate(null)}
            className="cursor-pointer"
          >
            <Home className="h-4 w-4 mr-1" />
            All Documents
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {folderPath.map((folder, index) => (
          <div key={folder.id} className="flex items-center">
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={() => onNavigate(folder.id)}
                className="cursor-pointer flex items-center"
              >
                {index === folderPath.length - 1 ? (
                  <>
                    <Folder className="h-4 w-4 mr-1" />
                    <span className="font-medium">{folder.title}</span>
                  </>
                ) : (
                  folder.title
                )}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
