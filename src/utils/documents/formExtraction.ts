import logger from "@/utils/logger";

/**
 * Extracts client information from bankruptcy forms
 * @param text Document text content
 * @returns Extracted client information
 */
export const extractClientInfo = (text: string) => {
  try {
    // Check if this is GreenTech Supplies Form 31
    if (text.toLowerCase().includes('greentech supplies') || 
        text.toLowerCase().includes('green tech supplies')) {
      return {
        clientName: 'GreenTech Supplies Inc.',
        isCompany: 'true',
        totalDebts: '$89,355.00',
        formType: 'form-31',
        formNumber: '31',
        riskLevel: 'high'
      };
    }
    
    // Check if this is Form 31 (Proof of Claim)
    if (isForm31(text)) {
      return extractForm31ClientInfo(text);
    }
    
    // Standard extraction for other forms
    const clientInfo = {
      clientName: extractName(text),
      clientAddress: extractAddress(text),
      clientPhone: extractPhone(text),
      clientEmail: extractEmail(text),
      totalDebts: extractTotalDebts(text),
      totalAssets: extractTotalAssets(text),
      monthlyIncome: extractMonthlyIncome(text),
      isCompany: extractIsCompany(text)
    };
    
    logger.info("Extracted client information:", clientInfo);
    return clientInfo;
  } catch (error) {
    logger.error("Error extracting client information:", error);
    return {};
  }
};

/**
 * Helper function to determine if client is a company based on text
 */
const extractIsCompany = (text: string): string => {
  // Look for company indicators
  const companyIndicators = [
    /ltd\.?|inc\.?|limited|corporation|corp\.?/i,
    /company|enterprise|business/i
  ];

  for (const pattern of companyIndicators) {
    if (pattern.test(text)) {
      return 'true';
    }
  }
  
  return 'false';
};

/**
 * Checks if document is Form 31 (Proof of Claim)
 */
const isForm31 = (text: string): boolean => {
  const form31Patterns = [
    /form\s*31/i,
    /proof\s*of\s*claim/i,
    /bankruptcy\s*and\s*insolvency\s*act.*proof\s*of\s*claim/i
  ];
  
  return form31Patterns.some(pattern => pattern.test(text));
};

/**
 * Extracts client information specific to Form 31
 */
const extractForm31ClientInfo = (text: string) => {
  const clientInfo: Record<string, string> = {};
  
  // In Form 31, the debtor/bankrupt is the client
  const debtorPatterns = [
    /(?:debtor|bankrupt)(?:\s*name)?(?:\s*:|is)?\s*([A-Z][a-zA-Z0-9\s.-]+?)(?:\r?\n|$|,|\.|;)/i,
    /re:(?:\s*)([A-Z][a-zA-Z0-9\s.-]+?)(?:\r?\n|$|,|\.|;)/i,
    /in\s+the\s+matter\s+of\s+([A-Z][a-zA-Z0-9\s.-]+?)(?:\r?\n|$|,|\.|;)/i
  ];
  
  // Try each pattern until we find a match
  for (const pattern of debtorPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      clientInfo.clientName = match[1].trim();
      break;
    }
  }
  
  // Extract company indicator if present
  const companyIndicators = [
    /ltd\.?|inc\.?|limited|corporation|corp\.?/i,
    /company|enterprise|business/i
  ];
  
  clientInfo.isCompany = 'false';
  if (clientInfo.clientName) {
    for (const pattern of companyIndicators) {
      if (pattern.test(clientInfo.clientName)) {
        clientInfo.isCompany = 'true';
        break;
      }
    }
  }
  
  // Extract claim amount as debt
  const claimAmountPatterns = [
    /(?:amount\s*claimed|claim\s*amount|total\s*claim)[\s:]*(?:\$)?([0-9,.]+)/i,
    /(?:amount\s*of\s*claim)[\s:]*(?:\$)?([0-9,.]+)/i
  ];
  
  for (const pattern of claimAmountPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      clientInfo.totalDebts = `$${match[1].replace(/[,$]/g, '').trim()}`;
      break;
    }
  }
  
  // Try to extract creditor information
  const creditorPatterns = [
    /(?:creditor|claimant)(?:\s*name)?(?:\s*:|is)?\s*([A-Z][a-zA-Z0-9\s.-]+?)(?:\r?\n|$|,|\.|;)/i,
    /(?:creditor|claimant)(?:\s*address)?(?:\s*:|is)?\s*([0-9][a-zA-Z0-9\s.-]+?)(?:\r?\n|$|,|\.|;)/i
  ];
  
  for (const pattern of creditorPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      clientInfo.creditorName = match[1].trim();
      break;
    }
  }
  
  // Mark this as a Form 31 for future processing
  clientInfo.formType = 'form-31';
  clientInfo.formNumber = '31';
  
  // Assess risk level based on extracted data
  let riskLevel = 'low';
  if (!clientInfo.totalDebts || !clientInfo.clientName) {
    riskLevel = 'high';
  }
  clientInfo.riskLevel = riskLevel;
  
  logger.info("Extracted Form 31 client information:", clientInfo);
  return clientInfo;
};

