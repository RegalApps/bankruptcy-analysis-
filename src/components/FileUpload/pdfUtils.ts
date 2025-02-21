import * as pdfjs from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Configure PDF.js worker with fallback options and retry mechanism
const loadWorker = async () => {
  const maxAttempts = 3;
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      const workerUrl = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
      console.log(`Attempt ${attempt + 1}: Loading PDF.js worker from:`, workerUrl);
      
      const response = await fetch(workerUrl);
      if (!response.ok) throw new Error(`Failed to fetch worker: ${response.statusText}`);
      
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      console.log('Successfully loaded PDF.js worker');
      return true;
    } catch (error) {
      console.warn(`Attempt ${attempt + 1} failed:`, error);
      attempt++;
      
      if (attempt === maxAttempts) {
        console.warn('All worker load attempts failed, using fake worker');
        (pdfjs as any).GlobalWorkerOptions.disableWorker = true;
        return false;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  return false;
};

// Initialize worker immediately and track its state
let workerInitialized = false;
let workerInitialization: Promise<boolean>;

const initializeWorker = async () => {
  if (!workerInitialization) {
    workerInitialization = loadWorker().then(success => {
      workerInitialized = success;
      return success;
    });
  }
  return workerInitialization;
};

initializeWorker();

// Ensure worker is ready before processing
const ensureWorkerLoaded = async () => {
  if (!workerInitialized) {
    await initializeWorker();
  }
  return workerInitialized;
};

// Financial and legal terms glossary for better recognition
const FINANCIAL_TERMS = new Set([
  'absolute discharge', 'bankruptcy', 'consumer proposal', 'discharge', 'trustee',
  'creditor', 'debtor', 'dividend', 'estate', 'insolvency', 'liquidation',
  'proposal', 'receiver', 'secured creditor', 'unsecured creditor', 'stay of proceedings',
  'administrator', 'assignment', 'bankrupt', 'claims', 'court order', 'debt',
  'income tax', 'interest', 'judgment', 'liability', 'lien', 'mortgage',
  'official receiver', 'petition', 'rehabilitation', 'reorganization', 'surplus'
]);

// Helper function to check if page contains actual text content with better threshold
const isScannedPage = async (page: any): Promise<boolean> => {
  try {
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => item.str)
      .join('')
      .trim();
    
    // More sophisticated check for scanned pages
    const hasMinimalText = text.length < 100;
    const containsMainlyNumbers = /^\d+$/.test(text.replace(/\D/g, ''));
    
    return hasMinimalText || containsMainlyNumbers;
  } catch (error) {
    console.error('Error checking if page is scanned:', error);
    return true; // Assume scanned if we can't extract text
  }
};

// Function to convert PDF page to image data with enhanced resolution and quality
const pageToImage = async (page: any): Promise<string> => {
  try {
    const scale = 2.0; // Balanced scale for good OCR results without excessive memory usage
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { 
      alpha: false,
      willReadFrequently: true 
    });
    
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Use improved rendering options
    await page.render({
      canvasContext: context,
      viewport: viewport,
      intent: 'print',
      background: 'white'
    }).promise;
    
    return canvas.toDataURL('image/png', 1.0); // Maximum quality
  } catch (error) {
    console.error('Error converting page to image:', error);
    throw error;
  }
};

// Enhanced text cleaning and correction with improved accuracy
const cleanExtractedText = (text: string): string => {
  // Expanded corrections for common OCR mistakes in financial documents
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
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[^\w\s-.,()$%]/g, '') // Remove special characters except common ones in financial docs
    .trim();

  // Apply corrections for common OCR mistakes
  Object.entries(corrections).forEach(([mistake, correction]) => {
    cleanedText = cleanedText.replace(new RegExp(mistake, 'gi'), correction);
  });

  // Improve number and currency value recognition
  cleanedText = cleanedText.replace(/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/, '$1');

  return cleanedText;
};

// Function to perform OCR with enhanced recognition and error handling
const performOCR = async (imageData: string): Promise<string> => {
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
    
    // Clean and correct the extracted text
    extractedText = cleanExtractedText(extractedText);

    // Improve recognition of financial terms
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

// Helper function to validate extracted text
const validateExtractedText = (text: string): boolean => {
  // Check if text contains any substantial content
  if (!text || text.trim().length < 10) return false;
  
  // Check if text contains mostly errors
  const errorCount = (text.match(/\[Error processing page/g) || []).length;
  const lines = text.split('\n').length;
  
  return errorCount < lines / 2; // Less than 50% of pages failed
};

export const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    console.log('Starting PDF text extraction...');
    
    // Ensure worker is loaded
    const workerLoaded = await ensureWorkerLoaded();
    if (!workerLoaded) {
      console.warn('Using fallback worker mode - performance may be reduced');
    }
    
    // Validate input
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Invalid PDF data received');
    }
    
    // Initialize PDF document with verbose logging
    console.log('Loading PDF document...');
    const pdf = await pdfjs.getDocument({
      data: arrayBuffer,
    }).promise;
    
    console.log(`PDF loaded successfully. Total pages: ${pdf.numPages}`);
    let text = '';
    let successfulPages = 0;
    
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Processing page ${i} of ${pdf.numPages}`);
      const page = await pdf.getPage(i);
      
      try {
        const content = await page.getTextContent();
        let pageText = content.items
          .map((item: any) => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (await isScannedPage(page)) {
          console.log(`Page ${i} appears to be scanned or has low text content, attempting OCR...`);
          const imageData = await pageToImage(page);
          pageText = await performOCR(imageData);
          console.log(`OCR completed for page ${i}`);
        }
        
        text += pageText + '\n';
        successfulPages++;
        console.log(`Successfully extracted text from page ${i}`);
      } catch (pageError) {
        console.error(`Error processing page ${i}:`, pageError);
        text += `[Error processing page ${i}]\n`;
      }
    }
    
    // Validate extracted text
    if (!validateExtractedText(text)) {
      throw new Error('Failed to extract meaningful text from the PDF');
    }
    
    console.log(`PDF text extraction completed. Successfully processed ${successfulPages} of ${pdf.numPages} pages`);
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};
