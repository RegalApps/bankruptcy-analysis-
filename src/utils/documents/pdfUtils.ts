
import * as pdfjs from 'pdfjs-dist';
import logger from "@/utils/logger";

// Create a simple cache for PDF text extraction
const textExtractionCache = new Map<string, { text: string, timestamp: number }>();
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

export const extractTextFromPdf = async (url: string): Promise<string> => {
  try {
    // Check cache first
    const now = Date.now();
    const cachedResult = textExtractionCache.get(url);
    
    if (cachedResult && (now - cachedResult.timestamp < CACHE_EXPIRY)) {
      logger.info('Using cached PDF text for:', url);
      return cachedResult.text;
    }
    
    logger.info('Starting PDF text extraction from:', url);
    const startTime = performance.now();
    
    // Add additional logging and validation
    if (!url || typeof url !== 'string' || !url.trim()) {
      throw new Error('Invalid PDF URL provided');
    }
    
    logger.info('Fetching PDF from:', url);
    const response = await fetch(url, {
      cache: 'no-store', // Prevent caching issues
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to get error details');
      logger.error(`Failed to fetch PDF: ${response.status} ${response.statusText}. Details: ${errorText}`);
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    logger.info('PDF fetched, arrayBuffer size:', arrayBuffer.byteLength);
    
    if (arrayBuffer.byteLength === 0) {
      throw new Error('PDF file is empty');
    }
    
    // Initialize PDF.js worker if not already initialized
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      const workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    }
    
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    logger.info('PDF loaded, pages:', pdf.numPages);
    
    // Process pages in parallel for better performance
    const pagePromises = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      pagePromises.push(extractPageText(pdf, i));
    }
    
    const pageTexts = await Promise.all(pagePromises);
    const fullText = pageTexts.join('\n');
    
    const endTime = performance.now();
    logger.info(`Text extraction complete. Length: ${fullText.length}, Time: ${(endTime - startTime).toFixed(0)}ms`);
    
    if (fullText.trim().length === 0) {
      logger.warn('Extracted text is empty');
    }
    
    // Cache the result
    textExtractionCache.set(url, { text: fullText, timestamp: now });
    
    return fullText;
  } catch (error: any) {
    logger.error('PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

async function extractPageText(pdf: any, pageNum: number): Promise<string> {
  try {
    logger.debug(`Processing page ${pageNum} of ${pdf.numPages}`);
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    return textContent.items
      .map((item: any) => item.str)
      .join(' ');
  } catch (error) {
    logger.error(`Error extracting text from page ${pageNum}:`, error);
    return '';
  }
}
