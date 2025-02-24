
import { beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
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
  // Mock console methods to use our logger with proper typing
  console.log = vi.fn((message: string, ...args: unknown[]) => logger.info(message, ...args));
  console.error = vi.fn((message: string, ...args: unknown[]) => logger.error(message, ...args));
  console.warn = vi.fn((message: string, ...args: unknown[]) => logger.warn(message, ...args));
});
