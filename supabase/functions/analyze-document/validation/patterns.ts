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
  flexibleDate: /^(0[1-9]|[12]\d|3[01])[-.\/](0[1-9]|1[0-2])[-.\/]\d{4}$/,

  // Contact patterns
  phoneNumber: /^\+?[\d\s-]{10,}$/,
  emailAddress: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
  postalCode: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/,

  // Document-specific patterns
  formNumber: /^(Form\s)?[0-9]{1,3}[A-Z]?$/i,
  registrationNumber: /^[A-Z]{2}\d{6}$/,
  licenseNumber: /^[A-Z]{3}-\d{4}-[A-Z]\d{2}$/,

  // Legal reference patterns
  sectionReference: /^s\.\s?\d+(\.\d+)*$/i,
  regulationCode: /^[A-Z]{3,5}\s\d{4}$/,
  clauseReference: /^cl\.\s?\d+(\([a-z]\))?$/i,

  // Validation helpers
  hasMinimumWords: (text: string, minWords: number): boolean => {
    return text.trim().split(/\s+/).length >= minWords;
  },

  containsRequiredKeywords: (text: string, keywords: string[]): boolean => {
    const lowerText = text.toLowerCase();
    return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
  },

  isWithinDateRange: (date: Date, start: Date, end: Date): boolean => {
    return date >= start && date <= end;
  },

  isValidMonetaryRange: (amount: number, min: number, max: number): boolean => {
    return amount >= min && amount <= max;
  },

  hasRequiredFormat: (text: string, format: RegExp): boolean => {
    return format.test(text);
  },

  isSequentialDate: (dates: Date[]): boolean => {
    for (let i = 1; i < dates.length; i++) {
      if (dates[i] <= dates[i - 1]) return false;
    }
    return true;
  },

  sumEqualsTotal: (values: number[], total: number, tolerance: number = 0.01): boolean => {
    return Math.abs(values.reduce((a, b) => a + b, 0) - total) <= tolerance;
  }
};

export const riskPatterns = {
  financialRisk: {
    highRisk: {
      thresholds: {
        amount: 100000,
        percentage: 75,
        ratio: 2.0
      },
      indicators: [
        "insufficient assets",
        "significant deficiency",
        "large exposure"
      ]
    },
    mediumRisk: {
      thresholds: {
        amount: 50000,
        percentage: 50,
        ratio: 1.5
      },
      indicators: [
        "moderate deficiency",
        "potential loss",
        "payment delay"
      ]
    },
    lowRisk: {
      thresholds: {
        amount: 10000,
        percentage: 25,
        ratio: 1.2
      },
      indicators: [
        "minor deficiency",
        "small exposure",
        "stable position"
      ]
    }
  },

  complianceRisk: {
    highRisk: {
      timeframes: {
        days: 30,
        notifications: 5,
        responses: 10
      },
      indicators: [
        "deadline missed",
        "incomplete documentation",
        "regulatory breach"
      ]
    },
    mediumRisk: {
      timeframes: {
        days: 15,
        notifications: 3,
        responses: 5
      },
      indicators: [
        "approaching deadline",
        "pending documentation",
        "partial compliance"
      ]
    },
    lowRisk: {
      timeframes: {
        days: 7,
        notifications: 1,
        responses: 2
      },
      indicators: [
        "within timeframe",
        "minor delay",
        "technical issue"
      ]
    }
  },

  legalRisk: {
    highRisk: {
      conditions: {
        courtOrders: true,
        statutoryDeadlines: true,
        regulatoryCompliance: false
      },
      indicators: [
        "court order violation",
        "statutory breach",
        "regulatory non-compliance"
      ]
    },
    mediumRisk: {
      conditions: {
        documentationGaps: true,
        procedureDeviation: true,
        minorDelay: true
      },
      indicators: [
        "incomplete documentation",
        "procedure variation",
        "timeline extension"
      ]
    },
    lowRisk: {
      conditions: {
        minorOmissions: true,
        technicalIssues: true,
        clarificationNeeded: true
      },
      indicators: [
        "minor oversight",
        "technical correction",
        "clarification request"
      ]
    }
  },

  operationalRisk: {
    highRisk: {
      conditions: {
        systemFailure: true,
        dataLoss: true,
        processBreakdown: true
      },
      indicators: [
        "system outage",
        "data corruption",
        "process failure"
      ]
    },
    mediumRisk: {
      conditions: {
        performanceIssues: true,
        dataInconsistency: true,
        processDelay: true
      },
      indicators: [
        "system slowdown",
        "data discrepancy",
        "process bottleneck"
      ]
    },
    lowRisk: {
      conditions: {
        minorGlitches: true,
        dataWarnings: true,
        processInefficiency: true
      },
      indicators: [
        "minor glitch",
        "data warning",
        "process inefficiency"
      ]
    }
  },

  reputationalRisk: {
    highRisk: {
      conditions: {
        publicExposure: true,
        stakeholderImpact: true,
        mediaAttention: true
      },
      indicators: [
        "public controversy",
        "stakeholder complaint",
        "media coverage"
      ]
    },
    mediumRisk: {
      conditions: {
        limitedExposure: true,
        stakeholderConcern: true,
        localAttention: true
      },
      indicators: [
        "local concern",
        "stakeholder inquiry",
        "limited exposure"
      ]
    },
    lowRisk: {
      conditions: {
        internalIssue: true,
        minorConcern: true,
        noPublicity: true
      },
      indicators: [
        "internal matter",
        "minor concern",
        "no publicity"
      ]
    }
  }
};
