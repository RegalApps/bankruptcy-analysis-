
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
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
  
  // Mock console methods to use our logger
  console.log = vi.fn((...args) => logger.info(...args));
  console.error = vi.fn((...args) => logger.error(...args));
  console.warn = vi.fn((...args) => logger.warn(...args));
});

afterEach(() => {
  cleanup();
});
