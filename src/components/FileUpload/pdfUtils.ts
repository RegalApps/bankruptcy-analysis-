
import * as pdfjs from 'pdfjs-dist';
import { PDF_CONFIG } from './utils/pdfConfig';
import { isScannedPage, pageToImage } from './utils/pdfPageUtils';
import { performOCR } from './utils/ocrUtils';

// Initialize PDF.js worker with a single, clear configuration
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    console.log('Starting PDF text extraction...');
    
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Invalid PDF data received');
    }
    
    console.log('Loading PDF document...');
    const pdf = await pdfjs.getDocument({
      data: arrayBuffer,
      ...PDF_CONFIG
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
        
        // If text extraction yields little content, try OCR
        if (pageText.length < 100) {
          console.log(`Page ${i} has low text content (${pageText.length} chars), attempting OCR...`);
          try {
            const imageData = await pageToImage(page);
            pageText = await performOCR(imageData);
            console.log(`OCR completed for page ${i}, extracted ${pageText.length} chars`);
          } catch (ocrError) {
            console.error(`OCR failed for page ${i}:`, ocrError);
            // Keep the limited text we got from direct extraction
          }
        }
        
        text += pageText + '\n';
        successfulPages++;
        console.log(`Successfully processed page ${i}, text length: ${pageText.length}`);
      } catch (pageError) {
        console.error(`Error processing page ${i}:`, pageError);
        text += `[Error processing page ${i}]\n`;
      }
    }
    
    if (!text || text.trim().length < 10) {
      throw new Error('No meaningful text could be extracted from the PDF');
    }
    
    console.log(`PDF text extraction completed. Successfully processed ${successfulPages} of ${pdf.numPages} pages`);
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};
