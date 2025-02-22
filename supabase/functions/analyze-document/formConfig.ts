export interface FormConfig {
  biaSections: string[];
  ccaaSections: string[];
  osbDirectives: string[];
  validationRules: Record<string, Function>;
}

export const formConfigs: Record<string, FormConfig> = {
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
  }
  // Add configs for other forms
};

export const getFormConfig = (formNumber: string): FormConfig => {
  return formConfigs[formNumber] || {
    biaSections: [],
    ccaaSections: [],
    osbDirectives: [],
    validationRules: {}
  };
};
