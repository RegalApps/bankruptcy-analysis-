
import { vi } from 'vitest';

export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

export const mockErrorResponse = (message: string) => ({
  name: 'AuthError',
  code: 'custom_error',
  status: 400,
  message,
  __isAuthError: true
});

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

// Stubs for helpers used in other test files
// These are empty implementations to prevent TypeScript errors
// The actual implementations should be specific to the test requirements
export const createMockMessage = vi.fn(() => ({}));
export const logTestResult = vi.fn();
export const mockAIResponse = vi.fn(() => ({}));
export const simulateChat = vi.fn();
export const mockDocumentUpload = vi.fn();
export const verifyToastNotification = vi.fn();
export const createMockFile = vi.fn();
