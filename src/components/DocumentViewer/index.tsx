
import React, { useState, useEffect, useCallback } from "react";
import { ViewerLayout } from "./layout/ViewerLayout";
import { DocumentPreview } from "./DocumentPreview";
import { RiskAssessment } from "./RiskAssessment";
import { Form31RiskView } from "./RiskAssessment/Form31RiskView";
import { CollaborationPanel } from "./CollaborationPanel";
import { DocumentDetails } from "./DocumentDetails";
import { DocumentAnalysis } from "./DocumentAnalysis";
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
  
  const analysisPanel = (
    <DocumentAnalysis 
      documentId={documentId} 
      initialData={isForm31GreenTech ? {
        documentType: "Form 31 - Proof of Claim",
        clientInformation: {
          name: "GreenTech Supplies Inc.",
          city: "Trenton, Ontario"
        },
        creditorInformation: {
          name: "Neil Armstrong",
          role: "Licensed Insolvency Trustee",
          firm: "ABC Restructuring Ltd.",
          address: "100 Bay Street, Suite 400, Toronto, Ontario, M5J 2N8",
          phone: "416-988-2442",
          email: "neil.armstrong@fallouttrusteelimited.com"
        },
        claimInformation: {
          type: "Unsecured",
          amount: "$89,355.00",
          basis: "Debt owed as of March 15, 2025"
        },
        documentDate: "April 8, 2025",
        risks: [
          {
            severity: "high",
            title: "Missing Checkbox Selections in Claim Category",
            description: "None of the checkboxes (Unsecured, Secured, Lessor, etc.) are checked, although $89,355 is listed.",
            regulation: "BIA Subsection 124(2)",
            impact: "This creates ambiguity about the nature of the claim.",
            solution: "Select the appropriate claim type checkbox (likely 'A. Unsecured Claim')."
          },
          {
            severity: "high",
            title: "Missing Confirmation of Relatedness Status",
            description: "The declaration of whether the creditor is related to the debtor is incomplete.",
            regulation: "BIA Section 4(1) and Section 95",
            impact: "Required for assessing transfers and preferences.",
            solution: "Clearly indicate 'I am not related' and 'have not dealt at non-arm's length' (if true)."
          },
          {
            severity: "high",
            title: "No Disclosure of Transfers or Payments",
            description: "Section 6 response field is empty.",
            regulation: "BIA Section 96(1)",
            impact: "Required to assess preferential payments or transfers at undervalue.",
            solution: "State 'None' if applicable or list any payments within the past 3–12 months."
          },
          {
            severity: "medium",
            title: "Incorrect or Incomplete Date Format",
            description: "\"Dated at 2025, this 8 day of 0.\" is invalid.",
            regulation: "BIA Form Regulations Rule 1",
            solution: "Correct to \"Dated at Toronto, this 8th day of April, 2025.\""
          },
          {
            severity: "low",
            title: "No Attached Schedule A",
            description: "Schedule 'A' showing breakdown of amount is not attached.",
            regulation: "BIA Subsection 124(2)",
            solution: "Attach a detailed account statement showing calculation of amount owing."
          }
        ]
      } : null}
    />
  );

  return (
    <ViewerLayout
      isForm47={isForm47}
      sidebar={sidebar}
      mainContent={mainContent}
      collaborationPanel={collaborationPanel}
      taskPanel={taskPanel}
      versionPanel={versionPanel}
      analysisPanel={analysisPanel}
      documentTitle={documentTitle}
      documentType={isForm47 ? "Consumer Proposal" : isForm31GreenTech ? "Proof of Claim" : "Document"}
    />
  );
};
