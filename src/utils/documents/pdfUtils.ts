
import * as pdfjs from 'pdfjs-dist';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * Extracts text from a PDF document
 * @param url URL of the PDF document
 * @returns Promise resolving to the extracted text
 */
export const extractTextFromPdf = async (url: string): Promise<string> => {
  console.log(`Starting PDF text extraction from: ${url}`);
  
  try {
    // Load the PDF document
    const loadingTask = pdfjs.getDocument(url);
    
    // Add a reasonable timeout to avoid hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('PDF loading timeout after 30s')), 30000);
    });
    
    // Race between loading and timeout
    const pdf = await Promise.race([loadingTask.promise, timeoutPromise]);
    
    // Get the total number of pages
    const numPages = pdf.numPages;
    console.log(`PDF loaded with ${numPages} pages`);
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + ' ';
        
        console.log(`Extracted text from page ${i}/${numPages} (${pageText.length} chars)`);
      } catch (pageError) {
        console.error(`Error extracting text from page ${i}:`, pageError);
        // Continue with other pages even if one fails
      }
    }
    
    if (fullText.trim().length === 0) {
      throw new Error('Extracted text is empty - possible OCR required');
    }
    
    return fullText;
  } catch (error: any) {
    console.error('PDF text extraction error:', error);
    
    // Check if we need to use a fallback method
    if (error.message?.includes('timeout') || error.name === 'MissingPDFException') {
      console.log('Attempting fallback extraction method...');
      return await fallbackExtraction(url);
    }
    
    throw new Error(`Failed to extract text from PDF: ${error.message || error}`);
  }
};

/**
 * Fallback extraction method using a simpler approach
 */
const fallbackExtraction = async (url: string): Promise<string> => {
  try {
    // Simple fetch and basic extraction
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + ' ';
    }
    
    return text;
  } catch (error: any) {
    console.error('Fallback extraction failed:', error);
    // Return a minimal string to prevent complete failure
    return 'PDF text extraction failed. Please check document format.';
  }
};
