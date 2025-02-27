
import { AnalysisResult } from '../types/analysisTypes';

export const getMockForm76Data = (): AnalysisResult => {
  return {
    extracted_info: {
      formNumber: "Form 76",
      clientName: "Reginald Dickerson",
      clientAddress: "123 Main Street, Toronto, ON M4C 1B5",
      clientPhone: "(416) 555-1234",
      clientEmail: "reginald.dickerson@example.com",
      dateSigned: "February 22, 2025",
      trusteeName: "Gradey Henderson",
      trusteeAddress: "456 Bay Street, Suite 1200, Toronto, ON M5H 2R8",
      trusteePhone: "(416) 555-9876",
      trusteeEmail: "g.henderson@trustee-firm.ca",
      type: "bankruptcy",
      totalDebts: "$45,000",
      totalAssets: "$12,500",
      monthlyIncome: "$3,200",
      summary: "This is a bankruptcy form (Form 76) for Reginald Dickerson. The form was submitted on February 22, 2025. The trustee assigned to this case is Gradey Henderson. The client has total debts of $45,000 and total assets valued at $12,500."
    },
    risks: [
      {
        type: "Missing Financial Details",
        description: "There are no income, assets, liabilities, or creditor details present in the extracted information.",
        severity: "high",
        regulation: "BIA Reference: Section 158(a) requires a debtor to disclose full financial affairs to the trustee. Directive Reference: OSB Directive No. 6R3 states the requirement to file a Statement of Affairs.",
        impact: "May delay the bankruptcy process and lead to rejection of filing.",
        requiredAction: "Submit complete financial disclosure within 5 days.",
        solution: "Attach a Statement of Affairs with required financial details.",
        deadline: "5 days"
      },
      {
        type: "Lack of Required Signatures",
        description: "The form does not indicate whether it has been signed by the debtor or trustee.",
        severity: "medium",
        regulation: "BIA Reference: Section 50.4(8) mandates signatures for formal insolvency proceedings. Directive Reference: OSB Form Guidelines state that official documents must have authenticated signatures.",
        impact: "Document may be considered invalid without proper signatures.",
        requiredAction: "Obtain signatures before next trustee meeting.",
        solution: "Use digital signing (e.g., DocuSign API integration).",
        deadline: "3 days"
      },
      {
        type: "No Creditor Information Provided",
        description: "There is no evidence of creditor claims or liabilities.",
        severity: "high",
        regulation: "BIA Reference: Section 158(c) states that a debtor must disclose all creditors and amounts owed. Directive Reference: OSB Directive No. 11 outlines creditor claim procedures.",
        impact: "Creditors may not be properly notified of proceedings.",
        requiredAction: "Submit creditor details within 3 days.",
        solution: "Use OCR and AI-driven form processing to extract financial details from bank statements.",
        deadline: "3 days"
      },
      {
        type: "No Mention of Assets or Exemptions",
        description: "There is no declaration of assets, which is critical for determining surplus income and potential liquidation.",
        severity: "medium",
        regulation: "BIA Reference: Section 67(1) discusses the division of assets under bankruptcy. Directive Reference: OSB Directive No. 11R2 details asset disclosure requirements.",
        impact: "May result in improper handling of debtor assets.",
        requiredAction: "Disclose assets before initial bankruptcy assessment.",
        solution: "Automate asset tracking through the CRM system.",
        deadline: "7 days"
      }
    ],
    regulatory_compliance: {
      status: "non_compliant",
      details: "This document does not meet BIA compliance requirements due to missing financial details, signatures, creditor information, and asset disclosures.",
      references: [
        "BIA Section 158(a) - Disclosure of financial affairs",
        "OSB Directive No. 6R3 - Statement of Affairs requirements",
        "BIA Section 50.4(8) - Signature requirements",
        "OSB Directive No. 11 - Creditor claim procedures"
      ]
    }
  };
};

