export const validationPatterns = {
  postalCode: {
    CA: '^[ABCEGHJ-NPRSTVXY]\\d[ABCEGHJ-NPRSTV-Z][ -]?\\d[ABCEGHJ-NPRSTV-Z]\\d$',
    US: '^\\d{5}(-\\d{4})?$'
  },
  phoneNumber: {
    standard: '^(?:\\+1|1)?[-. ]?\\(?[0-9]{3}\\)?[-. ]?[0-9]{3}[-. ]?[0-9]{4}$',
    international: '^\\+(?:[0-9] ?){6,14}[0-9]$'
  },
  email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
  sinNumber: '^\\d{3}-\\d{3}-\\d{3}$',
  businessNumber: {
    corporation: '^\\d{9}[A-Z]{2}\\d{4}$',
    partnership: '^\\d{9}[P][A-Z]\\d{4}$',
    trust: '^\\d{9}[T][A-Z]\\d{4}$'
  },
  courtFileNumber: '^[A-Z]{2}-\\d{2}-\\d{5}-[A-Z]{2}$',
  currencyAmount: '^\\$?\\d{1,3}(?:,\\d{3})*(?:\\.\\d{2})?$',
  percentageValue: '^\\d{1,3}(?:\\.\\d{1,2})?%?$',
  legalEntityName: '^[A-Za-z0-9\\s.,&\'()-]{1,100}$',
  estateNumber: '^[A-Z]{2}\\d{8}$',
  taxID: {
    business: '^\\d{2}-\\d{7}$',
    trust: '^T-\\d{8}$',
    partnership: '^P-\\d{8}$'
  },
  insurancePolicy: '^[A-Z]{2}-\\d{6}-[A-Z]{2}$',
  mortgageNumber: '^M-\\d{4}-[A-Z]{2}-\\d{6}$',
  assetTag: '^AT\\d{6}[A-Z]$',
  employeeCount: '^\\d{1,6}$',
  jurisdictionCode: '^[A-Z]{2}-[A-Z]{3}$',
  industryCode: '^[A-Z]{4}\\d{4}$'
};
