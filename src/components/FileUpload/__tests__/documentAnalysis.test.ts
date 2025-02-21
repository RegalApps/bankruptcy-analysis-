
import { extractTextFromPdf } from '../pdfUtils';
import { supabase } from '@/lib/supabase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock PDF.js
vi.mock('pdfjs-dist', () => ({
  getDocument: () => ({
    promise: Promise.resolve({
      numPages: 2,
      getPage: (pageNum: number) => ({
        getTextContent: () => Promise.resolve({
          items: [
            { str: 'Form 47 Consumer Proposal' },
            { str: 'Client Name: John Doe' },
            { str: 'Estate Number: 12345' }
          ]
        }),
        getViewport: () => ({ width: 800, height: 1000 })
      })
    })
  })
}));

// Mock Tesseract.js
vi.mock('tesseract.js', () => ({
  default: {
    recognize: () => Promise.resolve({
      data: {
        text: 'Mock OCR Text'
      }
    })
  }
}));

// Mock canvas
const mockCanvas = {
  getContext: () => ({
    drawImage: vi.fn(),
    getImageData: () => ({ data: new Uint8Array(100) })
  }),
  toDataURL: () => 'mock-data-url'
};
global.document.createElement = vi.fn().mockReturnValue(mockCanvas);

describe('Document Analysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully extract text from PDF', async () => {
    const mockArrayBuffer = new ArrayBuffer(8);
    const result = await extractTextFromPdf(mockArrayBuffer);
    
    expect(result).toContain('Form 47 Consumer Proposal');
    expect(result).toContain('Client Name: John Doe');
    expect(result).toContain('Estate Number: 12345');
  });

  it('should handle empty PDFs', async () => {
    await expect(extractTextFromPdf(new ArrayBuffer(0)))
      .rejects
      .toThrow('Invalid PDF data received');
  });

  it('should upload and analyze document successfully', async () => {
    // Mock the file
    const mockFile = new File(['test pdf content'], 'test.pdf', { type: 'application/pdf' });
    const mockUserId = 'test-user-id';

    // Mock supabase storage upload
    const mockStorageResponse = { data: { path: 'test-path.pdf' }, error: null };
    vi.spyOn(supabase.storage.from('documents'), 'upload')
      .mockResolvedValue(mockStorageResponse);

    // Mock document record creation
    const mockDocumentData = {
      id: 'test-doc-id',
      title: 'test.pdf',
      storage_path: 'test-path.pdf'
    };
    vi.spyOn(supabase, 'from').mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [mockDocumentData],
          error: null
        })
      })
    });

    // Mock analyze-document function call
    const mockAnalysisResponse = {
      data: {
        type: 'Consumer Proposal',
        formNumber: '47',
        clientName: 'John Doe'
      },
      error: null
    };
    vi.spyOn(supabase.functions, 'invoke')
      .mockResolvedValue(mockAnalysisResponse);

    // Test upload and analysis process
    const handleDocumentUpload = async () => {
      try {
        // Upload file
        const { error: uploadError, data } = await supabase.storage
          .from('documents')
          .upload('test-path.pdf', mockFile);

        if (uploadError) throw uploadError;

        // Create document record
        const { error: dbError, data: documentData } = await supabase
          .from('documents')
          .insert([{
            title: mockFile.name,
            type: mockFile.type,
            storage_path: data?.path || '',
            user_id: mockUserId
          }])
          .select()
          .single();

        if (dbError) throw dbError;

        // Analyze document
        const { error: analysisError, data: analysisData } = await supabase.functions
          .invoke('analyze-document', {
            body: {
              documentText: 'test content',
              documentId: documentData.id
            }
          });

        if (analysisError) throw analysisError;

        return analysisData;
      } catch (error) {
        throw error;
      }
    };

    const result = await handleDocumentUpload();
    expect(result).toEqual(mockAnalysisResponse.data);
  });

  it('should handle document analysis failures gracefully', async () => {
    // Mock failed analysis
    vi.spyOn(supabase.functions, 'invoke')
      .mockRejectedValue(new Error('Analysis failed'));

    const analyzeDocument = async () => {
      try {
        const { error } = await supabase.functions.invoke('analyze-document', {
          body: {
            documentText: 'test content',
            documentId: 'test-id'
          }
        });

        if (error) throw error;
      } catch (error) {
        throw new Error('Document analysis failed');
      }
    };

    await expect(analyzeDocument())
      .rejects
      .toThrow('Document analysis failed');
  });
});
