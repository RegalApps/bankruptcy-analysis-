import { FormTemplate, FormField, ValidationRule } from "./types.ts";

// Enhanced validation patterns
const validationPatterns = {
  postalCode: '^[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d$',
  phoneNumber: '^(?:\\+1|1)?[-. ]?\\(?[0-9]{3}\\)?[-. ]?[0-9]{3}[-. ]?[0-9]{4}$',
  email: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
  sinNumber: '^\\d{3}-\\d{3}-\\d{3}$',
  businessNumber: '^\\d{9}[A-Za-z]{2}\\d{4}$',
  courtFileNumber: '^[A-Z]{2}-\\d{2}-\\d{5}$',
  currencyAmount: '^\\$?\\d{1,3}(?:,\\d{3})*(?:\\.\\d{2})?$'
};

// Enhanced validation rules
const advancedValidations = {
  required: (fieldName: string): ValidationRule => ({
    rule: 'required',
    message: `${fieldName} is required`
  }),
  date: (): ValidationRule => ({
    rule: 'validDate',
    message: 'Must be a valid date'
  }),
  pattern: (pattern: string, message: string): ValidationRule => ({
    rule: 'pattern',
    message,
    params: { pattern }
  }),
  range: (min: number, max: number): ValidationRule => ({
    rule: 'range',
    message: `Value must be between ${min} and ${max}`,
    params: { min, max }
  }),
  minLength: (length: number): ValidationRule => ({
    rule: 'minLength',
    message: `Must be at least ${length} characters long`,
    params: { length }
  }),
  maxLength: (length: number): ValidationRule => ({
    rule: 'maxLength',
    message: `Must not exceed ${length} characters`,
    params: { length }
  }),
  custom: (validator: (value: any) => boolean, message: string): ValidationRule => ({
    rule: 'custom',
    message,
    params: { validator }
  })
};

// Enhanced regulatory compliance checks
const regulatoryChecks = {
  bia: {
    checkDebtAmount: (amount: number): ComplianceResult => {
      const minDebt = 1000; // Minimum debt requirement for bankruptcy
      return {
        compliant: amount >= minDebt,
        message: amount < minDebt 
          ? `Debt amount (${amount}) is below minimum requirement of ${minDebt}`
          : 'Debt amount meets requirements'
      };
    },
    checkResidencyPeriod: (date: Date): ComplianceResult => {
      const residencyDays = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      return {
        compliant: residencyDays >= 365,
        message: residencyDays < 365 
          ? `Residency period (${residencyDays} days) is less than required 1 year`
          : 'Residency period meets requirements'
      };
    },
    checkPriorBankruptcy: (dischargeDate: Date | null): ComplianceResult => {
      if (!dischargeDate) {
        return { compliant: true, message: 'No prior bankruptcy' };
      }
      const yearsSinceDischarge = (new Date().getTime() - dischargeDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return {
        compliant: yearsSinceDischarge >= 7,
        message: yearsSinceDischarge < 7 
          ? `Only ${Math.floor(yearsSinceDischarge)} years since last discharge (minimum 7 required)`
          : 'Time since last discharge meets requirements'
      };
    }
  },
  ccaa: {
    checkDebtThreshold: (amount: number): ComplianceResult => {
      const threshold = 5000000; // CCAA debt threshold
      return {
        compliant: amount >= threshold,
        message: amount < threshold 
          ? `Total claims (${amount}) below CCAA threshold of ${threshold}`
          : 'Debt threshold meets CCAA requirements'
      };
    },
    checkCreditorSupport: (percentage: number): ComplianceResult => {
      return {
        compliant: percentage >= 50,
        message: percentage < 50 
          ? `Creditor support (${percentage}%) below required majority`
          : 'Creditor support meets requirements'
      };
    }
  },
  osb: {
    checkDocumentationComplete: (fields: string[]): ComplianceResult => {
      const requiredDocs = ['incomeStatement', 'assetDeclaration', 'creditorList'];
      const missing = requiredDocs.filter(doc => !fields.includes(doc));
      return {
        compliant: missing.length === 0,
        message: missing.length > 0 
          ? `Missing required documents: ${missing.join(', ')}`
          : 'All required documentation provided'
      };
    },
    checkCounselingRequirement: (completed: boolean): ComplianceResult => {
      return {
        compliant: completed,
        message: completed 
          ? 'Credit counseling requirement met'
          : 'Credit counseling requirement not met'
      };
    }
  }
};

// Enhanced form-specific validation
const formSpecificValidation = {
  bankruptcyApplication: (data: any) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Cross-field validation
    if (data.totalAssets && data.totalLiabilities) {
      const assets = parseFloat(data.totalAssets.replace(/[$,]/g, ''));
      const liabilities = parseFloat(data.totalLiabilities.replace(/[$,]/g, ''));
      
      if (assets > liabilities) {
        warnings.push('Total assets exceed liabilities - verify if bankruptcy is appropriate');
      }
      
      if (assets === 0 && liabilities === 0) {
        errors.push('Both assets and liabilities cannot be zero');
      }
    }

    // Income vs Expenses validation
    if (data.monthlyIncome && data.monthlyExpenses) {
      const income = parseFloat(data.monthlyIncome.replace(/[$,]/g, ''));
      const expenses = parseFloat(data.monthlyExpenses.replace(/[$,]/g, ''));
      
      if (income > expenses * 1.5) {
        warnings.push('Income significantly exceeds expenses - verify if bankruptcy is appropriate');
      }
    }

    // Date consistency checks
    if (data.bankruptcyDate && data.lastEmploymentDate) {
      const bankruptcyDate = new Date(data.bankruptcyDate);
      const lastEmploymentDate = new Date(data.lastEmploymentDate);
      
      if (lastEmploymentDate > bankruptcyDate) {
        errors.push('Last employment date cannot be after bankruptcy date');
      }
    }

    return { errors, warnings };
  },
  proposalApplication: (data: any) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Proposal amount validation
    if (data.proposalAmount && data.totalDebt) {
      const proposalAmount = parseFloat(data.proposalAmount.replace(/[$,]/g, ''));
      const totalDebt = parseFloat(data.totalDebt.replace(/[$,]/g, ''));
      
      if (proposalAmount < totalDebt * 0.3) {
        warnings.push('Proposal amount is less than 30% of total debt - may not be acceptable to creditors');
      }
    }

    // Payment schedule validation
    if (data.monthlyPayment && data.proposalTerm) {
      const monthlyPayment = parseFloat(data.monthlyPayment.replace(/[$,]/g, ''));
      const term = parseInt(data.proposalTerm);
      
      if (term > 60) {
        warnings.push('Proposal term exceeds 60 months - may require special approval');
      }
      
      if (monthlyPayment * term < parseFloat(data.proposalAmount.replace(/[$,]/g, ''))) {
        errors.push('Monthly payments over term do not meet total proposal amount');
      }
    }

    return { errors, warnings };
  }
};

