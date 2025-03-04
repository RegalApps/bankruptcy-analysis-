
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
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    logger.info('PDF fetched, arrayBuffer size:', arrayBuffer.byteLength);
    
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
