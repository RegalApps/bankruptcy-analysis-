
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { supabase } from '@/lib/supabase';
import { Auth } from '@/components/Auth';
import { DocumentPreview } from '@/components/DocumentViewer/DocumentPreview';
import { mockErrorResponse, waitForAsync } from './utils/testHelpers';

// Mock the supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      }))
    },
    storage: {
      from: vi.fn(() => ({
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'test-url' } }))
      }))
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn()
        }))
      }))
    })),
    functions: {
      invoke: vi.fn()
    }
  }
}));

describe('Authentication Stress Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // 1. Test Basic Authentication
  describe('Basic Authentication', () => {
    test('successful login with correct credentials', async () => {
      const mockSession = {
        user: { id: 'test-user', email: 'test@example.com' },
        access_token: 'valid-token'
      };
      
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: { session: mockSession },
        error: null
      });

      render(<Auth />);
      
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'correctpassword' }
      });
      
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'correctpassword'
        });
      });
    });

    test('failed login with incorrect credentials', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: { session: null },
        error: new Error('Invalid login credentials')
      });

      render(<Auth />);
      
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'wrong@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'wrongpassword' }
      });
      
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
      });
    });

    test('handles expired session', async () => {
      // First mock a successful login
      const mockSession = {
        user: { id: 'test-user', email: 'test@example.com' },
        access_token: 'expired-token'
      };
      
      vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
        data: { session: null },
        error: new Error('Token expired')
      });

      render(<DocumentPreview storagePath="test-path" />);
      
      await waitFor(() => {
        expect(screen.getByText(/no active session found/i)).toBeInTheDocument();
      });
    });
  });

  // 2. Test Rate Limiting
  describe('Rate Limiting', () => {
    test('blocks after multiple failed attempts', async () => {
      const attempts = 6; // More than the 5 allowed attempts
      
      for (let i = 0; i < attempts; i++) {
        vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
          data: { session: null },
          error: new Error('Invalid login credentials')
        });

        render(<Auth />);
        
        fireEvent.change(screen.getByLabelText(/email/i), {
          target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
          target: { value: 'wrongpassword' }
        });
        
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        
        // Clear between renders
        await waitForAsync();
      }
      
      expect(screen.getByText(/too many attempts/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
    });
  });

  // 3. Test Session Management
  describe('Session Management', () => {
    test('handles session expiry during document analysis', async () => {
      // Mock initial session
      vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
        data: { session: { user: { id: 'test-user' } } },
        error: null
      });

      // Mock session expiry during analysis
      vi.mocked(supabase.functions.invoke).mockRejectedValueOnce(
        new Error('Session expired')
      );

      render(<DocumentPreview storagePath="test-path" />);

      await waitFor(() => {
        expect(screen.getByText(/session expired/i)).toBeInTheDocument();
      });
    });

    test('properly handles logout across multiple components', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({
        error: null
      });

      // Simulate components that depend on auth
      render(
        <>
          <DocumentPreview storagePath="test-path" />
          <Auth />
        </>
      );

      // Trigger logout
      const signOutButton = screen.getByRole('button', { name: /sign out/i });
      fireEvent.click(signOutButton);

      await waitFor(() => {
        // Check if both components show unauthenticated state
        expect(screen.getByText(/sign in/i)).toBeInTheDocument();
        expect(screen.queryByText(/document preview/i)).not.toBeInTheDocument();
      });
    });
  });

  // 4. Test "Try Analysis Again" Button
  describe('Analysis Retry Functionality', () => {
    test('retry button works when authenticated', async () => {
      // Mock authenticated session
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { user: { id: 'test-user' } } },
        error: null
      });

      // Mock first analysis attempt to fail
      vi.mocked(supabase.functions.invoke)
        .mockRejectedValueOnce(new Error('Analysis failed'))
        // Second attempt succeeds
        .mockResolvedValueOnce({ data: { success: true } });

      render(<DocumentPreview storagePath="test-path" />);

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText(/analysis failed/i)).toBeInTheDocument();
      });

      // Click retry button
      fireEvent.click(screen.getByRole('button', { name: /try analysis again/i }));

      // Verify success
      await waitFor(() => {
        expect(screen.queryByText(/analysis failed/i)).not.toBeInTheDocument();
      });
    });

    test('retry button redirects when not authenticated', async () => {
      // Mock expired session
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: new Error('No session')
      });

      render(<DocumentPreview storagePath="test-path" />);

      await waitFor(() => {
        expect(screen.getByText(/no active session found/i)).toBeInTheDocument();
      });

      // Click retry button
      fireEvent.click(screen.getByRole('button', { name: /try analysis again/i }));

      // Should see authentication required message
      await waitFor(() => {
        expect(screen.getByText(/please sign in again/i)).toBeInTheDocument();
      });
    });
  });
});
