
import { OSBFormTemplate } from "../types.ts";

export const receivershipForms: Record<string, OSBFormTemplate> = {
  "40": {
    formNumber: "40",
    title: "Assignment of Book Debts",
    category: "receivership",
    subcategory: "receivership_appointment",
    purpose: "Documentation of receivership over book debts",
    relatedForms: ["41", "42"],
    clientInfoFields: [
      "debtorName",
      "securedCreditor",
      "receiverName"
    ],
    keyDates: [
      "appointmentDate",
      "effectiveDate",
      "registrationDate"
    ],
    monetaryFields: [
      "bookDebtsValue",
      "securedAmount",
      "estimatedRealization"
    ],
    requiredFields: [
      {
        name: "securityDescription",
        type: "text",
        required: true,
        osbReference: "BIA.243",
        formNumbers: ["40"],
        description: "Description of security agreement"
      },
      {
        name: "collateralDescription",
        type: "text",
        required: true,
        osbReference: "BIA.243(1)",
        formNumbers: ["40"],
        description: "Description of book debts"
      }
    ],
    riskIndicators: [
      {
        field: "bookDebtsValue",
        riskType: "financial",
        severity: "high",
        description: "Significant variance between book value and estimated realization"
      },
      {
        field: "registrationDate",
        riskType: "legal",
        severity: "high",
        description: "Late registration may affect priority"
      }
    ]
  }
};
