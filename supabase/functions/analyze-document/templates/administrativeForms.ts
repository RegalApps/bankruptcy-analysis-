
import { OSBFormTemplate } from "./types.ts";

const administrativeForms: Record<string, OSBFormTemplate> = {
  "72": {
    formNumber: "72",
    title: "Notice of Appointment of Receiver",
    category: "administrative",
    subcategory: "receivership_appointment",
    purpose: "Receiver appointment",
    relatedForms: ["73", "74"],
    clientInfoFields: [
      "receiverInfo",
      "debtorInfo",
      "securedCreditor"
    ],
    keyDates: [
      "appointmentDate",
      "noticeDate",
      "registrationDeadline"
    ],
    monetaryFields: [
      "securedAmount",
      "estimatedAssets"
    ],
    requiredFields: [
      {
        name: "appointmentBasis",
        type: "text",
        required: true,
        osbReference: "BIA.243",
        directives: ["12R2"],
        formNumbers: ["72"],
        description: "Basis of receiver appointment"
      },
      {
        name: "securityDetails",
        type: "text",
        required: true,
        osbReference: "BIA.243(1)",
        directives: ["12R2"],
        formNumbers: ["72"],
        description: "Security instrument details"
      }
    ],
    riskIndicators: [
      {
        field: "noticeDate",
        riskType: "regulatory",
        severity: "high",
        description: "BIA 243(1) compliance - Notice timing",
        regulation: "BIA.243(1)",
        directive: "12R2",
        threshold: {
          type: "days",
          value: 10,
          comparison: "maximum",
          baseline: "appointmentDate"
        }
      }
    ]
  }
};

export { administrativeForms };
