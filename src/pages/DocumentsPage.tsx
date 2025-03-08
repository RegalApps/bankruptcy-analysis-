
import React, { useEffect } from "react";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { showPerformanceToast } from "@/utils/performance";
import { EnhancedFolderTab } from "@/components/folders/enhanced/EnhancedFolderTab";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDocumentsPage } from "./documents/hooks/useDocumentsPage";
import { BreadcrumbNavigation } from "./documents/components/BreadcrumbNavigation";
import { AccessModeToggle } from "./documents/components/AccessModeToggle";

export const DocumentsPage = () => {
  const {
    documents,
    refetch,
    isLoading,
    selectedItemId,
    selectedItemType,
    folderPath,
    hasWriteAccess,
    handleItemSelect,
    handleOpenDocument,
    toggleAccess,
    handleClientSelect
  } = useDocumentsPage();

  useEffect(() => {
    // Measure and show performance metrics when the page loads
    showPerformanceToast("Documents Page");
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {/* User Access Controls */}
          <div className="mb-4 flex items-center justify-between">
            <BreadcrumbNavigation 
              folderPath={folderPath}
              selectedItemId={selectedItemId}
              selectedItemType={selectedItemType}
              onFolderClick={(id) => handleItemSelect(id, "folder")}
              documents={documents}
            />
            
            <AccessModeToggle
              hasWriteAccess={hasWriteAccess}
              onToggle={toggleAccess}
            />
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

// Add default export
export default DocumentsPage;
