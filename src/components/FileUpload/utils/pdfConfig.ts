
import { GlobalWorkerOptions } from 'pdfjs-dist';

// We need to load the PDF.js worker from the npm package
GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.js`;

// Export configuration
export const PDF_CONFIG = {
  cMapUrl: 'https://unpkg.com/pdfjs-dist@4.10.38/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@4.10.38/standard_fonts/'
};