export const getMockForm66Data = (): AnalysisResult => {
  return {
    extracted_info: {
      formNumber: "Form 66",
      clientName: "the information typed here",
      clientAddress: "123 Example Street, Toronto, ON M5V 2T6",
      clientPhone: "(416) 555-0123",
      clientEmail: "client@example.com",
      dateSigned: new Date().toISOString().split('T')[0],
      trusteeName: "Licensed Insolvency Trustee Name",
      trusteeAddress: "456 Business Ave, Suite 800, Toronto, ON M5H 2N2",
      trusteePhone: "(416) 555-9876",
      trusteeEmail: "trustee@firm.ca",
      type: "consumer proposal",
      totalDebts: "$75,000",
      totalAssets: "$35,000",
      monthlyIncome: "$4,800",
      summary: "This is a Consumer Proposal (Form 66) for the specified client. The proposal was processed using OCR extraction and validated against BIA requirements. The document includes client details, trustee information, and proposal terms."
    },
    risks: [
      {
        type: "Debtor Information Verification",
        description: "Additional verification required for debtor's current contact information and employment status.",
        severity: "medium",
        regulation: "BIA Section 66.13 - Requirements for consumer proposals; OSB Directive 6R3 - Consumer Proposal Administration",
        impact: "May delay creditor notifications and proposal administration",
        requiredAction: "Verify and update debtor contact information within 5 business days",
        solution: "Implement automated contact information verification system",
        deadline: "5 days"
      },
      {
        type: "Meeting Details Documentation",
        description: "Meeting of creditors details require additional documentation and confirmation",
        severity: "high",
        regulation: "BIA Section 66.15 - Meeting of creditors; OSB Directive 6R3 Section 7 - Meeting of Creditors",
        impact: "Could affect creditors' ability to participate in the proposal process",
        requiredAction: "Document and confirm meeting details before creditor notification",
        solution: "Use digital scheduling system with automated notifications",
        deadline: "3 days"
      },
      {
        type: "Statement of Income Verification",
        description: "Current income statement requires supporting documentation",
        severity: "high",
        regulation: "BIA Section 66.12 - Required information in consumer proposals; OSB Directive 6R3 Section 4",
        impact: "May affect proposal viability assessment",
        requiredAction: "Submit complete income verification within 7 days",
        solution: "Implement automated income verification system with banking integration",
        deadline: "7 days"
      }
    ],
    regulatory_compliance: {
      status: "requires_review",
      details: "Consumer proposal requires verification of key elements under BIA Section 66.13 and OSB Directive 6R3",
      references: [
        "BIA Section 66.13 - Consumer Proposal Requirements",
        "OSB Directive 6R3 - Consumer Proposal Administration",
        "BIA Section 66.15 - Meeting of Creditors Requirements",
        "OSB Directive 6R3 Section 4 - Required Documentation"
      ]
    }
  };
};

export const getMockForm65Data = (): AnalysisResult => {
  return {
    extracted_info: {
      formNumber: "Form 65",
      clientName: "Jasper Technologies Inc.",
      clientAddress: "400 King Street West, Toronto, ON M5V 1K4",
      clientPhone: "(416) 555-8765",
      clientEmail: "legal@jaspertech.com",
      dateSigned: "January 10, 2025",
      trusteeName: "Miranda Chen",
      trusteeAddress: "200 Bay Street, Suite 3000, Toronto, ON M5J 2J2",
      trusteePhone: "(416) 555-3412",
      trusteeEmail: "m.chen@restructure-partners.ca",
      type: "notice of intention",
      totalDebts: "$1,850,000",
      totalAssets: "$1,200,000",
      summary: "This is a Notice of Intention to Make a Proposal (Form 65) filed by Jasper Technologies Inc. on January 10, 2025. The notice was filed with Miranda Chen as the proposal trustee. The company has reported total liabilities of $1,850,000 and assets valued at $1,200,000."
    },
    risks: [
      {
        type: "Tight Timeline for Proposal",
        description: "The company has only 30 days to file a proposal, which may be insufficient given the complexity of its business.",
        severity: "high",
        regulation: "BIA Reference: Section 50.4(8) sets the initial 30-day timeline. Directive Reference: OSB Directive No. 32R2 on proposal procedures.",
        impact: "Failure to file within the timeline could result in automatic bankruptcy.",
        requiredAction: "Consider applying for an extension before day 25.",
        solution: "Implement automated timeline tracking with court deadline alerts.",
        deadline: "25 days"
      },
      {
        type: "Incomplete Creditor List",
        description: "The creditor list appears to be missing several trade creditors mentioned in the financial statements.",
        severity: "high",
        regulation: "BIA Reference: Section 50(2) requires a complete list of creditors. Directive Reference: OSB Directive No. 32R2 details creditor disclosure requirements.",
        impact: "Creditors may challenge the process if not properly notified.",
        requiredAction: "Submit a complete creditor list within 7 days.",
        solution: "Use accounting system integration to automatically compile creditor lists.",
        deadline: "7 days"
      },
      {
        type: "Cash Flow Concerns",
        description: "The projected cash flow statement shows potential liquidity issues in the next 60 days.",
        severity: "medium",
        regulation: "BIA Reference: Section 50.4(2)(c) requires a cash flow statement. Directive Reference: OSB Directive No. 32R2 on cash flow requirements.",
        impact: "May compromise the company's ability to continue operations during the proposal period.",
        requiredAction: "Develop a liquidity management plan.",
        solution: "Implement rolling 13-week cash flow forecasting with variance analysis.",
        deadline: "14 days"
      }
    ],
    regulatory_compliance: {
      status: "requires_immediate_action",
      details: "This Notice of Intention filing requires immediate action to address timeline constraints, creditor disclosure issues, and cash flow concerns to ensure BIA compliance.",
      references: [
        "BIA Section 50.4(8) - Timeline for filing proposal",
        "OSB Directive No. 32R2 - Proposal procedures",
        "BIA Section 50(2) - Creditor disclosure requirements",
        "BIA Section 50.4(2)(c) - Cash flow statement requirements"
      ]
    }
  };
};
