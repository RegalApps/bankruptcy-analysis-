
import * as pdfjs from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Set worker source to a CDN URL since the direct import isn't working
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Helper function to check if page contains actual text content
const isScannedPage = async (page: any): Promise<boolean> => {
  const content = await page.getTextContent();
  const text = content.items
    .map((item: any) => item.str)
    .join('')
    .trim();
  return text.length < 50; // If less than 50 characters, likely a scanned page
};

// Function to convert PDF page to image data
const pageToImage = async (page: any): Promise<string> => {
  const scale = 2.0; // Higher scale for better OCR results
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  
  await page.render({
    canvasContext: context!,
    viewport: viewport
  }).promise;
  
  return canvas.toDataURL('image/png');
};

// Function to perform OCR on an image
const performOCR = async (imageData: string): Promise<string> => {
  const result = await Tesseract.recognize(
    imageData,
    'eng',
    {
      logger: m => console.log(m)
    }
  );
  return result.data.text;
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
