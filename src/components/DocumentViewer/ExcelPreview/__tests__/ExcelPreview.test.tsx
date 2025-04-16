import { render, screen } from '@testing-library/react';
import { ExcelPreview } from '../index';
import { useExcelPreview } from '../hooks/useExcelPreview';

// Mock the hook
jest.mock('../hooks/useExcelPreview', () => ({
  useExcelPreview: jest.fn()
}));

describe('ExcelPreview', () => {
  beforeEach(() => {
    // Default mock implementation
    (useExcelPreview as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
      publicUrl: '',
      handleRefresh: jest.fn()
    });
  });

  it('renders with basic props', () => {
    render(<ExcelPreview storageUrl="test-url" />);
    expect(useExcelPreview).toHaveBeenCalledWith('test-url');
  });

  it('handles loading state', () => {
    render(<ExcelPreview storageUrl="test-url" />);
    expect(screen.getByTestId('excel-loading-skeleton')).toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    (useExcelPreview as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: 'Failed to load Excel file',
      publicUrl: 'https://example.com/file.xlsx',
      handleRefresh: jest.fn()
    });

    render(<ExcelPreview storageUrl="test-url" />);
    expect(screen.getByText('Failed to load Excel file')).toBeInTheDocument();
  });

  it('displays empty state when no data is available', () => {
    (useExcelPreview as jest.Mock).mockReturnValue({
      data: { headers: [], rows: [] },
      loading: false,
      error: null,
      publicUrl: 'https://example.com/file.xlsx',
      handleRefresh: jest.fn()
    });

    render(<ExcelPreview storageUrl="test-url" />);
    expect(screen.getByText('No data found in this Excel file.')).toBeInTheDocument();
  });

  it('renders excel table when data is available', () => {
    const mockData = {
      headers: ['Name', 'Age'],
      rows: [
        ['John', '30'],
        ['Jane', '25']
      ]
    };

    (useExcelPreview as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
      publicUrl: 'https://example.com/file.xlsx',
      handleRefresh: jest.fn()
    });

    render(<ExcelPreview storageUrl="test-url" />);
    // In a real test, you might want to check for specific table elements
    // This is a simplified check
    expect(screen.queryByTestId('excel-loading-skeleton')).not.toBeInTheDocument();
    expect(screen.queryByText('No data found in this Excel file.')).not.toBeInTheDocument();
  });
});
