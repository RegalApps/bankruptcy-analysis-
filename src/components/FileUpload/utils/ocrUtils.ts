
import Tesseract from 'tesseract.js';
import { FINANCIAL_TERMS } from './constants';

// Helper function to clean and correct extracted text
const cleanExtractedText = (text: string): string => {
  console.log('Cleaning extracted text:', text.substring(0, 200));
  
  const corrections: { [key: string]: string } = {
    'bankruptcv': 'bankruptcy',
    'credltor': 'creditor',
    'dlscharge': 'discharge',
    'trustce': 'trustee',
    'proposol': 'proposal',
    'recelver': 'receiver',
    'bankrupcty': 'bankruptcy',
    'lnsolvency': 'insolvency',
    'llquidation': 'liquidation',
    'mortgaqe': 'mortgage',
    'petltlon': 'petition',
    'lnterest': 'interest',
    'slgned': 'signed',
    'certlficate': 'certificate',
    'asslgnment': 'assignment'
  };

  // Initial cleaning
  let cleanedText = text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-.,()$%]/g, ' ')
    .trim();

  // Apply corrections
  Object.entries(corrections).forEach(([mistake, correction]) => {
    cleanedText = cleanedText.replace(new RegExp(mistake, 'gi'), correction);
  });

  // Standardize number formats
  cleanedText = cleanedText.replace(/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/, '$1');

  // Standardize form references
  cleanedText = cleanedText.replace(/form\s*#?\s*(\d+)/gi, 'Form $1');
  
  // Standardize date formats
  cleanedText = cleanedText.replace(
    /(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})/g,
    (_, d, m, y) => `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
  );

  console.log('Cleaned text result:', cleanedText.substring(0, 200));
  return cleanedText;
};

export const performOCR = async (imageData: string): Promise<string> => {
  try {
    console.log('Starting OCR process...');
    
    const result = await Tesseract.recognize(
      imageData,
      'eng',
      {
        logger: m => console.log('Tesseract progress:', m)
      }
    );
    
    console.log('OCR completed. Raw text length:', result.data.text.length);
    console.log('Sample of raw OCR text:', result.data.text.substring(0, 200));

    let extractedText = result.data.text;
    extractedText = cleanExtractedText(extractedText);

    // Enhance recognition of financial terms
    FINANCIAL_TERMS.forEach(term => {
      const termRegex = new RegExp(`\\b${term.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      extractedText = extractedText.replace(termRegex, term);
    });

    console.log('Final processed text length:', extractedText.length);
    console.log('Sample of final processed text:', extractedText.substring(0, 200));

    return extractedText;
  } catch (error) {
    console.error('Error performing OCR:', error);
    throw error;
  }
};