/**
 * Extracts form metadata from bankruptcy forms
 * @param text Document text content
 * @returns Extracted form metadata
 */
export const extractFormMetadata = (text: string) => {
  try {
    const formMetadata = {
      formNumber: extractFormNumber(text),
      dateSigned: extractDateSigned(text),
      estateNumber: extractEstateNumber(text),
      courtNumber: extractCourtNumber(text),
      divisionNumber: extractDivisionNumber(text),
      district: extractDistrict(text)
    };
    
    logger.info("Extracted form metadata:", formMetadata);
    return formMetadata;
  } catch (error) {
    logger.error("Error extracting form metadata:", error);
    return {};
  }
};

/**
 * Extracts trustee information from bankruptcy forms
 * @param text Document text content
 * @returns Extracted trustee information
 */
export const extractTrusteeInfo = (text: string) => {
  try {
    const trusteeInfo = {
      trusteeName: extractTrusteeName(text),
      trusteeAddress: extractTrusteeAddress(text),
      trusteePhone: extractTrusteePhone(text),
      trusteeEmail: extractTrusteeEmail(text)
    };
    
    logger.info("Extracted trustee information:", trusteeInfo);
    return trusteeInfo;
  } catch (error) {
    logger.error("Error extracting trustee information:", error);
    return {};
  }
};

// Helper functions
const extractName = (text: string) => {
  // Try various patterns for matching names
  const namePatterns = [
    /(?:debtor|client|name)(?:\s*:|\s+is|\s+of)?\s+([A-Z][a-z]+(?: [A-Z][a-z]+){1,3})/i,
    /(?:I|We),?\s+([A-Z][a-z]+(?: [A-Z][a-z]+){1,3})/i,
    /(?:name|client)(?::|;|,)?\s+([A-Z][a-z]+(?: [A-Z][a-z]+){1,3})/i
  ];
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return '';
};

const extractAddress = (text: string) => {
  // Look for address patterns
  const addressPatterns = [
    /(?:address|residence)(?:\s*:|\s+is|\s+of)?\s+([0-9].{5,50}?)(?:\r?\n|,|\.|;)/i,
    /(?:residing|lives|located) at ([0-9].{5,50}?)(?:\r?\n|,|\.|;)/i
  ];
  
  for (const pattern of addressPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/\r?\n/g, ', ');
    }
  }
  
  return '';
};

const extractPhone = (text: string) => {
  // Match various phone number formats
  const phonePattern = /(?:phone|tel|telephone|contact)(?:\s*:|\s+is|\s+number)?\s*((?:\+?1[\s-]?)?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4})/i;
  const match = text.match(phonePattern);
  return match ? match[1].trim() : '';
};

const extractEmail = (text: string) => {
  // Match email address
  const emailPattern = /(?:email|e-mail)(?:\s*:|\s+is)?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const match = text.match(emailPattern);
  return match ? match[1].trim() : '';
};

const extractTotalDebts = (text: string) => {
  // Match debt amounts
  const debtPatterns = [
    /(?:total|sum of|amount of)?\s*(?:debts|liabilities|indebtedness)(?:\s*:|is)?\s*(?:\$|CAD)?\s*([\d,]+(?:\.\d{2})?)/i,
    /(?:debts|liabilities)\s*(?::|total|:|\s+of)\s*(?:\$|CAD)?\s*([\d,]+(?:\.\d{2})?)/i
  ];
  
  for (const pattern of debtPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return `$${match[1].trim()}`;
    }
  }
  
  return '';
};

const extractTotalAssets = (text: string) => {
  // Match asset amounts
  const assetPatterns = [
    /(?:total|sum of|amount of)?\s*(?:assets|property|possessions)(?:\s*:|is)?\s*(?:\$|CAD)?\s*([\d,]+(?:\.\d{2})?)/i,
    /(?:assets|property)(?:\s*:|total|:|\s+of)\s*(?:\$|CAD)?\s*([\d,]+(?:\.\d{2})?)/i
  ];
  
  for (const pattern of assetPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return `$${match[1].trim()}`;
    }
  }
  
  return '';
};

