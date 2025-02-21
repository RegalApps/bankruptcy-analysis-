
import * as pdfjs from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Import the worker directly from node_modules
import 'pdfjs-dist/build/pdf.worker.js';

// Configure PDF.js worker
GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js';

// Export configuration
export const PDF_CONFIG = {
  // Use CDN for CMap files
  cMapUrl: 'https://unpkg.com/pdfjs-dist/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'https://unpkg.com/pdfjs-dist/standard_fonts/'
};
