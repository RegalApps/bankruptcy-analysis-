
import { Analysis, Risk, DocumentDetails, Deadline } from "../types";

// Form 47 demo document
export const createForm47DemoDocument = (documentId: string): DocumentDetails => {
  return {
    id: documentId,
    title: "Form 47 - Consumer Proposal",
    storage_path: "demo/form47-consumer-proposal.pdf",
    created_at: new Date().toISOString(),
    user_id: "1",
    updated_at: new Date().toISOString(),
    parent_folder_id: null, // Changed from folder_id to parent_folder_id
    file_type: "application/pdf",
    file_size: 1024 * 1024 * 2, // 2MB
    is_public: false,
    is_favorite: false,
    labels: ["form47", "consumer-proposal"],
    status: "active",
    metadata: {
      formType: "form-47",
      formNumber: "47",
      processing_complete: true,
      client_name: "John Smith"
    },
    deadlines: [
      {
        id: "1",
        title: "Submission Deadline",
        description: "Submit the consumer proposal by this date",
        due_date: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),  // 14 days from now
        status: "pending",
        priority: "high",
        created_at: new Date().toISOString(),
        type: "submission"
      }
    ],
    version: 1
  };
};

// Form 47 demo analysis
export const createForm47DemoAnalysis = (documentId: string): Analysis => {
  return {
    id: "analysis-" + documentId,
    created_at: new Date().toISOString(),
    content: {
      extracted_info: {
        clientName: "John Smith",
        administratorName: "Jane Adams, LIT",
        filingDate: new Date().toISOString().split("T")[0],
        submissionDeadline: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        documentStatus: "Draft",
        formNumber: "47",
        formType: "form-47",
        summary: "Consumer Proposal - Needs Review"
      },
      risks: [
        {
          id: "risk-1",
          type: "Missing Payment Schedule",
          description: "Payment schedule details are incomplete",
          severity: "high",
          regulation: "BIA Section 66.12(6)(b)",
          impact: "Proposal may be rejected by the Official Receiver",
          requiredAction: "Add detailed payment schedule",
          solution: "Complete the payment schedule section with monthly payment amounts and timeline",
          position: {
            x: 0.2,
            y: 0.3,
            width: 0.6,
            height: 0.1,
            page: 1
          }
        },
        {
          id: "risk-2",
          type: "Missing Administrator Certificate",
          description: "The administrator's certificate is not properly completed",
          severity: "medium",
          regulation: "BIA Rules 66(2)",
          impact: "May delay the acceptance of the proposal",
          requiredAction: "Complete and sign administrator certificate",
          solution: "Ensure the Licensed Insolvency Trustee completes the certificate section",
          position: {
            x: 0.1,
            y: 0.7,
            width: 0.4,
            height: 0.15,
            page: 2
          }
        }
      ],
      regulatory_compliance: {
        status: "non_compliant",
        details: "The document is missing critical required elements.",
        references: ["BIA Section 66.12(6)(b)", "BIA Rules 66(2)"]
      }
    }
  };
};

// Form 31 demo document
export const createForm31DemoDocument = (documentId: string): DocumentDetails => {
  return {
    id: documentId,
    title: "Form 31 - GreenTech Proof of Claim",
    storage_path: "demo/greentech-form31-proof-of-claim.pdf",
    created_at: new Date().toISOString(),
    user_id: "1",
    updated_at: new Date().toISOString(),
    parent_folder_id: null, // Changed from folder_id to parent_folder_id
    file_type: "application/pdf",
    file_size: 1024 * 1024 * 1.5, // 1.5MB
    is_public: false,
    is_favorite: false,
    labels: ["form31", "proof-of-claim", "greentech"],
    status: "active",
    metadata: {
      formType: "form-31",
      formNumber: "31",
      processing_complete: true,
      client_name: "GreenTech Supplies Inc."
    },
    deadlines: [
      {
        id: "1",
        title: "Documentation Deadline",
        description: "Submit all supporting documentation by this date",
        due_date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        status: "pending", 
        priority: "medium",
        created_at: new Date().toISOString(),
        type: "documentation"
      }
    ],
    version: 1
  };
};

// Form 31 demo analysis
export const createForm31DemoAnalysis = (documentId: string): Analysis => {
  return {
    id: "analysis-" + documentId,
    created_at: new Date().toISOString(),
    content: {
      extracted_info: {
        clientName: "GreenTech Supplies Inc.",
        creditorName: "GreenTech Supplies Inc.",
        creditorEmail: "claims@greentechsupplies.com",
        debtorName: "EcoBuilders Construction Ltd.",
        debtorCity: "Toronto",
        debtorProvince: "Ontario",
        debtAmount: "$125,450.00",
        executionDate: "2025-03-15",
        documentStatus: "Needs Review",
        formNumber: "31",
        formType: "form-31",
        summary: "Proof of Claim - High Value"
      },
      risks: [
        {
          id: "risk-1",
          type: "Missing Claim Category",
          description: "No claim category selected in the form",
          severity: "high",
          regulation: "BIA Regulations s.19",
          impact: "Claim may be rejected or improperly categorized",
          requiredAction: "Select appropriate claim category",
          solution: "Check the applicable box for claim category (unsecured, preferred, secured, etc.)",
          position: {
            x: 0.3,
            y: 0.4,
            width: 0.4,
            height: 0.1,
            page: 1
          }
        },
        {
          id: "risk-2",
          type: "Missing Supporting Documentation",
          description: "No supporting documentation attached for high value claim",
          severity: "high",
          regulation: "BIA s.124(1)(b)",
          impact: "Claim may be disputed or rejected by trustee",
          requiredAction: "Provide supporting documentation",
          solution: "Attach Schedule A with itemized evidence of claim",
          position: {
            x: 0.1,
            y: 0.6,
            width: 0.7,
            height: 0.08,
            page: 1
          }
        },
        {
          id: "risk-3", 
          type: "Date Format Error",
          description: "Date format inconsistent with requirements",
          severity: "medium",
          regulation: "Form 31 Instructions",
          impact: "May cause processing delays",
          requiredAction: "Use correct date format",
          solution: "Use YYYY-MM-DD format for all dates",
          position: {
            x: 0.5,
            y: 0.8,
            width: 0.3,
            height: 0.05,
            page: 2
          }
        }
      ],
      regulatory_compliance: {
        status: "non_compliant",
        details: "This document is missing required elements and has formatting issues.",
        references: ["BIA s.124(1)(b)", "BIA Regulations s.19", "Form 31 Instructions"]
      }
    }
  };
};