// Enhanced validation function
export const validateFormData = (formNumber: string, data: any) => {
  const template = formTemplates[formNumber];
  if (!template) {
    return { 
      valid: false, 
      errors: ["Invalid form number"],
      warnings: [],
      regulatoryIssues: []
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  const regulatoryIssues: string[] = [];

  // Form-specific validation
  if (template.category === 'bankruptcy') {
    const bankruptcyValidation = formSpecificValidation.bankruptcyApplication(data);
    errors.push(...bankruptcyValidation.errors);
    warnings.push(...bankruptcyValidation.warnings);
  } else if (template.category === 'proposal') {
    const proposalValidation = formSpecificValidation.proposalApplication(data);
    errors.push(...proposalValidation.errors);
    warnings.push(...proposalValidation.warnings);
  }

  // Field validation with enhanced pattern matching
  template.requiredFields.forEach(field => {
    const value = data[field.name];
    
    // Required field validation
    if (field.required && !value) {
      errors.push(`${field.name} is required`);
      return;
    }

    if (value) {
      // Type-specific validation with enhanced patterns
      switch (field.type) {
        case 'date':
          if (!isValidDate(value)) {
            errors.push(`${field.name} must be a valid date`);
          } else {
            const date = new Date(value);
            if (date > new Date()) {
              warnings.push(`${field.name} is set to a future date`);
            }
          }
          break;
        case 'currency':
          if (!new RegExp(validationPatterns.currencyAmount).test(value)) {
            errors.push(`${field.name} must be a valid currency amount`);
          } else {
            const amount = parseFloat(value.replace(/[$,]/g, ''));
            if (amount > 1000000) {
              warnings.push(`${field.name} contains an unusually large amount`);
            }
          }
          break;
        case 'text':
          if (field.pattern && !new RegExp(field.pattern).test(value)) {
            errors.push(`${field.name} format is invalid`);
          }
          break;
      }

      // Regulatory compliance checks
      if (field.regulatoryReferences) {
        Object.entries(field.regulatoryReferences).forEach(([framework, sections]) => {
          sections.forEach(section => {
            let complianceResult: ComplianceResult;
            
            switch (framework) {
              case 'bia':
                if (field.type === 'currency') {
                  complianceResult = regulatoryChecks.bia.checkDebtAmount(parseFloat(value.replace(/[$,]/g, '')));
                } else if (field.type === 'date') {
                  complianceResult = regulatoryChecks.bia.checkResidencyPeriod(new Date(value));
                } else {
                  complianceResult = { compliant: true, message: 'No specific BIA checks for this field type' };
                }
                break;
              case 'ccaa':
                if (field.type === 'currency') {
                  complianceResult = regulatoryChecks.ccaa.checkDebtThreshold(parseFloat(value.replace(/[$,]/g, '')));
                } else {
                  complianceResult = { compliant: true, message: 'No specific CCAA checks for this field type' };
                }
                break;
              case 'osb':
                complianceResult = regulatoryChecks.osb.checkDocumentationComplete([field.name]);
                break;
              default:
                complianceResult = { compliant: true, message: 'No specific compliance checks' };
            }

            if (!complianceResult.compliant) {
              regulatoryIssues.push(`${field.name}: ${complianceResult.message} (${framework} ${section})`);
            }
          });
        });
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    regulatoryIssues
  };
};

// Helper functions
function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

// Interface for compliance check results
interface ComplianceResult {
  compliant: boolean;
  message: string;
}

// Export types
export type { FormField, ValidationRule } from "./types.ts";
