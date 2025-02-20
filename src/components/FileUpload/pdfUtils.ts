
import * as pdfjs from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = pdfjs.DefaultWorkerMessageHandler;

// Financial and legal terms glossary for better recognition
const FINANCIAL_TERMS = new Set([
  'absolute discharge', 'bankruptcy', 'consumer proposal', 'discharge', 'trustee',
  'creditor', 'debtor', 'dividend', 'estate', 'insolvency', 'liquidation',
  'proposal', 'receiver', 'secured creditor', 'unsecured creditor', 'stay of proceedings',
  'administrator', 'assignment', 'bankrupt', 'claims', 'court order', 'debt',
  'income tax', 'interest', 'judgment', 'liability', 'lien', 'mortgage',
  'official receiver', 'petition', 'rehabilitation', 'reorganization', 'surplus'
]);

// Helper function to check if page contains actual text content
const isScannedPage = async (page: any): Promise<boolean> => {
  try {
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => item.str)
      .join('')
      .trim();
    return text.length < 50; // If less than 50 characters, likely a scanned page
  } catch (error) {
    console.error('Error checking if page is scanned:', error);
    return true; // Assume scanned if we can't extract text
  }
};

// Function to convert PDF page to image data with enhanced resolution
const pageToImage = async (page: any): Promise<string> => {
  try {
    const scale = 3.0; // Higher scale for better OCR results with small text
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({
      canvasContext: context,
      viewport: viewport,
      intent: 'print' // Better quality for text
    }).promise;
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error converting page to image:', error);
    throw error;
  }
};

// Enhanced text cleaning and correction
const cleanExtractedText = (text: string): string => {
  // Common OCR mistakes in financial documents
  const corrections: { [key: string]: string } = {
    'bankruptcv': 'bankruptcy',
    'credltor': 'creditor',
    'dlscharge': 'discharge',
    'trustce': 'trustee',
    'proposol': 'proposal',
    'recelver': 'receiver',
  };

  let cleanedText = text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s-.,()]/g, '') // Remove special characters except common punctuation
    .trim();

  // Apply corrections for common OCR mistakes
  Object.entries(corrections).forEach(([mistake, correction]) => {
    cleanedText = cleanedText.replace(new RegExp(mistake, 'gi'), correction);
  });

  return cleanedText;
};

// Function to perform OCR with enhanced financial term recognition
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

export const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    console.log('Starting PDF text extraction...');
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Processing page ${i} of ${pdf.numPages}`);
      const page = await pdf.getPage(i);
      
      try {
        // First try to get text directly
        const content = await page.getTextContent();
        let pageText = content.items
          .map((item: any) => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        // If page appears to be scanned (little or no text), use OCR
        if (await isScannedPage(page)) {
          console.log(`Page ${i} appears to be scanned, attempting OCR...`);
          const imageData = await pageToImage(page);
          pageText = await performOCR(imageData);
          console.log(`OCR completed for page ${i}`);
        }
        
        text += pageText + '\n';
      } catch (pageError) {
        console.error(`Error processing page ${i}:`, pageError);
        // Continue with next page instead of failing completely
        text += `[Error processing page ${i}]\n`;
      }
    }
    
    console.log('PDF text extraction completed successfully');
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};
