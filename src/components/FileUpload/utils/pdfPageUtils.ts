import { performOCR } from './ocrUtils';

export const isScannedPage = async (page: any): Promise<boolean> => {
  try {
    console.log('Checking if page is scanned...');
    const content = await page.getTextContent({
      normalizeWhitespace: true,
      disableCombineTextItems: false
    });
    
    // Join all text items with proper spacing
    const text = content.items
      .map((item: any) => item.str)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    console.log('Extracted text length:', text.length);
    console.log('Sample of extracted text:', text.substring(0, 200));
    
    // Improved scanned page detection
    const metrics = {
      textLength: text.length,
      wordCount: text.split(/\s+/).length,
      digitPercentage: (text.replace(/[^\d]/g, '').length / text.length) * 100,
      letterPercentage: (text.replace(/[^\w]/g, '').length / text.length) * 100
    };
    
    console.log('Text metrics:', metrics);
    
    // More accurate detection criteria
    const isScanned = 
      metrics.textLength < 50 || // Very little text
      metrics.wordCount < 10 || // Very few words
      metrics.digitPercentage > 80 || // Mostly numbers
      metrics.letterPercentage < 20; // Very few letters
    
    console.log('Is page scanned:', isScanned, 'based on metrics');
    return isScanned;
  } catch (error) {
    console.error('Error checking if page is scanned:', error);
    return true; // Assume scanned if we can't check
  }
};

export const pageToImage = async (page: any): Promise<string> => {
  try {
    console.log('Converting page to image...');
    // Optimize scale for better OCR while keeping performance
    const scale = 1.5;
    const viewport = page.getViewport({ scale });
    
    // Create canvas with optimal size
    const canvas = document.createElement('canvas');
    const targetWidth = Math.min(viewport.width, 2000); // Cap width for performance
    const scaleFactor = targetWidth / viewport.width;
    const targetHeight = viewport.height * scaleFactor;
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    const context = canvas.getContext('2d', {
      alpha: false,
      willReadFrequently: true
    });
    
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    
    // Optimize image for OCR
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const renderContext = {
      canvasContext: context,
      viewport: page.getViewport({ scale: scale * scaleFactor }),
      intent: 'print',
      background: 'white',
      renderInteractiveForms: true
    };
    
    await page.render(renderContext).promise;
    
    // Apply image processing for better OCR
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Increase contrast and convert to grayscale
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const normalized = avg > 128 ? 255 : 0; // Threshold for better contrast
      data[i] = normalized;     // R
      data[i + 1] = normalized; // G
      data[i + 2] = normalized; // B
    }
    
    context.putImageData(imageData, 0, 0);
    console.log('Page converted to optimized image');
    
    // Use JPEG for better compression while maintaining quality
    return canvas.toDataURL('image/jpeg', 0.95);
  } catch (error) {
    console.error('Error converting page to image:', error);
    throw error;
  }
};
