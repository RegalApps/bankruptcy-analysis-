
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConBrandingPage } from '@/pages/ConBrandingPage';
import { supabase } from '@/lib/supabase';
import { createMockMessage, logTestResult, waitForAsync } from './utils/testHelpers';

describe('SAFA Core Functionality', () => {
  // Test 1.1: Module Launch and Navigation
  test('renders SAFA interface with all core components', () => {
    try {
      render(<ConBrandingPage />);
      
      // Check for core UI elements
      expect(screen.getByText(/Welcome to Secure Files Adaptive Future-forward Assistant/i)).toBeInTheDocument();
      expect(screen.getByText(/Document Analysis/i)).toBeInTheDocument();
      expect(screen.getByText(/Legal & Regulatory/i)).toBeInTheDocument();
      expect(screen.getByText(/Training & Help/i)).toBeInTheDocument();
      
      logTestResult('Core UI Components Render', true);
    } catch (error) {
      logTestResult('Core UI Components Render', false, error as Error);
      throw error;
    }
  });

  // Test 1.2: Module Tab Switching
  test('switches between module tabs correctly', async () => {
    try {
      render(<ConBrandingPage />);
      
      // Click Legal & Regulatory tab
      const legalTab = screen.getByText(/Legal & Regulatory/i);
      fireEvent.click(legalTab);
      expect(screen.getByRole('tab', { name: /Legal & Regulatory/i })).toHaveAttribute('aria-selected', 'true');
      
      // Click Training & Help tab
      const helpTab = screen.getByText(/Training & Help/i);
      fireEvent.click(helpTab);
      expect(screen.getByRole('tab', { name: /Training & Help/i })).toHaveAttribute('aria-selected', 'true');
      
      logTestResult('Module Tab Switching', true);
    } catch (error) {
      logTestResult('Module Tab Switching', false, error as Error);
      throw error;
    }
  });

  // Test 1.4: Work-Related Query Response
  test('handles work-related queries correctly', async () => {
    try {
      render(<ConBrandingPage />);
      
      // Mock Supabase response
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: {
          response: "Here are the steps to update document metadata..."
        },
        error: null
      });

      // Type and send a query
      const input = screen.getByPlaceholderText(/Ask about document management/i);
      fireEvent.change(input, { target: { value: 'How do I update document metadata?' } });
      
      const sendButton = screen.getByRole('button', { name: '' }); // Send button has no accessible name
      fireEvent.click(sendButton);
      
      await waitForAsync();
      
      // Verify the response
      expect(screen.getByText(/Here are the steps to update document metadata/i)).toBeInTheDocument();
      
      logTestResult('Work-Related Query Response', true);
    } catch (error) {
      logTestResult('Work-Related Query Response', false, error as Error);
      throw error;
    }
  });
});
