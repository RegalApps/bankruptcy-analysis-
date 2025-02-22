
import { GlobalWorkerOptions } from 'pdfjs-dist';

// We need to explicitly set HTTPS protocol for the worker
GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.js';

// Export configuration with explicit HTTPS protocols
export const PDF_CONFIG = {
  cMapUrl: 'https://unpkg.com/pdfjs-dist@4.10.38/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@4.10.38/standard_fonts/',
  enableWorker: true,
  useWorker: true
};

// Preload the worker to ensure it's available when needed
const preloadWorker = async () => {
  try {
    const workerBlob = await fetch(GlobalWorkerOptions.workerSrc).then(res => res.blob());
    const workerUrl = URL.createObjectURL(workerBlob);
    GlobalWorkerOptions.workerSrc = workerUrl;
    console.log('PDF.js worker preloaded successfully');
  } catch (error) {
    console.error('Failed to preload PDF.js worker:', error);
    // Fallback to direct CDN URL if preload fails
    GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.js';
  }
};

// Initialize worker
preloadWorker();
