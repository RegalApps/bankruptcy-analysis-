
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { showPerformanceToast } from "@/utils/performance";
import { EnhancedFolderTab } from "@/components/folders/enhanced/EnhancedFolderTab";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDocumentsPage } from "./documents/hooks/useDocumentsPage";
import { BreadcrumbNavigation } from "./documents/components/BreadcrumbNavigation";
import { AccessModeToggle } from "./documents/components/AccessModeToggle";
import { activateDebugMode, isDebugMode, debugTiming } from "@/utils/debugMode";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import { toast } from "sonner";

const DocumentsPage = () => {
  const navigate = useNavigate();
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
    
    // Handle query parameters for debug mode
    const queryParams = new URLSearchParams(window.location.search);
    const debugMode = queryParams.get('debug');
    
    if (debugMode === 'form47') {
      // Activate debug mode for Form 47
      activateDebugMode({
        formType: 'Form 47 – Consumer Proposal',
        skipProcessing: true,
        viewMode: 'document-viewer',
        suppressRedirect: true
      });
      
      // Find a Form 47 document in the documents array
      const startTime = performance.now();
      const form47Doc = documents?.find(doc => 
        doc.type === 'form-47' || 
        doc.title?.toLowerCase().includes('form 47') ||
        doc.title?.toLowerCase().includes('consumer proposal')
      );
      
      if (form47Doc) {
        console.log("🛠️ DEBUG: Found Form 47 document:", form47Doc.id);
        
        // Use timeout to ensure UI is rendered before navigation
        setTimeout(() => {
          handleOpenDocument(form47Doc.id);
          debugTiming('form47-document-locate', performance.now() - startTime);
        }, 100);
      } else {
        console.error("🛠️ DEBUG: No Form 47 document found in available documents");
        toast.error("Debug mode failed: No Form 47 document found");
      }
    }
  }, [documents, handleOpenDocument]);

  const handleDebugButtonClick = () => {
    navigate('?debug=form47');
  };

  // Update the function to use "file" instead of "document" for type
  const updateHandleItemSelect = (id: string, type: "folder" | "file") => {
    // Convert "document" to "file" for consistency across the application
    const mappedType = type === "document" ? "file" : type;
    handleItemSelect(id, mappedType);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Debug Mode Button */}
          {process.env.NODE_ENV === 'development' && (
            <div className="flex justify-end mb-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDebugButtonClick}
                className="flex items-center text-xs"
              >
                <Bug className="h-3.5 w-3.5 mr-1" /> Debug Form 47
              </Button>
            </div>
          )}
          
          {/* User Access Controls */}
          <div className="mb-4 flex items-center justify-between">
            <BreadcrumbNavigation 
              folderPath={folderPath}
              selectedItemId={selectedItemId}
              selectedItemType={selectedItemType}
              onFolderClick={(id) => updateHandleItemSelect(id, "folder")}
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

export default DocumentsPage;
