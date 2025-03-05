
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showPerformanceToast } from "@/utils/performance";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FolderTree } from "lucide-react";
import { EnhancedFolderTab } from "@/components/folders/enhanced/EnhancedFolderTab";
import { useCreateFolderStructure } from "@/components/folders/enhanced/hooks/useCreateFolderStructure";

export const DocumentsPage = () => {
  const { documents, refetch, isLoading } = useDocuments();
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [selectedItemType, setSelectedItemType] = useState<"folder" | "file" | undefined>();
  const [folderPath, setFolderPath] = useState<{id: string, name: string}[]>([]);
  const navigate = useNavigate();

  // Get folder structure for breadcrumb path
  const { folders } = useCreateFolderStructure(documents || []);

  useEffect(() => {
    // Measure and show performance metrics when the page loads
    showPerformanceToast("Documents Page");
  }, []);

  useEffect(() => {
    // Update folder path when selected item changes
    if (selectedItemId && folders.length > 0) {
      // Find selected item
      const selectedItem = documents?.find(doc => doc.id === selectedItemId);
      
      if (selectedItem) {
        if (selectedItem.is_folder) {
          // Build path for folder
          buildFolderPath(selectedItemId);
        } else if (selectedItem.parent_folder_id) {
          // Build path for document's parent folder
          buildFolderPath(selectedItem.parent_folder_id);
        } else {
          // Reset path if no parent folder
          setFolderPath([]);
        }
      }
    } else {
      // Reset path if no selected item
      setFolderPath([]);
    }
  }, [selectedItemId, folders, documents]);

  // Build folder path array by traversing folder hierarchy
  const buildFolderPath = (folderId: string) => {
    const path: {id: string, name: string}[] = [];
    let currentFolderId = folderId;
    
    // Add current folder
    const currentFolder = documents?.find(doc => doc.id === currentFolderId);
    if (currentFolder) {
      path.unshift({ id: currentFolder.id, name: currentFolder.title });
    }
    
    // Traverse up the folder hierarchy
    while (currentFolder?.parent_folder_id) {
      const parentFolder = documents?.find(doc => doc.id === currentFolder.parent_folder_id);
      if (parentFolder) {
        path.unshift({ id: parentFolder.id, name: parentFolder.title });
        currentFolderId = parentFolder.id;
      } else {
        break;
      }
    }
    
    setFolderPath(path);
  };

  const handleItemSelect = (id: string, type: "folder" | "file") => {
    setSelectedItemId(id);
    setSelectedItemType(type);
  };

  const handleOpenDocument = (documentId: string) => {
    // Navigate to the home page with the selected document ID in the state
    navigate('/', { state: { selectedDocument: documentId } });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Navigation breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/documents">
                  <FolderTree className="h-4 w-4 mr-1" />
                  Documents
                </BreadcrumbLink>
              </BreadcrumbItem>
              
              {folderPath.map((folder, index) => (
                <React.Fragment key={folder.id}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      onClick={() => handleItemSelect(folder.id, "folder")}
                      className="cursor-pointer"
                    >
                      {folder.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
              
              {selectedItemId && selectedItemType === "file" && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      {documents?.find(doc => doc.id === selectedItemId)?.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          
          <EnhancedFolderTab 
            documents={documents ?? []}
            onDocumentOpen={handleOpenDocument}
            onRefresh={refetch}
          />
        </main>
      </div>
    </div>
  );
};
