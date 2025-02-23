export const validationPatterns = {
  // Identification patterns
  estateNumber: /^\d{2}-\d{6}$/,
  courtReference: /^[A-Z]{2}-\d{2}-\d{4}$/,
  sinNumber: /^\d{3}-\d{3}-\d{3}$/,

  // Financial patterns
  currencyAmount: /^\$?\d{1,3}(,\d{3})*(\.\d{2})?$/,
  percentageValue: /^-?\d{1,3}(\.\d{1,2})?%$/,
  taxNumber: /^[0-9A-Z]{9}$/,

  // Date patterns
  standardDate: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  flexibleDate: /^(0[1-9]|[12]\d|3[01])[-.\/](0[1-9]|1[0-2])[-.\/]\d{4}$/
};

export const regulatoryPatterns = {
  BIA: {
    highRisk: {
      sections: {
        "243": {
          timeframes: {
            appointmentNotice: 10,
            filingDeadline: 15
          },
          requirements: [
            "secured creditor notice",
            "appointment details",
            "property description"
          ]
        },
        "246": {
          timeframes: {
            initialReport: 30,
            interimReport: 60,
            finalReport: 90
          },
          requirements: [
            "property inventory",
            "realization plan",
            "financial statements"
          ]
        },
        "247": {
          timeframes: {
            finalReport: 90,
            feeApplication: 30
          },
          requirements: [
            "complete accounting",
            "fee justification",
            "distribution plan"
          ]
        },
        "13.4": {
          timeframes: {
            assessmentPeriod: 45,
            reportingDeadline: 30
          },
          requirements: [
            "income verification",
            "expense analysis",
            "payment calculation"
          ]
        }
      }
    }
  },
  
  directives: {
    "12R2": {
      requirements: {
        receiverAppointment: [
          "secured creditor details",
          "security instrument",
          "appointment basis"
        ],
        reporting: [
          "property inventory",
          "financial statements",
          "realization progress"
        ],
        fees: [
          "detailed time records",
          "rate justification",
          "disbursement support"
        ]
      },
      thresholds: {
        feePercentage: 20,
        reportingDelay: 5,
        documentationGap: 2
      }
    },
    
    "11R2": {
      requirements: {
        assessment: [
          "income calculation",
          "expense verification",
          "surplus determination"
        ],
        reporting: [
          "monthly income",
          "payment schedule",
          "variance explanation"
        ],
        documentation: [
          "pay statements",
          "expense receipts",
          "bank statements"
        ]
      },
      thresholds: {
        paymentDelay: 15,
        reportingPeriod: 30,
        assessmentUpdate: 45
      }
    },
    
    "13R1": {
      requirements: {
        assessment: [
          "asset valuation",
          "creditor claims",
          "distribution priority"
        ],
        reporting: [
          "asset inventory",
          "realization strategy",
          "distribution schedule"
        ],
        documentation: [
          "appraisals",
          "sale agreements",
          "creditor claims"
        ]
      },
      thresholds: {
        reportingDelay: 30,
        distributionPeriod: 60,
        documentationRetention: 72
      }
    }
  }
};

export const validationHelpers = {
  hasMinimumWords: (text: string, minWords: number): boolean => {
    return text.trim().split(/\s+/).length >= minWords;
  },

  checkBIACompliance: (
    section: string,
    requirement: string,
    value: any
  ): boolean => {
    const sectionRules = regulatoryPatterns.BIA.highRisk.sections[section];
    return sectionRules?.requirements.includes(requirement) || false;
  },

  checkDirectiveCompliance: (
    directive: string,
    category: string,
    requirement: string
  ): boolean => {
    const directiveRules = regulatoryPatterns.directives[directive];
    return directiveRules?.requirements[category]?.includes(requirement) || false;
  },

  validateAssessmentCompliance: (
    directive: string,
    category: string,
    documents: string[]
  ): boolean => {
    const directiveRules = regulatoryPatterns.directives[directive];
    const requiredDocs = directiveRules?.requirements[category] || [];
    return requiredDocs.every(doc => documents.includes(doc));
  },

  validateReportingTimeline: (
    section: string,
    reportType: string,
    submissionDate: Date,
    baselineDate: Date
  ): boolean => {
    const sectionRules = regulatoryPatterns.BIA.highRisk.sections[section];
    const allowedDays = sectionRules?.timeframes[reportType];
    if (!allowedDays) return true;
    
    const diffDays = Math.floor(
      (submissionDate.getTime() - baselineDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= allowedDays;
  }
};
