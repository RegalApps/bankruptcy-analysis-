
import { OSBFormTemplate } from "../types.ts";

export const receivershipForms: Record<string, OSBFormTemplate> = {
  "41": {
    formNumber: "41",
    title: "Notice of Intention to Enforce Security",
    category: "receivership",
    subcategory: "receivership_appointment",
    purpose: "Notice of enforcement of security",
    relatedForms: ["40", "42"],
    clientInfoFields: [
      "securedCreditor",
      "debtorName",
      "securityDetails"
    ],
    keyDates: [
      "noticeDate",
      "enforcementDate"
    ],
    monetaryFields: [
      "securedAmount",
      "propertyValue"
    ],
    requiredFields: [
      {
        name: "securityDescription",
        type: "text",
        required: true,
        osbReference: "BIA.244(1)",
        formNumbers: ["41"],
        description: "Security details"
      }
    ],
    riskIndicators: [
      {
        field: "enforcementDate",
        riskType: "legal",
        severity: "high",
        description: "Notice period compliance"
      }
    ]
  },
  "42": {
    formNumber: "42",
    title: "Notice of Appointment of Receiver",
    category: "receivership",
    subcategory: "receivership_appointment",
    purpose: "Notification of receiver appointment",
    relatedForms: ["40", "41"],
    clientInfoFields: [
      "receiverName",
      "debtorInfo",
      "creditorInfo"
    ],
    keyDates: [
      "appointmentDate",
      "filingDate"
    ],
    monetaryFields: [
      "securedDebt",
      "propertyValue"
    ],
    requiredFields: [
      {
        name: "appointmentTerms",
        type: "text",
        required: true,
        osbReference: "BIA.245(1)",
        formNumbers: ["42"],
        description: "Terms of appointment"
      }
    ],
    riskIndicators: [
      {
        field: "appointmentDate",
        riskType: "compliance",
        severity: "high",
        description: "Appointment notification compliance"
      }
    ]
  }
};
