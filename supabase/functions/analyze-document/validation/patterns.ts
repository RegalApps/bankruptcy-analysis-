
export const validationPatterns = {
  // Personal Information
  sinNumber: /^\d{3}-\d{3}-\d{3}$/,
  phoneNumber: /^\+?1?\d{10}$/,
  postalCode: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
  
  // Financial Information
  currencyAmount: /^\$?\d+(,\d{3})*(\.\d{2})?$/,
  percentage: /^(100(\.0+)?|\d{1,2}(\.\d+)?)%?$/,
  
  // Dates
  dateFormat: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  
  // Legal References
  estateNumber: /^\d{2}-\d{6}$/,
  courtFileNumber: /^[A-Z]{2}-\d{2}-\d{6}$/,
  
  // Document Numbers
  formNumber: /^(Form\s)?\d{1,2}$/i,
  referenceNumber: /^[A-Z]{2,4}-\d{6,8}$/
};

export const customValidators = {
  isValidAmount: (value: string) => {
    if (!validationPatterns.currencyAmount.test(value)) return false;
    const amount = parseFloat(value.replace(/[$,]/g, ''));
    return amount >= 0;
  },
  
  isValidDate: (value: string) => {
    if (!validationPatterns.dateFormat.test(value)) return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  },
  
  isValidPercentage: (value: string) => {
    if (!validationPatterns.percentage.test(value)) return false;
    const percentage = parseFloat(value.replace('%', ''));
    return percentage >= 0 && percentage <= 100;
  }
};
