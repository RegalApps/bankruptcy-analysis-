
import React, { useState, useEffect } from "react";
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { useNavigate } from "react-router-dom";
import { showPerformanceToast } from "@/utils/performance";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FolderTree, Lock, UnlockKeyhole } from "lucide-react";
import { EnhancedFolderTab } from "@/components/folders/enhanced/EnhancedFolderTab";
import { useCreateFolderStructure } from "@/components/folders/enhanced/hooks/useCreateFolderStructure";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const DocumentsPage = () => {
  const { documents, refetch, isLoading } = useDocuments();
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [selectedItemType, setSelectedItemType] = useState<"folder" | "file" | undefined>();
  const [folderPath, setFolderPath] = useState<{id: string, name: string}[]>([]);
  const [hasWriteAccess, setHasWriteAccess] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("viewer");
  const navigate = useNavigate();

  // Get folder structure for breadcrumb path
  const { folders } = useCreateFolderStructure(documents || []);

  // Check user's role and permissions
  useEffect(() => {
    const checkUserPermissions = async () => {
      try {
        // Get current user
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Error getting user:", error);
          setHasWriteAccess(false);
          return;
        }
        
        if (!user) {
          setHasWriteAccess(false);
          return;
        }
        
        // For this implementation, we'll default to having write access
        // In a real app, you would check against user roles in your database
        setHasWriteAccess(true);
        setUserRole("admin"); // Default to admin for demonstration
      } catch (error) {
        console.error("Error checking permissions:", error);
        setHasWriteAccess(false);
      }
    };
    
    checkUserPermissions();
  }, []);

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

  // Toggle user access
  const toggleAccess = () => {
    setHasWriteAccess(!hasWriteAccess);
    
    // In a real application, you would update the user's role in your database
    if (hasWriteAccess) {
      setUserRole("viewer");
      toast.info("Switched to view-only mode");
    } else {
      setUserRole("admin");
      toast.success("Switched to edit mode");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {/* User Access Controls */}
          <div className="mb-4 flex items-center justify-between">
            <Breadcrumb>
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
            
            <div className="flex items-center gap-2">
              {hasWriteAccess ? (
                <UnlockKeyhole className="h-4 w-4 text-green-500" />
              ) : (
                <Lock className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-sm mr-2">
                {hasWriteAccess ? "Edit Mode" : "View-Only Mode"}
              </span>
              <Switch 
                checked={hasWriteAccess}
                onCheckedChange={toggleAccess}
              />
            </div>
          </div>
          
          {!hasWriteAccess && (
            <Alert className="mb-4">
              <AlertTitle>View-Only Mode</AlertTitle>
              <AlertDescription>
                You are currently in view-only mode. Switch to edit mode to create, delete, or merge folders.
              </AlertDescription>
            </Alert>
          )}
          
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
