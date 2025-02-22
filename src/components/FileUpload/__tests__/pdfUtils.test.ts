
import { extractTextFromPdf } from '../pdfUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as pdfjs from 'pdfjs-dist';
import logger from '@/utils/logger';

// Mock PDF.js
vi.mock('pdfjs-dist', () => ({
  getDocument: () => ({
    promise: Promise.resolve({
      numPages: 3,
      getPage: (pageNum: number) => ({
        getTextContent: () => Promise.resolve({
          items: pageNum === 2 
            ? [{ str: '' }] // Empty page to trigger OCR
            : [
                { str: `Page ${pageNum} content` },
                { str: 'Test document' }
              ]
        }),
        getViewport: () => ({ width: 800, height: 1000 })
      })
    })
  }),
  GlobalWorkerOptions: {
    workerSrc: null
  }
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  default: {
    info: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
    warn: vi.fn()
  }
}));

describe('PDF Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully extract text from a valid PDF', async () => {
    const mockArrayBuffer = new ArrayBuffer(8);
    const result = await extractTextFromPdf(mockArrayBuffer);

    expect(result.text).toContain('Page 1 content');
    expect(result.text).toContain('Test document');
    expect(result.successfulPages).toBe(3);
    expect(result.totalPages).toBe(3);
    expect(result.errors).toHaveLength(0);
  });

  it('should handle empty PDF data', async () => {
    await expect(extractTextFromPdf(new ArrayBuffer(0)))
      .rejects
      .toThrow('Invalid PDF data received');
  });

  it('should log processing steps in development', async () => {
    const mockArrayBuffer = new ArrayBuffer(8);
    await extractTextFromPdf(mockArrayBuffer);

    expect(logger.info).toHaveBeenCalledWith('Starting PDF text extraction...');
    expect(logger.debug).toHaveBeenCalled();
  });

  it('should handle OCR fallback for pages with little content', async () => {
    const mockArrayBuffer = new ArrayBuffer(8);
    const result = await extractTextFromPdf(mockArrayBuffer);

    expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('attempting OCR'));
    expect(result.successfulPages).toBe(3);
  });
});
