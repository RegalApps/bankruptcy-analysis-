
// Create the file if it doesn't exist already or add to it

import { DocumentDetails } from "../types";

// Helper function to generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Create a demo Form 47 Consumer Proposal document
export const createForm47DemoDocument = (userId?: string): DocumentDetails => {
  return {
    id: "demo-form47",
    title: "Form 47 - Consumer Proposal",
    type: "application/pdf",
    storage_path: "demo/form47-consumer-proposal.pdf",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: userId || "demo-user",
    size: 250000,
    metadata: {
      formType: "form-47",
      formNumber: "47",
      clientName: "John Smith",
      uploadDate: new Date().toISOString(),
      documentStatus: "Needs Review"
    },
    deadlines: [
      {
        id: generateId(),
        title: "Consumer Proposal Filing Deadline",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Deadline to file the Consumer Proposal",
        severity: "high"
      }
    ],
    analysis: [
      {
        id: generateId(),
        content: {
          extracted_info: {
            clientName: "John Smith",
            administratorName: "Jane Doe, LIT",
            filingDate: new Date().toISOString().split('T')[0],
            submissionDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            documentStatus: "Needs Review",
            formNumber: "47",
            formType: "form-47",
            summary: "Consumer Proposal with missing payment schedule"
          },
          risks: [
            {
              id: "risk-1",
              type: "Missing Payment Schedule",
              description: "Payment schedule for unsecured creditors is not provided",
              severity: "high",
              regulation: "BIA Section 66.12(6)(b)",
              impact: "Proposal will be invalid under BIA Sec. 66.12(6)(b)",
              requiredAction: "Add a structured payment plan for unsecured creditors",
              solution: "Create detailed payment schedule for unsecured creditors",
              deadline: "Immediately",
              position: {
                x: 150,
                y: 420,
                width: 300,
                height: 50,
                page: 2
              }
            },
            {
              id: "risk-2",
              type: "Missing Administrator Certificate",
              description: "The proposal requires a signed certificate from the administrator",
              severity: "high",
              regulation: "BIA Rules 66(2)",
              impact: "Proposal cannot be filed without this certificate",
              requiredAction: "Obtain administrator certificate",
              solution: "Have the Licensed Insolvency Trustee complete and sign the certificate section",
              deadline: "5 days",
              position: {
                x: 100,
                y: 520,
                width: 400,
                height: 60,
                page: 3
              }
            },
            {
              id: "risk-3",
              type: "Payment Schedule Incomplete",
              description: "The payment schedule lacks specific repayment terms",
              severity: "medium",
              regulation: "BIA Section 66.14",
              impact: "May lead to implementation issues during proposal execution",
              requiredAction: "Complete payment schedule details",
              solution: "Specify payment amounts, frequency, and start/end dates",
              deadline: "3 days"
            }
          ],
          regulatory_compliance: {
            status: "non_compliant",
            details: "The consumer proposal is missing required components including a detailed payment schedule and the administrator's certificate.",
            references: ["BIA Section 66.12(6)(b)", "BIA Rules 66(2)", "BIA Section 66.14"]
          }
        }
      }
    ]
  };
};

// Create a demo Form 31 Proof of Claim document for GreenTech
export const createForm31DemoDocument = (userId?: string): DocumentDetails => {
  return {
    id: "demo-form31-greentech",
    title: "Form 31 - GreenTech Proof of Claim",
    type: "application/pdf",
    storage_path: "demo/greentech-form31-proof-of-claim.pdf",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: userId || "demo-user",
    size: 180000,
    metadata: {
      formType: "form-31",
      formNumber: "31",
      clientName: "GreenTech Supplies Inc.",
      uploadDate: new Date().toISOString(),
      documentStatus: "Needs Review"
    },
    deadlines: [
      {
        id: generateId(),
        title: "Proof of Claim Filing Deadline",
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Deadline to file the Proof of Claim",
        severity: "high"
      }
    ],
    analysis: [
      {
        id: generateId(),
        content: {
          extracted_info: {
            clientName: "GreenTech Supplies Inc.",
            creditorName: "GreenTech Supplies Inc.",
            creditorMailingAddress: "123 Tech Boulevard, Suite 450, San Francisco, CA 94103",
            contactPersonName: "Sarah Johnson, Claims Manager",
            contactTelephone: "(415) 555-7890",
            debtorName: "EcoBuilders Construction Ltd.",
            debtorCity: "Toronto",
            debtorProvince: "Ontario",
            debtAmount: "$125,450.00",
            executionDate: "2025-03-15",
            documentStatus: "Needs Review",
            formNumber: "31",
            formType: "form-31",
            summary: "Proof of Claim with missing relationship disclosure"
          },
          risks: [
            {
              id: "risk-1",
              type: "Missing Claim Category Selection",
              description: "No claim category checkbox is selected",
              severity: "high",
              regulation: "BIA Section 124(1)",
              impact: "Claim cannot be properly classified without category selection",
              requiredAction: "Select appropriate claim category",
              solution: "Check the appropriate box in section 3 of the form",
              deadline: "Immediately",
              position: {
                x: 120,
                y: 380,
                width: 350,
                height: 40,
                page: 1
              }
            },
            {
              id: "risk-2",
              type: "Missing Related Party Declaration",
              description: "Declaration of related party status is not completed",
              severity: "high",
              regulation: "BIA Section 4(2)",
              impact: "Potential conflict of interest not disclosed",
              requiredAction: "Complete related party declaration",
              solution: "Check appropriate box in section 4 of the form",
              deadline: "Immediately",
              position: {
                x: 150,
                y: 520,
                width: 320,
                height: 35,
                page: 2
              }
            },
            {
              id: "risk-3",
              type: "Date Format Error",
              description: "Dates not in YYYY-MM-DD format as required",
              severity: "medium",
              regulation: "BIA Form Guidelines",
              impact: "May cause processing delays",
              requiredAction: "Correct date format",
              solution: "Update all dates to YYYY-MM-DD format",
              deadline: "3 days",
              position: {
                x: 350,
                y: 250,
                width: 120,
                height: 30,
                page: 1
              }
            },
            {
              id: "risk-4",
              type: "Missing Transfers at Undervalue Disclosure",
              description: "No disclosure of transfers at undervalue in the past year",
              severity: "high",
              regulation: "BIA Section 96",
              impact: "Potential avoidance of transfer not disclosed",
              requiredAction: "Complete transfers at undervalue disclosure",
              solution: "Check appropriate box in section 5 and provide details if applicable",
              deadline: "Immediately",
              position: {
                x: 130,
                y: 580,
                width: 340,
                height: 35,
                page: 2
              }
            }
          ],
          regulatory_compliance: {
            status: "non_compliant",
            details: "The proof of claim form is missing required selections and disclosures including claim category selection and related party disclosure.",
            references: ["BIA Section 124(1)", "BIA Section 4(2)", "BIA Form Guidelines", "BIA Section 96"]
          },
          structureValid: true,
          requiredFieldsPresent: false,
          signaturesValid: true
        }
      }
    ]
  };
};
