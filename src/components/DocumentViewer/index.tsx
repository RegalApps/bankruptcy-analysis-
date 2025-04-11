
import React, { useState, useEffect, useCallback } from "react";
import { ViewerLayout } from "./layout/ViewerLayout";
import { DocumentPreview } from "./DocumentPreview";
import { RiskAssessment } from "./RiskAssessment";
import { Form31RiskView } from "./RiskAssessment/Form31RiskView";
import { CollaborationPanel } from "./CollaborationPanel";
import { DocumentDetails } from "./DocumentDetails";
import { Risk } from "./RiskAssessment/types";
import { toast } from "sonner";
import { useGreenTechForm31Risks } from "./hooks/useGreenTechForm31Risks";

interface DocumentViewerProps {
  documentId: string;
  documentTitle?: string;
  isForm47?: boolean;
  isForm31GreenTech?: boolean;
  onLoadFailure?: (errorMessage?: string) => void;
  bypassProcessing?: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentId,
  documentTitle = "Document",
  isForm47 = false,
  isForm31GreenTech = false,
  onLoadFailure,
  bypassProcessing = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeRiskId, setActiveRiskId] = useState<string | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  
  // Get GreenTech Form 31 risks if applicable
  const greenTechRisks = useGreenTechForm31Risks();
  const risks = isForm31GreenTech ? greenTechRisks : [];

  // Simulate loading document
  useEffect(() => {
    const loadDocument = async () => {
      try {
        setIsLoading(true);
        
        if (isForm47) {
          // Use sample Form 47
          setDocumentUrl("/documents/sample-form47.pdf");
        } else if (isForm31GreenTech) {
          // Use sample Form 31
          setDocumentUrl("/documents/sample-form31-greentech.pdf");
        } else {
          // Generic document handling
          setDocumentUrl("/documents/sample-document.pdf");
        }
        
        setIsLoading(false);
      } catch (error: any) {
        console.error("Error loading document:", error);
        toast.error("Failed to load document");
        if (onLoadFailure) onLoadFailure("Document failed to load");
        setIsLoading(false);
      }
    };
    
    loadDocument();
  }, [documentId, isForm47, isForm31GreenTech, onLoadFailure]);

  // Handle risk selection
  const handleRiskSelect = useCallback((riskId: string | null) => {
    console.log("Selected risk:", riskId);
    setActiveRiskId(riskId);
  }, []);

  // Create all the required content components for the viewer layout
  const mainContent = (
    <DocumentPreview
      storagePath={documentUrl || ""}
      documentId={documentId}
      title={documentTitle || ""}
      previewState={{
        fileExists: !!documentUrl,
        fileUrl: documentUrl,
        isPdfFile: () => true,
        isExcelFile: () => false,
        isDocFile: () => false,
        isLoading,
        previewError: null,
        setPreviewError: () => {},
        checkFile: async () => {},
        documentRisks: risks
      }}
      activeRiskId={activeRiskId}
      onRiskSelect={handleRiskSelect}
    />
  );

  const sidebar = (
    <DocumentDetails
      clientName="Sample Client"
      documentId={documentId}
      formNumber={isForm47 ? "47" : isForm31GreenTech ? "31" : ""}
      formType={isForm47 ? "Consumer Proposal" : isForm31GreenTech ? "Proof of Claim" : "General Document"}
      dateSigned="2025-01-15"
      estateNumber={isForm47 ? "EST-12345" : isForm31GreenTech ? "EST-54321" : ""}
      summary="This document represents a formal submission related to the bankruptcy process."
    />
  );

  const collaborationPanel = (
    <CollaborationPanel
      documentId={documentId}
      activeRiskId={activeRiskId}
      onRiskSelect={handleRiskSelect}
    />
  );

  const taskPanel = (
    <div className="p-4">
      <h3 className="font-medium text-sm mb-2">Document Tasks</h3>
      <p className="text-xs text-muted-foreground">
        Tasks related to this document will appear here.
      </p>
    </div>
  );

  const versionPanel = (
    <div className="p-4">
      <h3 className="font-medium text-sm mb-2">Document History</h3>
      <p className="text-xs text-muted-foreground">
        Version history for this document will appear here.
      </p>
    </div>
  );

  return (
    <ViewerLayout
      isForm47={isForm47}
      sidebar={sidebar}
      mainContent={mainContent}
      collaborationPanel={collaborationPanel}
      taskPanel={taskPanel}
      versionPanel={versionPanel}
      documentTitle={documentTitle}
      documentType={isForm47 ? "Consumer Proposal" : isForm31GreenTech ? "Proof of Claim" : "Document"}
    />
  );
};
