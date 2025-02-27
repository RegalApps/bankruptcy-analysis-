
import { vi } from 'vitest';

export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

export const mockErrorResponse = (message: string) => ({
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
