
import Tesseract from 'tesseract.js';
import { FINANCIAL_TERMS } from './constants';

// Helper function to clean and correct extracted text
const cleanExtractedText = (text: string): string => {
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
    'petltlon': 'petition'
  };

  let cleanedText = text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s-.,()$%]/g, '')
    .trim();

  Object.entries(corrections).forEach(([mistake, correction]) => {
    cleanedText = cleanedText.replace(new RegExp(mistake, 'gi'), correction);
  });

  cleanedText = cleanedText.replace(/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/, '$1');

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
    
    console.log('OCR completed successfully');

    let extractedText = result.data.text;
    extractedText = cleanExtractedText(extractedText);

    FINANCIAL_TERMS.forEach(term => {
      const termRegex = new RegExp(`\\b${term.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      extractedText = extractedText.replace(termRegex, term);
    });

    return extractedText;
  } catch (error) {
    console.error('Error performing OCR:', error);
    throw error;
  }
};
