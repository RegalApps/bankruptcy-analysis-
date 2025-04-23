/**
 * Centralized PDF.js Configuration
 * 
 * This file contains the configuration for PDF.js used throughout the application.
 * All PDF-related functionality should use this configuration to ensure consistency.
 */

import logger from './logger';
import { pdfjs as reactPdfJs } from 'react-pdf';

// Type assertion to make TypeScript happy with the pdfjs API
// This allows us to use methods like getDocument while still using the version from react-pdf
const pdfjs = reactPdfJs as unknown as typeof import('pdfjs-dist');

// Always use the same pdf.js build that react-pdf is using to avoid version
// mismatches between the main thread and the Web Worker.
// react-pdf re‑exports the pdf.js build it was compiled with under the `pdfjs`
// namespace, so importing from it guarantees perfect compatibility.

// Configure the worker source dynamically so that the version embedded in
// react‑pdf (and therefore available at runtime) is exactly the same version
// loaded by the Web Worker.  Using a mismatched version is the #1 reason for
// the dreaded "Worker message handler threw error" / blank‑screen failures.

// pdfjs.version is exposed by the build shipped with react‑pdf (e.g. "3.11.174").
// Fallback to a sensible default if, for whatever reason, the field is absent.
const PDFJS_VERSION = (pdfjs as any).version ?? '3.11.174';

// Configure worker with CDN primary and local fallback
const configurePdfWorker = () => {
  // Create local fallback path
  const localWorkerPath = '/pdfjs/pdf.worker.min.js';
  const cdnWorkerPath = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;
  
  // Function to set worker source with logging
  const setWorkerSrc = (path: string, source: string) => {
    pdfjs.GlobalWorkerOptions.workerSrc = path;
    logger.info(`PDF.js worker configured with ${source} (version: ${PDFJS_VERSION})`);
  };

  // In development or when we want to test the CDN, try to fetch it first
  if (process.env.NODE_ENV !== 'production' || process.env.FORCE_CDN_WORKER === 'true') {
    try {
      // Create a test request to check CDN availability
      const testRequest = new XMLHttpRequest();
      testRequest.open('HEAD', cdnWorkerPath, false);
      testRequest.send();
      
      if (testRequest.status >= 200 && testRequest.status < 300) {
        // CDN is available, use it
        setWorkerSrc(cdnWorkerPath, 'CDN source');
        return;
      }
    } catch (e) {
      logger.warn('CDN not available for PDF.js worker, falling back to local version');
    }
  }
  
  // Fallback to local worker or default to CDN in production
  if (process.env.NODE_ENV === 'production') {
    setWorkerSrc(cdnWorkerPath, 'CDN source (production)');
  } else {
    setWorkerSrc(localWorkerPath, 'local fallback');
  }
};

// Execute the configuration
configurePdfWorker();

// PDF processing configuration
export const PDF_PROCESSING_CONFIG = {
  cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/cmaps/`,
  cMapPacked: true,
  disableFontFace: false,
  standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/standard_fonts/`
};

/**
 * Extract text from a PDF document
 * @param arrayBuffer PDF file as ArrayBuffer
 * @returns Promise with extracted text
 */
export const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    logger.info('Starting PDF text extraction');
    
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Invalid PDF data received');
    }
    
    logger.info('Loading PDF document');
    const pdf = await pdfjs.getDocument({
      data: arrayBuffer,
      ...PDF_PROCESSING_CONFIG
    }).promise;
    
    logger.info(`PDF loaded successfully. Processing ${pdf.numPages} pages`);
    let text = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      logger.info(`Processing page ${i}`);
      const page = await pdf.getPage(i);
      
      try {
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => item.str)
          .join(' ')
          .replace(/\\s+/g, ' ')
          .trim();
        
        text += pageText + '\\n';
      } catch (pageError) {
        logger.error(`Error processing page ${i}:`, pageError);
        text += `[Error processing page ${i}]\\n`;
      }
    }
    
    if (!text || text.trim().length < 10) {
      throw new Error('No meaningful text could be extracted from the PDF');
    }
    
    logger.info(`PDF processing completed. Extracted ${text.length} characters`);
    return text;
  } catch (error) {
    logger.error('Error in PDF text extraction:', error);
    throw error;
  }
};

// Exporting the configured pdfjs instance can still be handy elsewhere, but the
// primary purpose of this module is its side‑effect (setting workerSrc).
export default pdfjs;
