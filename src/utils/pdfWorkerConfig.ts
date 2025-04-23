import * as pdfjs from 'pdfjs-dist';

// Configure the worker source to use a local worker file
// This ensures the worker is always available and works offline
const workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default pdfjs;
