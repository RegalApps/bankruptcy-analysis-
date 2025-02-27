
import { Risk } from "./types.ts";

export async function analyzeRisks(documentText: string, documentType: string): Promise<Risk[]> {
  console.log('Analyzing risks for document type:', documentType);
  const risks: Risk[] = [];
  const lowerText = documentText.toLowerCase();

  // Check for missing key information based on document type
  if (documentType === 'bankruptcy') {
    if (!lowerText.includes('date of bankruptcy') && !lowerText.includes('bankruptcy date')) {
      risks.push({
        type: "Missing Bankruptcy Date",
        description: "The document does not clearly specify the date of bankruptcy.",
        severity: "high",
        regulation: "Bankruptcy and Insolvency Act, Section 43(1)",
        impact: "May affect the calculation of timelines and deadlines in the bankruptcy process.",
        requiredAction: "Add the date of bankruptcy to the document.",
        solution: "Include the bankruptcy date in a standard format (DD/MM/YYYY) in the appropriate section of the form. This is a mandatory field as per BIA requirements and affects all timeline calculations for the proceedings."
      });
    }

    if (!lowerText.includes('estate number') && !lowerText.includes('estate no')) {
      risks.push({
        type: "Missing Estate Number",
        description: "The estate number is not specified in the document.",
        severity: "medium",
        regulation: "Office of the Superintendent of Bankruptcy Canada (OSB) Directive 2R3",
        impact: "Makes it difficult to properly track and reference the case in the system.",
        requiredAction: "Obtain and include the OSB estate number.",
        solution: "Contact the Office of the Superintendent of Bankruptcy to obtain the estate number if not yet assigned. The estate number must be included on all subsequent filings and correspondence related to this bankruptcy."
      });
    }
  }

  if (documentType === 'proposal') {
    if (!lowerText.includes('meeting of creditors')) {
      risks.push({
        type: "Missing Creditors Meeting Information",
        description: "Details about the meeting of creditors are not included.",
        severity: "high",
        regulation: "Bankruptcy and Insolvency Act, Section 51(1)",
        impact: "Creditors may not be properly informed of their right to vote on the proposal.",
        requiredAction: "Include complete details about the meeting of creditors.",
        solution: "Add a section with the date, time, and location of the creditors meeting. Include instructions for remote participation if applicable. Ensure this information is prominently displayed in the document."
      });
    }
  }

  if (documentType === 'court') {
    if (!lowerText.includes('court number') && !lowerText.includes('court file no')) {
      risks.push({
        type: "Missing Court File Number",
        description: "The court file number is not specified in the document.",
        severity: "medium",
        regulation: "Federal Court Rules, Rule 63",
        impact: "May cause issues with court filing and tracking of the case.",
        requiredAction: "Obtain and include the court file number.",
        solution: "Contact the court registry to obtain the correct court file number. This number must be displayed prominently on the first page of the document in accordance with court filing requirements."
      });
    }
  }

  // Check for general regulatory compliance issues
  if (!lowerText.includes('licensed insolvency trustee') && !lowerText.includes('lit') &&
      documentType !== 'court') {
    risks.push({
      type: "Missing Licensed Insolvency Trustee Information",
      description: "The document does not clearly identify the Licensed Insolvency Trustee.",
      severity: "high",
      regulation: "Bankruptcy and Insolvency Act, Section 13.5",
      impact: "Non-compliance with regulatory requirements for trustee identification.",
      requiredAction: "Include complete Licensed Insolvency Trustee information.",
      solution: "Add the full name, license number, and contact information of the Licensed Insolvency Trustee. Ensure the LIT's signature is included in the appropriate section. This information must be verifiable through the OSB registry."
    });
  }

  if (!documentText.includes('signed') && !documentText.includes('signature') &&
      !documentText.includes('executed')) {
    risks.push({
      type: "Missing Signature Indication",
      description: "The document does not appear to have been properly signed or executed.",
      severity: "high",
      regulation: "Bankruptcy and Insolvency General Rules, Section 4",
      impact: "May render the document legally invalid or unenforceable.",
      requiredAction: "Ensure the document is properly signed by all required parties.",
      solution: "Obtain signatures from all required parties (debtor, trustee, witness as applicable). Electronic signatures must comply with electronic signature regulations. Document the date of each signature and maintain proper records of signed originals."
    });
  }

  // Check for privacy and confidentiality risks
  const sinPattern = /\b\d{3}[-\s]?\d{3}[-\s]?\d{3}\b/;
  if (sinPattern.test(documentText)) {
    risks.push({
      type: "Privacy Risk - Sensitive Personal Information",
      description: "The document appears to contain a Social Insurance Number (SIN) or similar identifier.",
      severity: "high",
      regulation: "Personal Information Protection and Electronic Documents Act (PIPEDA)",
      impact: "Potential privacy breach and non-compliance with privacy regulations.",
      requiredAction: "Redact or secure sensitive personal identifiers.",
      solution: "Redact the SIN and other personal identifiers from any copies of the document that will be broadly distributed. Ensure electronic versions are securely stored with encryption and access controls. Consider using only the last 3 digits of the SIN when full identification is not required."
    });
  }

  // Check for document completeness
  if (documentText.includes('_____') || documentText.includes('XXXX') ||
      documentText.includes('[insert') || documentText.includes('TBD')) {
    risks.push({
      type: "Incomplete Document",
      description: "The document contains placeholders or incomplete sections.",
      severity: "medium",
      regulation: "Bankruptcy and Insolvency General Rules, Section 15",
      impact: "May cause delays in processing or lead to rejection of the filing.",
      requiredAction: "Complete all fields and remove all placeholders.",
      solution: "Review the entire document to identify and complete all placeholder fields. Ensure no section is left blank or marked with generic placeholders. All required information must be provided for the document to be considered complete and valid."
    });
  }

  // Add document retention requirements as a reminder
  risks.push({
    type: "Document Retention Requirement",
    description: "This document must be retained according to regulatory requirements.",
    severity: "low",
    regulation: "Office of the Superintendent of Bankruptcy Canada (OSB) Directive 11R2",
    impact: "Non-compliance with record-keeping requirements could lead to penalties.",
    requiredAction: "Implement proper document retention practices.",
    solution: "Store physical and electronic copies of this document securely for a minimum of 6 years from the discharge date. Implement a document management system with proper access controls and retention scheduling to ensure compliance with regulatory requirements."
  });

  return risks;
}
