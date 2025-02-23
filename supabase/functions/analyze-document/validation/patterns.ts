
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
        ]
      },
      thresholds: {
        reportingDelay: 5
      }
    }
  }
};

export function validateBIACompliance(section: string, requirement: string): boolean {
  const sectionRules = regulatoryPatterns.BIA.highRisk.sections[section];
  return sectionRules?.requirements.includes(requirement) || false;
}

export function validateDirectiveCompliance(
  directive: string,
  category: string,
  requirement: string
): boolean {
  const directiveRules = regulatoryPatterns.directives[directive];
  return directiveRules?.requirements[category]?.includes(requirement) || false;
}
