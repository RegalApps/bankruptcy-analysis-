
import * as pdfjs from 'pdfjs-dist';

// Get the worker from the pdfjs-dist package
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs');

// Set the workerSrc to the worker code
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
