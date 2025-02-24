import { OSBFormTemplate } from '../types';

export const bankruptcyForms: Record<string, OSBFormTemplate> = {
  "1": {
    title: "Assignment",
    description: "Assignment for general benefit of creditors made under the BIA",
    requiredFields: [
      { name: "debtorName", type: "string", required: true },
      { name: "assignmentDate", type: "date", required: true },
      { name: "licensedInsolvencyTrustee", type: "string", required: true }
    ],
    keyDates: ["assignmentDate", "filingDate"],
    monetaryFields: ["totalAssets", "totalLiabilities"],
    riskIndicators: [
      {
        field: "totalLiabilities",
        riskType: "financial",
        threshold: 250000,
        severity: "high"
      }
    ]
  },
  "2": {
    title: "Statement of Affairs",
    description: "Statement of Affairs (Business Bankruptcy)",
    requiredFields: [
      { name: "businessName", type: "string", required: true },
      { name: "businessAddress", type: "string", required: true },
      { name: "natureOfBusiness", type: "string", required: true },
      { name: "dateCommenced", type: "date", required: true }
    ],
    keyDates: ["dateCommenced", "dateCeased", "filingDate"],
    monetaryFields: ["totalAssets", "totalLiabilities", "deficiency"],
    riskIndicators: [
      {
        field: "deficiency",
        riskType: "financial",
        threshold: 500000,
        severity: "high"
      }
    ]
  },
  "3": {
    title: "Statement of Affairs",
    description: "Statement of Affairs (Consumer Bankruptcy)",
    requiredFields: [
      { name: "debtorName", type: "string", required: true },
      { name: "occupation", type: "string", required: true },
      { name: "maritalStatus", type: "string", required: true },
      { name: "dependents", type: "number", required: true }
    ],
    keyDates: ["bankruptcyDate", "filingDate"],
    monetaryFields: ["monthlyIncome", "monthlyExpenses", "totalAssets", "totalLiabilities"],
    riskIndicators: [
      {
        field: "totalLiabilities",
        riskType: "financial",
        threshold: 200000,
        severity: "medium"
      }
    ]
  },
  "4": {
    title: "Report on Bankrupt by Trustee",
    description: "Initial Report of the Trustee",
    requiredFields: [
      { name: "estateNumber", type: "string", required: true },
      { name: "trusteeFindings", type: "string", required: true },
      { name: "bankruptcyClass", type: "string", required: true }
    ],
    keyDates: ["reportDate", "bankruptcyDate"],
    monetaryFields: ["estimatedRealization", "estimatedDistribution"],
    riskIndicators: [
      {
        field: "estimatedRealization",
        riskType: "operational",
        threshold: 100000,
        severity: "medium"
      }
    ]
  },
  "5": {
    title: "Demand for Payment",
    description: "Trustee's Demand for Payment",
    requiredFields: [
      { name: "creditorName", type: "string", required: true },
      { name: "amountDemanded", type: "number", required: true },
      { name: "dueDate", type: "date", required: true }
    ],
    keyDates: ["demandDate", "dueDate"],
    monetaryFields: ["amountDemanded", "interestAmount"],
    riskIndicators: [
      {
        field: "amountDemanded",
        riskType: "financial",
        threshold: 50000,
        severity: "medium"
      }
    ]
  }
};
