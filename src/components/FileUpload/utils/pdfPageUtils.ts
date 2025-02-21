
import { performOCR } from './ocrUtils';

export const isScannedPage = async (page: any): Promise<boolean> => {
  try {
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => item.str)
      .join('')
      .trim();
    
    const hasMinimalText = text.length < 100;
    const containsMainlyNumbers = /^\d+$/.test(text.replace(/\D/g, ''));
    
    return hasMinimalText || containsMainlyNumbers;
  } catch (error) {
    console.error('Error checking if page is scanned:', error);
    return true;
  }
};

export const pageToImage = async (page: any): Promise<string> => {
  try {
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
    
    await page.render({
      canvasContext: context,
      viewport: viewport,
      intent: 'print',
      background: 'white'
    }).promise;
    
    return canvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Error converting page to image:', error);
    throw error;
  }
};
