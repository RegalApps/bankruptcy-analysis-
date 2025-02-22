
import * as pdfjs from 'pdfjs-dist';
import { PDF_CONFIG } from './utils/pdfConfig';
import { isScannedPage, pageToImage } from './utils/pdfPageUtils';
import { performOCR } from './utils/ocrUtils';
import { PdfTextContent, PdfTextItem, PageError, TextExtractionResult } from './utils/pdfTypes';
import logger from '@/utils/logger';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

/**
 * Extracts text content from a PDF file.
 * @param arrayBuffer - The PDF file as an ArrayBuffer
 * @returns TextExtractionResult containing extracted text and processing metadata
 * @throws Error if the PDF data is invalid or no text could be extracted
 */
export const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<TextExtractionResult> => {
  try {
    logger.info('Starting PDF text extraction...');
    
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Invalid PDF data received');
    }
    
    logger.debug('Loading PDF document...');
    const pdf = await pdfjs.getDocument({
      data: arrayBuffer,
      ...PDF_CONFIG
    }).promise;
    
    logger.info(`PDF loaded successfully. Total pages: ${pdf.numPages}`);
    
    const result: TextExtractionResult = {
      text: '',
      successfulPages: 0,
      totalPages: pdf.numPages,
      errors: []
    };
    
    // Process pages sequentially to avoid resource exhaustion
    for (let i = 1; i <= pdf.numPages; i++) {
      logger.debug(`Processing page ${i} of ${pdf.numPages}`);
      const page = await pdf.getPage(i);
      
      try {
        const content = await page.getTextContent() as PdfTextContent;
        let pageText = content.items
          .map((item: PdfTextItem) => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        // If text extraction yields little content, try OCR
        if (pageText.length < 100) {
          logger.debug(`Page ${i} has low text content (${pageText.length} chars), attempting OCR...`);
          try {
            const imageData = await pageToImage(page);
            pageText = await performOCR(imageData);
            logger.debug(`OCR completed for page ${i}, extracted ${pageText.length} chars`);
          } catch (ocrError) {
            logger.error(`OCR failed for page ${i}:`, ocrError);
            result.errors.push({
              pageNum: i,
              error: new Error(`OCR failed: ${(ocrError as Error).message}`)
            });
          }
        }
        
        result.text += pageText + '\n';
        result.successfulPages++;
        logger.debug(`Successfully processed page ${i}, text length: ${pageText.length}`);
      } catch (pageError) {
        logger.error(`Error processing page ${i}:`, pageError);
        result.text += `[Error processing page ${i}]\n`;
        result.errors.push({
          pageNum: i,
          error: pageError as Error
        });
      }
    }
    
    if (!result.text || result.text.trim().length < 10) {
      throw new Error('No meaningful text could be extracted from the PDF');
    }
    
    logger.info(`PDF text extraction completed. Successfully processed ${result.successfulPages} of ${result.totalPages} pages`);
    return result;
  } catch (error) {
    logger.error('Error extracting text from PDF:', error);
    throw error;
  }
};
