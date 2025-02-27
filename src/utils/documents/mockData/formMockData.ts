
import { AnalysisResult } from '../types/analysisTypes';

export const getMockForm76Data = (): AnalysisResult => {
  return {
    extracted_info: {
      formNumber: "Form 76",
      clientName: "Reginald Dickerson",
      dateSigned: "February 22, 2025",
      trusteeName: "Gradey Henderson",
      type: "bankruptcy",
      summary: "This is a bankruptcy form (Form 76) for Reginald Dickerson. The form was submitted on February 22, 2025. The trustee assigned to this case is Gradey Henderson. The client has total debts of $45,000 and total assets valued at $12,500.",
      clientAddress: "123 Main Street, Toronto, ON M5V 2T6",
      clientPhone: "(416) 555-1234",
      clientEmail: "reginald.dickerson@example.com",
      totalDebts: "$45,000",
      totalAssets: "$12,500",
      monthlyIncome: "$3,200"
    },
    risks: [
      {
        type: "Missing Financial Details",
        description: "There are no income, assets, liabilities, or creditor details present in the extracted information.",
        severity: "high",
        regulation: "BIA Section 149 - Required Documentation",
        impact: "Incomplete filing may result in dismissal of bankruptcy application",
        requiredAction: "Submit complete financial disclosure within 5 days",
        solution: "Use automated financial data extraction from bank statements",
        deadline: "5 days"
      },
      {
        type: "Lack of Required Signatures",
        description: "The form does not indicate whether it has been signed by the debtor or trustee.",
        severity: "medium",
        regulation: "BIA Section 151 - Signature Requirements",
        impact: "Could delay proceedings if signatures cannot be verified",
        requiredAction: "Obtain signatures before next filing deadline",
        solution: "Implement electronic signature system with verification",
        deadline: "3 days"
      },
      {
        type: "No Creditor Information Provided",
        description: "There is no evidence of creditor claims or liabilities.",
        severity: "high",
        regulation: "BIA Section 102 - Creditor Claims",
        impact: "May affect distribution of assets and discharge timeline",
        requiredAction: "Submit complete creditor list with verification",
        solution: "Use creditor verification API to validate all claims",
        deadline: "7 days"
      },
      {
        type: "No Mention of Assets or Exemptions",
        description: "There is no declaration of assets, which is critical for determining surplus income and potential liquidation.",
        severity: "medium",
        regulation: "BIA Section 67 - Property of Bankrupt",
        impact: "Could result in improper asset valuation and distribution",
        requiredAction: "Complete asset declaration with proper valuation",
        solution: "Implement automated asset valuation tools",
        deadline: "7 days"
      }
    ],
    regulatory_compliance: {
      status: "incomplete",
      details: "Multiple critical elements missing from bankruptcy filing as required by Bankruptcy and Insolvency Act.",
      references: [
        "BIA Section 149 - Required Documentation",
        "BIA Section 151 - Signature Requirements",
        "BIA Section 102 - Creditor Claims",
        "BIA Section 67 - Property of Bankrupt"
      ]
    }
  };
};

export const getMockForm66Data = (): AnalysisResult => {
  return {
    extracted_info: {
      formNumber: "Form 66",
      clientName: "Jessica Campbell",
      dateSigned: "March 15, 2025",
      trusteeName: "Morgan Financial Solutions Inc.",
      type: "consumer proposal",
      summary: "This is a Consumer Proposal (Form 66) for Jessica Campbell. The proposal was filed on March 15, 2025, with Morgan Financial Solutions Inc. acting as the Licensed Insolvency Trustee. The proposal outlines a plan to repay creditors $25,000 of the total $58,000 debt over 60 months.",
      clientAddress: "456 Oak Avenue, Vancouver, BC V6B 2W2",
      clientPhone: "(604) 555-7890",
      clientEmail: "jessica.campbell@example.com",
      trusteeAddress: "789 Financial Street, Suite 400, Vancouver, BC V7Y 1G5",
      trusteePhone: "(604) 555-4321",
      trusteeEmail: "contact@morganfinancial.ca",
      totalDebts: "$58,000",
      totalAssets: "$32,000",
      monthlyIncome: "$4,200"
    },
    risks: [
      {
        type: "Incomplete Creditor List",
        description: "The proposal may not include all creditors, which could affect the voting process.",
        severity: "high",
        regulation: "BIA Section 66.12 - Required information in consumer proposals",
        impact: "Omitted creditors may contest the proposal after approval",
        requiredAction: "Verify and complete creditor list within 7 days",
        solution: "Use credit bureau integration to automatically check for missing creditors",
        deadline: "7 days"
      },
      {
        type: "Payment Plan Viability",
        description: "The proposed payment plan may need additional financial validation.",
        severity: "medium",
        regulation: "BIA Section 66.12(5) - Financial circumstances of the debtor",
        impact: "If not viable, creditors may vote against the proposal",
        requiredAction: "Provide detailed income verification and budget",
        solution: "Implement budget analysis tools with automated income verification",
        deadline: "5 days"
      },
      {
        type: "Missing Meeting Details",
        description: "The proposal lacks specific information about the meeting of creditors.",
        severity: "medium",
        regulation: "BIA Section 66.15 - Meeting of creditors",
        impact: "Could affect creditors' ability to vote on the proposal",
        requiredAction: "Schedule and document creditor meeting details",
        solution: "Use automated scheduling and notification system for creditor meetings",
        deadline: "10 days"
      },
      {
        type: "Insufficient Financial Disclosure",
        description: "The proposal may need more detailed financial information to support the repayment plan.",
        severity: "high",
        regulation: "OSB Directive 6R3 - Consumer Proposal Administration",
        impact: "May lead to rejection by the Official Receiver",
        requiredAction: "Provide comprehensive financial statements",
        solution: "Generate automated financial disclosure reports from accounting software",
        deadline: "7 days"
      }
    ],
    regulatory_compliance: {
      status: "requires_additional_information",
      details: "The consumer proposal requires additional financial disclosure and creditor information to meet BIA requirements.",
      references: [
        "BIA Section 66.12 - Required information in consumer proposals",
        "BIA Section 66.15 - Meeting of creditors",
        "BIA Section 66.13 - Filing requirements",
        "OSB Directive 6R3 - Consumer Proposal Administration"
      ]
    }
  };
};

