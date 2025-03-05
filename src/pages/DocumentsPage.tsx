
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showPerformanceToast } from "@/utils/performance";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FolderTree } from "lucide-react";
import { EnhancedFolderTab } from "@/components/folders/enhanced/EnhancedFolderTab";

export const DocumentsPage = () => {
  const { documents, refetch, isLoading } = useDocuments();
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [selectedItemType, setSelectedItemType] = useState<"folder" | "file" | undefined>();
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

  // Find selected item title
  const selectedItem = documents?.find(doc => doc.id === selectedItemId);

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
              {selectedItem && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>{selectedItem.title}</BreadcrumbLink>
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
