
import { vi } from 'vitest';

export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Create a mock AuthError that's compatible with Supabase's AuthError
export const mockErrorResponse = (message: string) => {
  const error = new Error(message);
  Object.defineProperties(error, {
    name: { value: 'AuthError' },
    code: { value: 'custom_error' },
    status: { value: 400 }
  });
  return error as unknown as any; // Cast to any to avoid TypeScript complexity with AuthError
};

export const mockSession = {
  user: {
    id: 'test-user',
    email: 'test@example.com',
    app_metadata: { provider: 'email' },
    user_metadata: { full_name: 'Test User' },
    aud: 'authenticated',
    created_at: '2023-01-01T00:00:00Z',
    role: 'authenticated',
    identities: []
  },
  access_token: 'valid-token',
  refresh_token: 'valid-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  expires_at: Math.floor(Date.now() / 1000) + 3600
};

// Stubs for helpers used in other test files - implement with proper signatures
export const createMockMessage = vi.fn(() => ({}));
export const logTestResult = vi.fn((testName, passed, error) => {});
export const mockAIResponse = vi.fn((type, content) => {});
export const simulateChat = vi.fn(async () => {});
export const mockDocumentUpload = vi.fn(() => {});
export const verifyToastNotification = vi.fn(() => {});
export const createMockFile = vi.fn(() => {});
