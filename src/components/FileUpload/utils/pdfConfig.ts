
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker with direct path to local worker bundle
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

