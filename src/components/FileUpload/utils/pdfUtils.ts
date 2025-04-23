// Import the configured pdfjs with worker
import pdfjs from './pdfWorkerConfig';
import { PDF_CONFIG } from './pdfConfig';
import { preprocessDocument } from './documentPreprocessing';
import { extractFormFields, identifyFormType } from './formRecognition';
import { performOCR } from './ocrUtils';

export const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    console.log('Starting enhanced PDF text extraction...');
    
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Invalid PDF data received');
    }
    
    console.log('Loading PDF document with enhanced processing...');
    const pdf = await pdfjs.getDocument({
      data: arrayBuffer,
      ...PDF_CONFIG
    }).promise;
    
    console.log(`PDF loaded successfully. Processing ${pdf.numPages} pages with improved OCR...`);
    let text = '';
    let successfulPages = 0;
    
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Processing page ${i} with enhanced features...`);
      const page = await pdf.getPage(i);
      
      try {
        const content = await page.getTextContent();
        let pageText = content.items
          .map((item: any) => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (pageText.length < 100) {
          console.log(`Enhanced OCR required for page ${i}...`);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            throw new Error('Could not get canvas context');
          }
          
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const preprocessedImage = await preprocessDocument(imageData, {
            enhanceContrast: true,
            deskew: true
          });
          
          pageText = await performOCR(preprocessedImage);
          console.log(`Enhanced OCR completed for page ${i}, extracted ${pageText.length} chars`);
        }
        
        // Process the extracted text
        const formType = identifyFormType(pageText);
        const fields = extractFormFields(pageText);
        
        console.log(`Page ${i} identified as ${formType} form type`);
        console.log('Extracted fields:', fields);
        
        text += pageText + '\n';
        successfulPages++;
      } catch (pageError) {
        console.error(`Error processing page ${i}:`, pageError);
        text += `[Error processing page ${i}]\n`;
      }
    }
    
    if (!text || text.trim().length < 10) {
      throw new Error('No meaningful text could be extracted from the PDF');
    }
    
    console.log(`Enhanced PDF processing completed. Successfully processed ${successfulPages} of ${pdf.numPages} pages`);
    return text;
  } catch (error) {
    console.error('Error in enhanced PDF processing:', error);
    throw error;
  }
};
