
import * as pdfjs from 'pdfjs-dist';
import logger from "@/utils/logger";

export const extractTextFromPdf = async (url: string): Promise<string> => {
  try {
    logger.info('Starting PDF text extraction from:', url);
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
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      logger.debug(`Processing page ${i} of ${pdf.numPages}`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    logger.info('Text extraction complete. Length:', fullText.length);
    return fullText;
  } catch (error: any) {
    logger.error('PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};
