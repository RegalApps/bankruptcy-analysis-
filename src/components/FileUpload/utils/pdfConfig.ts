
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Use jsdelivr CDN which has better CORS support
const PDFJS_VERSION = '4.10.38';
const BASE_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}`;

// Configure the worker source
GlobalWorkerOptions.workerSrc = `${BASE_URL}/build/pdf.worker.min.js`;

// Export configuration with explicit HTTPS protocols
export const PDF_CONFIG = {
  cMapUrl: `${BASE_URL}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `${BASE_URL}/standard_fonts/`,
  isEvalSupported: false,
  useSystemFonts: true,
  disableFontFace: false
};
