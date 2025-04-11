
import React, { useState, useEffect, useCallback } from "react";
import { ViewerLayout } from "./layout/ViewerLayout";
import { DocumentPreview } from "./DocumentPreview";
import { RiskAssessment } from "./RiskAssessment";
import { Form31RiskView } from "./RiskAssessment/Form31RiskView";
import { CollaborationPanel } from "./CollaborationPanel";
import { DocumentDetails as DocumentDetailsComponent } from "./DocumentDetails";
import { DocumentAnalysis } from "./DocumentAnalysis";
import { DocumentSummary } from "./DocumentDetails/DocumentSummary";
import { Risk } from "./RiskAssessment/types";
import { toast } from "sonner";
import { useGreenTechForm31Risks } from "./hooks/useGreenTechForm31Risks";
import { useDocumentViewer } from "./useDocumentViewer";
import { Sidebar } from "./Sidebar";

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
  
  // Fetch document details using the hook
  const { document, loading } = useDocumentViewer(documentId);

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

  // Get document analysis content
  const analysisContent = document?.analysis?.[0]?.content;
  const extractedInfo = analysisContent?.extracted_info;
  const documentRisks = analysisContent?.risks || risks;

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
        documentRisks: documentRisks
      }}
      activeRiskId={activeRiskId}
      onRiskSelect={handleRiskSelect}
    />
  );

  // Client details component for the right panel
  const clientDetails = (
    <DocumentDetailsComponent
      clientName={extractedInfo?.clientName || (isForm31GreenTech ? "GreenTech Supplies Inc." : "Sample Client")}
      documentId={documentId}
      trusteeName={extractedInfo?.trusteeName || (isForm31GreenTech ? "Neil Armstrong" : "")}
      administratorName={extractedInfo?.administratorName}
      formNumber={isForm47 ? "47" : isForm31GreenTech ? "31" : extractedInfo?.formNumber || ""}
      formType={isForm47 ? "Consumer Proposal" : isForm31GreenTech ? "Proof of Claim" : extractedInfo?.formType || "General Document"}
      dateSigned={extractedInfo?.dateSigned || (isForm31GreenTech ? "April 8, 2025" : "2025-01-15")}
      estateNumber={isForm47 ? "EST-12345" : isForm31GreenTech ? "EST-54321" : extractedInfo?.estateNumber || ""}
      filingDate={extractedInfo?.filingDate}
      submissionDeadline={extractedInfo?.submissionDeadline}
      documentStatus={extractedInfo?.documentStatus}
    />
  );

  // Document summary component for the right panel
  const documentSummary = (
    <DocumentSummary 
      summary={extractedInfo?.summary || (isForm31GreenTech ? 
        "This Form 31 (Proof of Claim) document is submitted by Neil Armstrong of ABC Restructuring Ltd. claiming $89,355.00 from GreenTech Supplies Inc. Several compliance issues have been identified including missing selections in claim categories and incomplete date formatting." : 
        "This document represents a formal submission related to the bankruptcy process.")}
      regulatoryCompliance={analysisContent?.regulatory_compliance ? {
        status: analysisContent.regulatory_compliance.status,
        details: analysisContent.regulatory_compliance.details,
        references: analysisContent.regulatory_compliance.references
      } : undefined}
    />
  );

  // Risk assessment component for the right panel  
  const riskAssessment = (
    isForm31GreenTech ? (
      <Form31RiskView 
        risks={documentRisks} 
        documentId={documentId}
        activeRiskId={activeRiskId} 
        onRiskSelect={handleRiskSelect} 
      />
    ) : (
      <RiskAssessment 
        risks={documentRisks} 
        documentId={documentId}
        activeRiskId={activeRiskId} 
        onRiskSelect={handleRiskSelect} 
      />
    )
  );

  const collaborationPanel = (
    <CollaborationPanel
      documentId={documentId}
      document={document}
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
        risks: documentRisks || [
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

  // Create the sidebar content for the right panel
  const sidebarContent = (
    document ? (
      <Sidebar 
        document={document} 
        onDeadlineUpdated={() => console.log("Deadline updated")} 
      />
    ) : (
      <div className="h-full flex flex-col space-y-4 p-4">
        {clientDetails}
        {documentSummary}
        {riskAssessment}
      </div>
    )
  );

  return (
    <ViewerLayout
      isForm47={isForm47}
      sidebar={sidebarContent}
      mainContent={mainContent}
      collaborationPanel={collaborationPanel}
      taskPanel={taskPanel}
      versionPanel={versionPanel}
      analysisPanel={analysisPanel}
      documentTitle={documentTitle}
      documentType={isForm47 ? "Consumer Proposal" : isForm31GreenTech ? "Proof of Claim" : "Document"}
      clientDetails={clientDetails}
      documentSummary={documentSummary}
      riskAssessment={riskAssessment}
    />
  );
};
