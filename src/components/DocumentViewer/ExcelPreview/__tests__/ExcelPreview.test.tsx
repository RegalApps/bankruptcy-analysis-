
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExcelPreview } from '../index';
import { useExcelPreview } from '../hooks/useExcelPreview';
import { vi } from 'vitest';

// Mock the custom hook
vi.mock('../hooks/useExcelPreview');

describe('ExcelPreview', () => {
  beforeEach(() => {
    (useExcelPreview as any).mockReturnValue({
      data: null,
      loading: true,
      error: null,
      publicUrl: 'https://example.com/file.xlsx',
      handleRefresh: vi.fn()
    });
  });
  
  it('renders loading state', () => {
    render(<ExcelPreview storageUrl="test.xlsx" />);
    expect(document.querySelector('[role="progressbar"]')).toBeInTheDocument();
  });
  
  it('renders error state', () => {
    (useExcelPreview as any).mockReturnValue({
      data: null,
      loading: false,
      error: 'Error loading file',
      publicUrl: 'https://example.com/file.xlsx',
      handleRefresh: vi.fn()
    });
    
    render(<ExcelPreview storageUrl="test.xlsx" />);
    expect(screen.getByText('Error loading file')).toBeInTheDocument();
  });
  
  it('renders empty state', () => {
    (useExcelPreview as any).mockReturnValue({
      data: { rows: [] },
      loading: false,
      error: null,
      publicUrl: 'https://example.com/file.xlsx',
      handleRefresh: vi.fn()
    });
    
    render(<ExcelPreview storageUrl="test.xlsx" />);
    expect(screen.getByText('No data found in this Excel file.')).toBeInTheDocument();
  });
  
  it('renders excel table', () => {
    (useExcelPreview as any).mockReturnValue({
      data: { 
        headers: ['Name', 'Age'], 
        rows: [['John', '30'], ['Jane', '25']],
        sheets: ['Sheet1', 'Sheet2']
      },
      loading: false,
      error: null,
      publicUrl: 'https://example.com/file.xlsx',
      handleRefresh: vi.fn()
    });
    
    render(<ExcelPreview storageUrl="test.xlsx" />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
