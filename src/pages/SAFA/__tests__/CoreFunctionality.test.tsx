
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConBrandingPage } from '@/pages/ConBrandingPage';
import { createMockMessage, logTestResult, waitForAsync, mockAIResponse } from './utils/testHelpers';

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

  // Test 1.3: Responsive Design
  test('adapts layout for different screen sizes', async () => {
    try {
      const { container } = render(<ConBrandingPage />);
      
      // Test mobile view
      window.innerWidth = 375;
      window.dispatchEvent(new Event('resize'));
      await waitForAsync();
      
      // Verify mobile layout adjustments
      const sidebar = container.querySelector('[data-testid="sidebar"]');
      expect(sidebar).toHaveClass('hidden md:block');
      
      logTestResult('Responsive Design', true);
    } catch (error) {
      logTestResult('Responsive Design', false, error as Error);
      throw error;
    }
  });

  // Test 1.4: Work-Related Query Response
  test('handles work-related queries correctly', async () => {
    try {
      render(<ConBrandingPage />);
      
      // Mock AI response
      mockAIResponse('help', "Here are the steps to update document metadata...");

      // Type and send a query
      const input = screen.getByPlaceholderText(/Ask about document management/i);
      fireEvent.change(input, { target: { value: 'How do I update document metadata?' } });
      
      const sendButton = screen.getByRole('button', { name: '' });
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
