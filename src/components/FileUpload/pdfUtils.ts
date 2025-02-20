
import * as pdfjs from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Set worker source to a CDN URL since the direct import isn't working
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
  const content = await page.getTextContent();
  const text = content.items
    .map((item: any) => item.str)
    .join('')
    .trim();
  return text.length < 50; // If less than 50 characters, likely a scanned page
};

// Function to convert PDF page to image data with enhanced resolution
const pageToImage = async (page: any): Promise<string> => {
  const scale = 3.0; // Higher scale for better OCR results with small text
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  
  await page.render({
    canvasContext: context!,
    viewport: viewport,
    intent: 'print' // Better quality for text
  }).promise;
  
  return canvas.toDataURL('image/png');
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
  const result = await Tesseract.recognize(
    imageData,
    'eng',
    {
      logger: m => console.log(m)
    }
  );

  let extractedText = result.data.text;
  
  // Clean and correct the extracted text
  extractedText = cleanExtractedText(extractedText);

  // Improve recognition of financial terms
  FINANCIAL_TERMS.forEach(term => {
    const termRegex = new RegExp(`\\b${term.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    extractedText = extractedText.replace(termRegex, term);
  });

  return extractedText;
};

export const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      
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
    }
    
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};
