
import * as pdfjs from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Set the worker source to a raw path
GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.min.js';

// Export configuration
export const PDF_CONFIG = {
  cMapUrl: '/node_modules/pdfjs-dist/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: '/node_modules/pdfjs-dist/standard_fonts/'
};
