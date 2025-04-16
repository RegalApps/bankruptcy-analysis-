
import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, vi, describe, it, beforeEach, expect as vitestExpect } from 'vitest';

expect.extend(matchers);

// Export Vitest functions with Jest naming for backward compatibility
global.jest = {
  fn: vi.fn,
  mock: vi.mock
};

// Provide global access to these functions
global.describe = describe;
global.it = it;
global.beforeEach = beforeEach;
global.expect = vitestExpect;

declare global {
  namespace Vi {
    interface Assertion extends jest.Matchers<void, any> {}
  }
  
  // Add global jest for backward compatibility
  var jest: {
    fn: typeof vi.fn;
    mock: typeof vi.mock;
  };
}

// Mock fetch globally
global.fetch = vi.fn();

// Mock HTML Canvas element
HTMLCanvasElement.prototype.getContext = vi.fn();

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
