
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';  // Add jest-dom matchers
import logger from '@/utils/logger';

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    },
    storage: {
      from: () => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn()
      })
    }
  }
}));

// Setup test environment
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
  
  // Mock console methods to use our logger with proper typing
  console.log = vi.fn((message: string, ...args: unknown[]) => logger.info(message, ...args));
  console.error = vi.fn((message: string, ...args: unknown[]) => logger.error(message, ...args));
  console.warn = vi.fn((message: string, ...args: unknown[]) => logger.warn(message, ...args));
});

afterEach(() => {
  cleanup();
});
