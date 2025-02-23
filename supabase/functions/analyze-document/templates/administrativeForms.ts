
import { OSBFormTemplate } from "../types.ts";

export const administrativeForms: Record<string, OSBFormTemplate> = {
  "78": {
    formNumber: "78",
    title: "Statement of Receipts and Disbursements",
    category: "administrative",
    subcategory: "administrative_general",
    purpose: "Detailed accounting of estate administration",
    relatedForms: ["1", "2", "3", "4"],
    clientInfoFields: [
      "estateId",
      "trusteeName",
      "estateName"
    ],
    keyDates: [
      "startDate",
      "endDate",
      "reportingPeriod"
    ],
    monetaryFields: [
      "totalReceipts",
      "totalDisbursements",
      "trusteeFees",
      "creditorDividends"
    ],
    requiredFields: [
      {
        name: "receiptsBreakdown",
        type: "text",
        required: true,
        osbReference: "BIA.Directive.5R",
        formNumbers: ["78"],
        description: "Detailed breakdown of receipts"
      },
      {
        name: "disbursementsBreakdown",
        type: "text",
        required: true,
        osbReference: "BIA.Directive.5R",
        formNumbers: ["78"],
        description: "Detailed breakdown of disbursements"
      }
    ],
    riskIndicators: [
      {
        field: "trusteeFees",
        riskType: "compliance",
        severity: "high",
        description: "Trustee fees exceed tariff or guidelines"
      },
      {
        field: "unexplainedDisbursements",
        riskType: "financial",
        severity: "high",
        description: "Unexplained or unusual disbursements"
      }
    ]
  },
  "82": {
    formNumber: "82",
    title: "Notice of Mediation",
    category: "administrative",
    subcategory: "administrative_general",
    purpose: "Notification of mediation for disputed matters",
    relatedForms: ["83", "84"],
    clientInfoFields: [
      "bankruptName",
      "trusteeContact",
      "mediatorName"
    ],
    keyDates: [
      "mediationDate",
      "responseDeadline",
      "documentationDeadline"
    ],
    monetaryFields: [
      "disputedAmount",
      "mediationCosts"
    ],
    requiredFields: [
      {
        name: "disputeDescription",
        type: "text",
        required: true,
        osbReference: "BIA.170.1",
        formNumbers: ["82"],
        description: "Description of disputed matters"
      },
      {
        name: "mediatorAppointment",
        type: "file",
        required: true,
        osbReference: "BIA.170.1(1)",
        formNumbers: ["82"],
        description: "Mediator appointment document"
      }
    ],
    riskIndicators: [
      {
        field: "disputedAmount",
        riskType: "financial",
        severity: "medium",
        description: "High disputed amount may affect estate administration"
      },
      {
        field: "responseDeadline",
        riskType: "compliance",
        severity: "high",
        description: "Missed deadline may result in adverse determination"
      }
    ]
  }
};
