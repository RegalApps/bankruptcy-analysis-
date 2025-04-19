
import React, { useState, useEffect, useCallback } from "react";
import { DocumentPreview } from "./DocumentPreview";
import RiskAssessment from "./RiskAssessment";
import { Form31RiskView } from "./RiskAssessment/Form31RiskView";
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
      } catch (error) {
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

  return (
    <div className="flex h-full gap-4">
      <div className="flex-1 bg-card border rounded-lg overflow-hidden">
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
      </div>
      
      <div className="w-[350px] bg-card border rounded-lg overflow-hidden">
        {isForm31GreenTech ? (
          <Form31RiskView 
            documentId={documentId} 
            risks={risks}
            activeRiskId={activeRiskId}
            onRiskSelect={handleRiskSelect}
          />
        ) : (
          <RiskAssessment 
            documentId={documentId} 
            risks={risks}
            activeRiskId={activeRiskId}
            onRiskSelect={handleRiskSelect}
          />
        )}
      </div>
    </div>
  );
};
