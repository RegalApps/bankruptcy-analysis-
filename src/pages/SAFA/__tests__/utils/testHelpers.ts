
import { vi } from 'vitest';
import { supabase } from '@/lib/supabase';
import logger from '@/utils/logger';
import { ChatMessage } from '../../types';

// Helper to create mock chat messages
export const createMockMessage = (
  content: string,
  type: 'user' | 'assistant' = 'user',
  module?: 'document' | 'legal' | 'help'
): ChatMessage => ({
  id: Date.now().toString(),
  content,
  type,
  timestamp: new Date(),
  module
});

// Mock file for testing uploads
export const createMockFile = (name: string = 'test.pdf', type: string = 'application/pdf'): File => {
  return new File(['test'], name, { type });
};

// Helper to wait for async operations
export const waitForAsync = async () => {
  await new Promise(resolve => setTimeout(resolve, 0));
};

// Log test results
export const logTestResult = (testName: string, passed: boolean, error?: Error) => {
  if (passed) {
    logger.info(`✅ Test passed: ${testName}`);
  } else {
    logger.error(`❌ Test failed: ${testName}`, error);
  }
};

// Mock AI responses for different scenarios
export const mockAIResponse = (type: 'document' | 'legal' | 'help', customResponse?: string) => {
  const responses = {
    document: "I've analyzed the document and extracted the following metadata...",
    legal: "According to the OSB Act, section 1.1...",
    help: "Here are the steps to perform this operation..."
  };

  vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
    data: {
      response: customResponse || responses[type]
    },
    error: null
  });
};

// Mock document upload
export const mockDocumentUpload = (success = true) => {
  if (success) {
    vi.mocked(supabase.storage.from).mockReturnValue({
      upload: vi.fn().mockResolvedValue({ data: { path: 'test.pdf' }, error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'test-url' } })
    } as any);
  } else {
    vi.mocked(supabase.storage.from).mockReturnValue({
      upload: vi.fn().mockRejectedValue(new Error('Upload failed')),
      getPublicUrl: vi.fn().mockReturnValue({ data: null, error: new Error('URL generation failed') })
    } as any);
  }
};
