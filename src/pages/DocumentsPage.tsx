
import React, { useState } from "react";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { showPerformanceToast } from "@/utils/performance";
import { EnhancedFolderTab } from "@/components/folders/enhanced/EnhancedFolderTab";
import { BreadcrumbNavigation } from "./documents/components/BreadcrumbNavigation";
import { useDocumentsPage } from "./documents/hooks/useDocumentsPage";

const DocumentsPage = () => {
  const {
    documents,
    refetch,
    isLoading,
    selectedItemId,
    selectedItemType,
    folderPath,
    handleItemSelect,
    handleOpenDocument
  } = useDocumentsPage();

  React.useEffect(() => {
    // Measure and show performance metrics when the page loads
    showPerformanceToast("Documents Page");
  }, []);

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
            <EnhancedFolderTab 
              documents={documents ?? []}
              onDocumentOpen={handleOpenDocument}
              onRefresh={refetch}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentsPage;
