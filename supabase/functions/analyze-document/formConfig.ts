
export interface FormConfig {
  biaSections: string[];
  ccaaSections: string[];
  osbDirectives: string[];
  validationRules: Record<string, Function>;
}

export const formConfigs: Record<string, FormConfig> = {
  // Forms 1-30: Bankruptcy Forms
  "1": {
    biaSections: ["43(1)", "43(2)", "43(3)"],
    ccaaSections: ["4", "5"],
    osbDirectives: ["31", "33"],
    validationRules: {
      debtorName: (value: string) => value && value.length >= 2,
      filingDate: (value: string) => {
        const date = new Date(value);
        return !isNaN(date.getTime()) && date <= new Date();
      }
    }
  },
  // ... Additional configurations for forms 2-96
  "96": {
    biaSections: ["204.1", "204.2"],
    ccaaSections: ["47", "48"],
    osbDirectives: ["13R5"],
    validationRules: {
      documentType: (value: string) => ["original", "amended"].includes(value),
      submissionDate: (value: string) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      }
    }
  }
};

export const getFormConfig = (formNumber: string): FormConfig => {
  return formConfigs[formNumber] || {
    biaSections: [],
    ccaaSections: [],
    osbDirectives: [],
    validationRules: {}
  };
};