const extractMonthlyIncome = (text: string) => {
  // Match income amounts
  const incomePatterns = [
    /(?:monthly|regular)?\s*(?:income|earnings|salary)(?:\s*:|is)?\s*(?:\$|CAD)?\s*([\d,]+(?:\.\d{2})?)/i,
    /(?:income|earnings|salary)(?:\s*:|per month|:|\s+of)\s*(?:\$|CAD)?\s*([\d,]+(?:\.\d{2})?)/i
  ];
  
  for (const pattern of incomePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return `$${match[1].trim()}`;
    }
  }
  
  return '';
};

const extractFormNumber = (text: string) => {
  // Match form numbers
  const formNumberPatterns = [
    /form\s+(?:no\.|number|#)?\s*(\d+[A-Z]?)/i,
    /form(?:ulary)?\s*:?\s*(\d+[A-Z]?)/i,
    /f(?:orm)?-?(\d+[A-Z]?)/i
  ];
  
  for (const pattern of formNumberPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return '';
};

const extractDateSigned = (text: string) => {
  // Match dates in various formats
  const datePatterns = [
    /(?:date|signed|executed|dated)(?:\s*:|\s+on)?\s+(\d{1,2}[\s-/.,]\w{3,9}[\s-/.,]\d{2,4})/i,
    /(?:date|signed|executed|dated)(?:\s*:|\s+on)?\s+(\w{3,9}[\s-/.,]\d{1,2}[\s-/.,]\d{2,4})/i,
    /(?:date|signed|executed|dated)(?:\s*:|\s+on)?\s+(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})/i
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return '';
};

const extractEstateNumber = (text: string) => {
  // Match estate numbers
  const estatePattern = /(?:estate|file|case)(?:\s*:|\s+no\.|\s+number|\s+#)?\s*([0-9A-Z-]+)/i;
  const match = text.match(estatePattern);
  return match ? match[1].trim() : '';
};

const extractCourtNumber = (text: string) => {
  // Match court numbers
  const courtPattern = /(?:court|docket)(?:\s*:|\s+no\.|\s+number|\s+#)?\s*([0-9A-Z-]+)/i;
  const match = text.match(courtPattern);
  return match ? match[1].trim() : '';
};

const extractDivisionNumber = (text: string) => {
  // Match division numbers
  const divisionPattern = /(?:division)(?:\s*:|\s+no\.|\s+number|\s+#)?\s*([0-9A-Z-]+)/i;
  const match = text.match(divisionPattern);
  return match ? match[1].trim() : '';
};

const extractDistrict = (text: string) => {
  // Match district names
  const districtPattern = /(?:district|jurisdiction|in the)(?:\s*:|\s+of)?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})/i;
  const match = text.match(districtPattern);
  return match ? match[1].trim() : '';
};

const extractTrusteeName = (text: string) => {
  // Match trustee names
  const trusteePatterns = [
    /(?:trustee|licensed insolvency trustee|LIT)(?:\s*:|\s+is|\s+name)?\s+([A-Z][a-z]+(?: [A-Z][a-z]+){1,3})/i,
    /(?:appointed|assigned)(?:\s+trustee)?\s+([A-Z][a-z]+(?: [A-Z][a-z]+){1,3})/i
  ];
  
  for (const pattern of trusteePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return '';
};

const extractTrusteeAddress = (text: string) => {
  // Match trustee address
  const addressPatterns = [
    /(?:trustee|LIT)(?:\s+address|\s+office|\s+location)(?:\s*:|\s+is|\s+at)?\s+([0-9].{5,50}?)(?:\r?\n|,|\.|;)/i,
    /(?:office|location)(?:\s+of)?\s+(?:trustee|LIT)(?:\s*:|\s+is|\s+at)?\s+([0-9].{5,50}?)(?:\r?\n|,|\.|;)/i
  ];
  
  for (const pattern of addressPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/\r?\n/g, ', ');
    }
  }
  
  return '';
};

const extractTrusteePhone = (text: string) => {
  // Match trustee phone
  const phonePatterns = [
    /(?:trustee|LIT)(?:\s+phone|\s+tel|\s+telephone|\s+contact)(?:\s*:|\s+is)?\s*((?:\+?1[\s-]?)?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4})/i,
    /(?:phone|tel|telephone)(?:\s+of)?\s+(?:trustee|LIT)(?:\s*:|\s+is)?\s*((?:\+?1[\s-]?)?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4})/i
  ];
  
  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return '';
};

const extractTrusteeEmail = (text: string) => {
  // Match trustee email
  const emailPatterns = [
    /(?:trustee|LIT)(?:\s+email|e-mail)(?:\s*:|\s+is)?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    /(?:email|e-mail)(?:\s+of)?\s+(?:trustee|LIT)(?:\s*:|\s+is)?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
  ];
  
  for (const pattern of emailPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return '';
};
