
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { FolderManagement } from "@/components/folders/FolderManagement";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showPerformanceToast } from "@/utils/performance";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { AlertCircle, FolderTree, Info, MessageSquareText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FolderNavigationBreadcrumb } from "@/components/folders/components/FolderNavigationBreadcrumb";
import { RecentDocuments } from "@/components/folders/components/RecentDocuments";

export const DocumentsPage = () => {
  const { documents, isLoading, error, refetch } = useDocuments();
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [selectedItemType, setSelectedItemType] = useState<"folder" | "file" | undefined>();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Measure and show performance metrics when the page loads
    showPerformanceToast("Documents Page");
  }, []);

  const handleItemSelect = (id: string, type: "folder" | "file") => {
    setSelectedItemId(id);
    setSelectedItemType(type);
  };

  const handleOpenDocument = (documentId: string) => {
    // Navigate to the home page with the selected document ID in the state
    navigate('/', { state: { selectedDocument: documentId } });
  };

  const handleFolderNavigate = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    if (folderId) {
      setSelectedItemId(folderId);
      setSelectedItemType("folder");
    } else {
      setSelectedItemId(undefined);
      setSelectedItemType(undefined);
    }
  };

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <MainSidebar />
        <div className="flex-1 flex flex-col pl-64">
          <MainHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error loading documents. Please try again later.
              </AlertDescription>
            </Alert>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Document Management</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => refetch()}
                className="text-sm text-primary hover:underline flex items-center"
              >
                <MessageSquareText className="h-4 w-4 mr-1" />
                Get help organizing documents
              </button>
            </div>
          </div>
          
          {/* Document navigation */}
          <FolderNavigationBreadcrumb 
            documents={documents || []}
            currentFolderId={currentFolderId}
            onNavigate={handleFolderNavigate}
          />
          
          {/* Recent documents section */}
          {!currentFolderId && (
            <RecentDocuments 
              documents={documents || []}
              onOpenDocument={handleOpenDocument}
            />
          )}
          
          {/* Main folder management component */}
          <FolderManagement 
            documents={documents || []} 
            selectedItemId={selectedItemId}
            selectedItemType={selectedItemType}
            onItemSelect={handleItemSelect}
            onRefresh={refetch}
            onOpenDocument={handleOpenDocument}
            currentFolderId={currentFolderId}
            onFolderNavigate={handleFolderNavigate}
          />
        </main>
      </div>
    </div>
  );
};
