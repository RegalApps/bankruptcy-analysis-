import * as pdfjs from 'pdfjs-dist';
import { PDF_CONFIG } from './utils/pdfConfig';
import { isScannedPage, pageToImage } from './utils/pdfPageUtils';
import { performOCR } from './utils/ocrUtils';
import { PdfTextContent, PdfTextItem, PageError, TextExtractionResult } from './utils/pdfTypes';

const isProduction = process.env.NODE_ENV === 'production';

const log = {
  info: (...args: any[]) => {
    if (!isProduction) console.log(...args);
  },
  error: (...args: any[]) => console.error(...args)
};

// Initialize PDF.js worker with a single, clear configuration
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<TextExtractionResult> => {
  try {
    log.info('Starting PDF text extraction...');
    
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Invalid PDF data received');
    }
    
    log.info('Loading PDF document...');
    const pdf = await pdfjs.getDocument({
      data: arrayBuffer,
      ...PDF_CONFIG
    }).promise;
    
    log.info(`PDF loaded successfully. Total pages: ${pdf.numPages}`);
    
    const result: TextExtractionResult = {
      text: '',
      successfulPages: 0,
      totalPages: pdf.numPages,
      errors: []
    };
    
    // Process pages sequentially to avoid overwhelming resources
    for (let i = 1; i <= pdf.numPages; i++) {
      log.info(`Processing page ${i} of ${pdf.numPages}`);
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
          log.info(`Page ${i} has low text content (${pageText.length} chars), attempting OCR...`);
          try {
            const imageData = await pageToImage(page);
            pageText = await performOCR(imageData);
            log.info(`OCR completed for page ${i}, extracted ${pageText.length} chars`);
          } catch (ocrError) {
            log.error(`OCR failed for page ${i}:`, ocrError);
            result.errors.push({
              pageNum: i,
              error: new Error(`OCR failed: ${(ocrError as Error).message}`)
            });
            // Keep the limited text we got from direct extraction
          }
        }
        
        result.text += pageText + '\n';
        result.successfulPages++;
        log.info(`Successfully processed page ${i}, text length: ${pageText.length}`);
      } catch (pageError) {
        log.error(`Error processing page ${i}:`, pageError);
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
    
    log.info(`PDF text extraction completed. Successfully processed ${result.successfulPages} of ${result.totalPages} pages`);
    return result;
  } catch (error) {
    log.error('Error extracting text from PDF:', error);
    throw error;
  }
};
