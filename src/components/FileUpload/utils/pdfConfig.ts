
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker - using the correct method for Vite/React environment
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
