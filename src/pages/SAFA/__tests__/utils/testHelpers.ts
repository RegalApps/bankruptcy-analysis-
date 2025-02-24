
import { render } from '@testing-library/react';
import { vi } from 'vitest';
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

// Mock the Supabase response
export const mockSupabaseResponse = (response: any) => {
  return {
    data: response,
    error: null
  };
};
