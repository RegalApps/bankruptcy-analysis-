
import React, { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useDocumentPageState } from "./DocumentViewer/hooks/useDocumentPageState";
import { useForm31Handler } from "./DocumentViewer/hooks/useForm31Handler";
import { ViewerContent } from "./DocumentViewer/components/ViewerContent";
import { BackNavigation } from "./DocumentViewer/components/BackNavigation";
import NotFoundPage from "./NotFound";

const DocumentViewerPage = () => {
  const {
    documentId,
    isLoading,
    documentNotFound,
    isForm47,
    isGreenTechForm31
  } = useDocumentPageState();

  // Process Form31 data if needed
  useForm31Handler(documentId || "", isForm47);
  
  // If document not found and not a special document type, show 404
  if (documentNotFound && !isForm47 && !isGreenTechForm31) {
    return <NotFoundPage />;
  }
  
  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <BackNavigation />
        
        <div className="flex-1 h-[calc(100vh-8rem)]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <ViewerContent
              documentId={documentId || ""}
              isForm47={isForm47}
              isGreenTechForm31={isGreenTechForm31}
              documentTitle={isForm47 ? "Form 47 - Consumer Proposal" : undefined}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default DocumentViewerPage;
