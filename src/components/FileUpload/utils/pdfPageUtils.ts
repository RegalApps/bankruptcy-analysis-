
import { performOCR } from './ocrUtils';

export const isScannedPage = async (page: any): Promise<boolean> => {
  try {
    console.log('Checking if page is scanned...');
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => item.str)
      .join(' ')
      .trim();
    
    console.log('Extracted text length:', text.length);
    console.log('Sample of extracted text:', text.substring(0, 200));
    
    // More sophisticated check for scanned pages
    const hasMinimalText = text.length < 100;
    const containsMainlyNumbers = /^\d+$/.test(text.replace(/\D/g, ''));
    const hasNoSpaces = !text.includes(' ');
    const hasOnlySpecialChars = /^[^a-zA-Z0-9]+$/.test(text);
    
    const isScanned = hasMinimalText || containsMainlyNumbers || hasNoSpaces || hasOnlySpecialChars;
    console.log('Page appears to be scanned:', isScanned, {
      hasMinimalText,
      containsMainlyNumbers,
      hasNoSpaces,
      hasOnlySpecialChars
    });
    
    return isScanned;
  } catch (error) {
    console.error('Error checking if page is scanned:', error);
    return true; // Assume scanned if we can't check
  }
};

export const pageToImage = async (page: any): Promise<string> => {
  try {
    console.log('Converting page to image...');
    // Increase scale for better OCR results
    const scale = 2.0;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { 
      alpha: false,
      willReadFrequently: true 
    });
    
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Use white background for better contrast
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    await page.render({
      canvasContext: context,
      viewport: viewport,
      intent: 'print',
      background: 'white'
    }).promise;
    
    console.log('Page converted to image successfully');
    
    // Higher quality PNG for better OCR
    return canvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Error converting page to image:', error);
    throw error;
  }
};

