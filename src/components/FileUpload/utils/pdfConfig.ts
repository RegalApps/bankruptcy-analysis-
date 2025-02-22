
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Configure worker to use the bundled worker file
GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).href;

// Define version and base URL (using unpkg as fallback for cmaps)
const PDFJS_VERSION = '4.10.38';
const BASE_URL = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}`;

// Export configuration with updated worker settings
export const PDF_CONFIG = {
  cMapUrl: `${BASE_URL}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `${BASE_URL}/standard_fonts/`,
  enableWorker: true,
  useWorker: true,
  disableFontFace: false,
  isEvalSupported: true,
  useSystemFonts: false,
};
