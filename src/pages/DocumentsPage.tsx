
import React, { useState } from "react";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { showPerformanceToast } from "@/utils/performance";
import { EnhancedFolderTab } from "@/components/folders/enhanced/EnhancedFolderTab";
import { BreadcrumbNavigation } from "./documents/components/BreadcrumbNavigation";
import { useDocumentsPage } from "./documents/hooks/useDocumentsPage";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ClientSection } from "@/components/folders/enhanced/components/ClientSection";

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

  const handleClientClick = (clientId: string) => {
    // Navigate to client viewer page with the selected client
    navigate(`/client-viewer/${clientId}`);
  };
  
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
          
          <div className="grid grid-cols-12 gap-4 h-[calc(100vh-12rem)]">
            {/* Enhanced Client Section Panel */}
            <div className="col-span-3 border rounded-lg bg-card overflow-hidden">
              <ClientSection
                clients={clients} 
                onClientSelect={handleClientClick}
                onClientViewerAccess={handleClientViewerAccess}
                selectedClientId={selectedClientId || ""}
                className=""
              />
            </div>
            
            {/* Main Content / Document Tree */}
            <div className="col-span-9 border rounded-lg bg-card">
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentsPage;
