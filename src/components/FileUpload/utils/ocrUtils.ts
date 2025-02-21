
import Tesseract from 'tesseract.js';
import { FINANCIAL_TERMS } from './constants';

// Helper function to clean and correct extracted text
const cleanExtractedText = (text: string): string => {
  console.log('Input text length:', text.length);
  console.log('Sample input:', text.substring(0, 100));
  
  // Enhanced corrections map
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
    'asslgnment': 'assignment',
    'notlce': 'notice',
    'credlt': 'credit',
    'propertv': 'property'
  };

  // Clean text in stages for better control
  let cleaned = text
    // Remove excess whitespace
    .replace(/\s+/g, ' ')
    // Keep only useful characters
    .replace(/[^\w\s\-.,()$%:/\\]/g, ' ')
    // Fix common OCR issues
    .replace(/[|]/g, 'I')
    .replace(/[{}]/g, '')
    .replace(/(\d)[\s.]+(\d)/g, '$1$2') // Fix split numbers
    .trim();

  // Apply corrections
  Object.entries(corrections).forEach(([mistake, correction]) => {
    const pattern = new RegExp(mistake, 'gi');
    cleaned = cleaned.replace(pattern, correction);
  });

  // Standardize common formats
  cleaned = cleaned
    // Standardize form references
    .replace(/form\s*(?:#|no\.?|number)?\s*(\d+)/gi, 'Form $1')
    // Standardize dates (various formats)
    .replace(/(\d{1,2})\s*[-/.]\s*(\d{1,2})\s*[-/.]\s*(\d{4})/g, 
             (_, d, m, y) => `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`)
    // Fix split words
    .replace(/(\w)-\s+(\w)/g, '$1$2')
    // Standardize dollar amounts
    .replace(/\$\s*(\d+)/g, '$$$1');

  console.log('Cleaned text length:', cleaned.length);
  console.log('Sample cleaned:', cleaned.substring(0, 100));
  
  return cleaned;
};

export const performOCR = async (imageData: string): Promise<string> => {
  try {
    console.log('Starting OCR process...');
    
    // Initialize Tesseract with proper configuration
    const worker = await Tesseract.createWorker({
      logger: m => console.log('Tesseract progress:', m),
      workerPath: '/node_modules/tesseract.js/dist/worker.min.js',
      corePath: '/node_modules/tesseract.js-core/tesseract-core.wasm.js',
      langPath: 'https://tessdata.projectnaptha.com/4.0.0',
    });

    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    const result = await worker.recognize(imageData);
    
    console.log('OCR completed. Raw text length:', result.data.text.length);
    
    let extractedText = result.data.text;
    extractedText = cleanExtractedText(extractedText);

    // Enhance recognition of financial and legal terms
    FINANCIAL_TERMS.forEach(term => {
      const pattern = new RegExp(`\\b${term.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      extractedText = extractedText.replace(pattern, term);
    });

    // Post-process specific document elements
    extractedText = extractedText
      // Fix form titles
      .replace(/(?:^|\n)\s*(Form\s+\d+[A-Z]?)/gi, '\n$1')
      // Fix dollar amounts
      .replace(/\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/g, '$$1')
      // Fix dates
      .replace(/(\d{1,2})\s*(st|nd|rd|th)?\s+(?:day\s+of\s+)?([A-Za-z]+)\s*,?\s*(\d{4})/gi,
               (_, d, suffix, m, y) => `${d} ${m}, ${y}`);

    console.log('Final text length:', extractedText.length);
    console.log('Sample final text:', extractedText.substring(0, 200));
    
    // Cleanup
    await worker.terminate();
    
    return extractedText;
  } catch (error) {
    console.error('Error performing OCR:', error);
    throw error;
  }
};
