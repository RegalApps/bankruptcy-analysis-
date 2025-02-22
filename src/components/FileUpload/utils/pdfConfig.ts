
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Define version and base URL
const PDFJS_VERSION = '4.10.38';
const BASE_URL = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}`;
const WORKER_URL = `${BASE_URL}/build/pdf.worker.min.js`;

// Configure worker source
GlobalWorkerOptions.workerSrc = WORKER_URL;

// Create a function to ensure worker is loaded
const ensureWorkerLoaded = async () => {
  if (typeof window === 'undefined') return;

  try {
    // Try to fetch the worker script
    const response = await fetch(WORKER_URL);
    if (!response.ok) throw new Error(`Failed to load worker: ${response.statusText}`);
    
    const workerBlob = await response.blob();
    const workerUrl = URL.createObjectURL(workerBlob);
    
    // Update worker source with blob URL
    GlobalWorkerOptions.workerSrc = workerUrl;
    
    console.log('PDF.js worker loaded successfully');
  } catch (error) {
    console.error('Error loading PDF.js worker:', error);
    // Fallback to direct URL if blob creation fails
    GlobalWorkerOptions.workerSrc = WORKER_URL;
  }
};

// Initialize worker
ensureWorkerLoaded();

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
