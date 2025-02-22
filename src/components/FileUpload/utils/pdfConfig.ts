
import { GlobalWorkerOptions } from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.js';

// Define version and base URL
const PDFJS_VERSION = '4.10.38';
const BASE_URL = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}`;

// Export configuration
export const PDF_CONFIG = {
  cMapUrl: `${BASE_URL}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `${BASE_URL}/standard_fonts/`,
  enableWorker: true,
  useWorker: true,
  disableFontFace: false,
  isEvalSupported: true,
  useSystemFonts: false
};