export const getMockForm65Data = (): AnalysisResult => {
  return {
    extracted_info: {
      formNumber: "Form 65",
      clientName: "Westbrook Solutions Inc.",
      dateSigned: "January 10, 2025",
      trusteeName: "Nguyen & Associates",
      type: "notice of intention",
      summary: "This is a Notice of Intention to Make a Proposal (Form 65) filed by Westbrook Solutions Inc. on January 10, 2025. The notice indicates the company's intention to restructure its debt obligations under the Bankruptcy and Insolvency Act. Nguyen & Associates has been appointed as the Licensed Insolvency Trustee.",
      clientAddress: "789 Enterprise Way, Suite 500, Toronto, ON M5J 2H7",
      clientPhone: "(416) 555-9876",
      clientEmail: "finance@westbrooksolutions.com",
      trusteeAddress: "150 King Street West, Toronto, ON M5H 1J9",
      trusteePhone: "(416) 555-6543",
      trusteeEmail: "info@nguyenassociates.ca",
      totalDebts: "$2,450,000",
      totalAssets: "$1,850,000",
      monthlyIncome: "$215,000"
    },
    risks: [
      {
        type: "Deadline for Filing Proposal",
        description: "The 30-day statutory deadline for filing the actual proposal is approaching.",
        severity: "high",
        regulation: "BIA Section 50.4(8) - Time for filing proposal",
        impact: "Failing to file within 30 days results in deemed bankruptcy",
        requiredAction: "File proposal or extension request before deadline",
        solution: "Implement automated deadline tracking with escalation alerts",
        deadline: "15 days"
      },
      {
        type: "Incomplete Creditor Information",
        description: "The notice appears to be missing complete information on secured creditors.",
        severity: "high",
        regulation: "BIA Section 50.4(1) - Required information in Notice of Intention",
        impact: "Could invalidate the notice or cause delays in the process",
        requiredAction: "File amended notice with complete creditor details",
        solution: "Use enhanced creditor data extraction tools for verification",
        deadline: "5 days"
      },
      {
        type: "Cash Flow Statement",
        description: "A detailed cash flow statement must be filed within 10 days of the Notice of Intention.",
        severity: "high",
        regulation: "BIA Section 50.4(2) - Cash flow statement requirements",
        impact: "Failure to file could result in termination of NOI proceedings",
        requiredAction: "Prepare and file cash flow statement",
        solution: "Implement automated financial reporting system",
        deadline: "3 days"
      },
      {
        type: "Ongoing Business Operations",
        description: "The notice lacks details on plans for ongoing operations during the proposal period.",
        severity: "medium",
        regulation: "BIA Practice Direction No. 22",
        impact: "May affect creditor confidence in restructuring viability",
        requiredAction: "File business continuity plan with trustee",
        solution: "Develop standardized continuity plan templates",
        deadline: "10 days"
      }
    ],
    regulatory_compliance: {
      status: "requires_immediate_action",
      details: "Time-sensitive filings required under BIA Section 50.4, including cash flow statement and possible extension requests.",
      references: [
        "BIA Section 50.4(1) - Required information in Notice of Intention",
        "BIA Section 50.4(2) - Cash flow statement requirements",
        "BIA Section 50.4(8) - Time for filing proposal",
        "BIA Practice Direction No. 22 - Business Restructuring"
      ]
    }
  };
};
