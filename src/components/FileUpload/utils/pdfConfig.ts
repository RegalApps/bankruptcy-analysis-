
import * as pdfjs from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import worker from 'pdfjs-dist/build/pdf.worker.min.js?url';

// Configure PDF.js worker using the bundled worker file
GlobalWorkerOptions.workerSrc = worker;

// Export configuration
export const PDF_CONFIG = {
  // Use local paths instead of CDN
  cMapUrl: '/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: '/standard_fonts/'
};
