
import { OSBFormTemplate } from "../types.ts";

export const ccaaForms: Record<string, OSBFormTemplate> = {
  "50": {
    formNumber: "50",
    title: "Notice of Stay of Proceedings",
    category: "ccaa",
    subcategory: "ccaa_initial",
    purpose: "Notice of CCAA proceedings and stay of proceedings",
    relatedForms: ["51", "52"],
    clientInfoFields: [
      "companyName",
      "courtFileNumber",
      "monitorName"
    ],
    keyDates: [
      "filingDate",
      "stayExpiryDate",
      "hearingDate"
    ],
    monetaryFields: [
      "totalLiabilities",
      "operatingCosts",
      "interimFinancing"
    ],
    requiredFields: [
      {
        name: "stayPeriod",
        type: "date",
        required: true,
        osbReference: "CCAA.11.02",
        formNumbers: ["50"],
        description: "Period of stay of proceedings"
      },
      {
        name: "courtOrder",
        type: "file",
        required: true,
        osbReference: "CCAA.11",
        formNumbers: ["50"],
        description: "Initial court order"
      }
    ],
    riskIndicators: [
      {
        field: "operatingCosts",
        riskType: "financial",
        severity: "high",
        description: "Insufficient working capital during stay period"
      },
      {
        field: "stayPeriod",
        riskType: "legal",
        severity: "medium",
        description: "Stay extension may be required"
      }
    ]
  }
};
