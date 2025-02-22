
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Remove the CDN worker configuration and use the bundled worker
const PDF_CONFIG = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@4.10.38/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@4.10.38/standard_fonts/`,
  enableWorker: true,
  useWorker: true,
  disableFontFace: false,
  isEvalSupported: true,
  useSystemFonts: false,
};

export { PDF_CONFIG };
