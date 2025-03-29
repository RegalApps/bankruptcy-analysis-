
import React, { useState } from "react";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { showPerformanceToast } from "@/utils/performance";
import { EnhancedFolderTab } from "@/components/folders/enhanced/EnhancedFolderTab";
import { BreadcrumbNavigation } from "./documents/components/BreadcrumbNavigation";
import { useDocumentsPage } from "./documents/hooks/useDocumentsPage";
import { useNavigate } from "react-router-dom";

const DocumentsPage = () => {
  const {
    documents,
    refetch,
    isLoading,
    selectedItemId,
    selectedItemType,
    folderPath,
    handleItemSelect,
    handleOpenDocument,
    clients,
    handleClientSelect
  } = useDocumentsPage();
  
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Measure and show performance metrics when the page loads
    showPerformanceToast("Documents Page");
  }, []);

  const handleClientViewerAccess = (clientId: string) => {
    navigate(`/client-viewer/${clientId}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Navigation */}
          <div className="mb-4">
            <BreadcrumbNavigation 
              folderPath={folderPath}
              selectedItemId={selectedItemId}
              selectedItemType={selectedItemType}
              onFolderClick={(id) => handleItemSelect(id, "folder")}
              documents={documents}
            />
          </div>
          
          {/* Main Content / Document Tree */}
          <div className="border rounded-lg bg-card">
            {selectedClientId ? (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">
                  Redirecting to client viewer...
                </p>
              </div>
            ) : (
              <EnhancedFolderTab 
                documents={documents ?? []}
                onDocumentOpen={handleOpenDocument}
                onRefresh={refetch}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentsPage;
