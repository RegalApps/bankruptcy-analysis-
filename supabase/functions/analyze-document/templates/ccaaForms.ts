
import { OSBFormTemplate } from "../types.ts";

export const ccaaForms: Record<string, OSBFormTemplate> = {
  "51": {
    formNumber: "51",
    title: "Monitor's Report on Cash Flow Statement",
    category: "ccaa",
    subcategory: "ccaa_monitor",
    purpose: "Cash flow analysis and report",
    relatedForms: ["50", "52"],
    clientInfoFields: [
      "monitorName",
      "companyName"
    ],
    keyDates: [
      "reportDate",
      "periodStart",
      "periodEnd"
    ],
    monetaryFields: [
      "projectedCashFlow",
      "actualCashFlow",
      "variance"
    ],
    requiredFields: [
      {
        name: "cashFlowAnalysis",
        type: "text",
        required: true,
        osbReference: "CCAA.23",
        formNumbers: ["51"],
        description: "Cash flow statement analysis"
      }
    ],
    riskIndicators: [
      {
        field: "variance",
        riskType: "financial",
        severity: "high",
        description: "Cash flow variance analysis"
      }
    ]
  },
  "52": {
    formNumber: "52",
    title: "Monitor's Report on Company's Business and Financial Affairs",
    category: "ccaa",
    subcategory: "ccaa_monitor",
    purpose: "Comprehensive business review",
    relatedForms: ["50", "51"],
    clientInfoFields: [
      "monitorName",
      "companyInfo"
    ],
    keyDates: [
      "reportDate",
      "reviewPeriod"
    ],
    monetaryFields: [
      "operatingResults",
      "workingCapital",
      "restructuringCosts"
    ],
    requiredFields: [
      {
        name: "businessReview",
        type: "text",
        required: true,
        osbReference: "CCAA.23(1)(b)",
        formNumbers: ["52"],
        description: "Business operations review"
      }
    ],
    riskIndicators: [
      {
        field: "workingCapital",
        riskType: "operational",
        severity: "high",
        description: "Working capital adequacy"
      }
    ]
  }
};
