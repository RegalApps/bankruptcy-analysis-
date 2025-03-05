
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processExcelData } from '../utils/excelDataProcessor';
import { supabase } from '@/lib/supabase';
import * as clientNameExtractor from '../utils/clientNameExtractor';

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: vi.fn(() => Promise.resolve())
    }))
  }
}));

vi.mock('../utils/clientNameExtractor', () => ({
  extractClientNameFromWorksheet: vi.fn(() => 'Test Client')
}));

// Mock XLSX library
vi.mock('xlsx', () => ({
  read: vi.fn(() => ({
    SheetNames: ['Sheet1'],
    Sheets: {
      Sheet1: {}
    }
  })),
  utils: {
    sheet_to_json: vi.fn(() => [
      ['Name', 'Value'],
      ['John', 100],
      ['Jane', 200],
      ['Total', 300]
    ])
  }
}));

describe('Excel Data Processor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('processes Excel data correctly and extracts client name', async () => {
    // Create a mock blob
    const mockBlob = new Blob(['test data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Mock progress and client name setter functions
    const setLoadingProgress = vi.fn();
    const setClientName = vi.fn();
    
    // Call the function
    const result = await processExcelData(
      mockBlob,
      'test-document-id',
      'documents/test.xlsx',
      setLoadingProgress,
      setClientName
    );
    
    // Check the extracted client name
    expect(result.extractedClientName).toBe('Test Client');
    expect(setClientName).toHaveBeenCalledWith('Test Client');
    
    // Check that progress was updated
    expect(setLoadingProgress).toHaveBeenCalledWith(40);
    expect(setLoadingProgress).toHaveBeenCalledWith(60);
    
    // Check that supabase upsert was called to store metadata
    expect(supabase.from).toHaveBeenCalledWith('document_metadata');
    
    // Verify the extracted Excel data
    expect(result.excelData).toBeDefined();
    expect(result.excelData?.headers).toEqual(['Name', 'Value']);
    expect(result.excelData?.rows.length).toBeGreaterThan(0);
  });

  it('handles errors during Excel processing', async () => {
    // Override the mock to throw an error
    const mockError = new Error('XLSX parsing error');
    vi.mocked(require('xlsx').read).mockImplementationOnce(() => {
      throw mockError;
    });
    
    // Create a mock blob
    const mockBlob = new Blob(['test data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Call the function and check for error
    await expect(processExcelData(
      mockBlob,
      'test-document-id',
      'documents/test.xlsx',
      vi.fn(),
      vi.fn()
    )).rejects.toThrow('XLSX parsing error');
  });
});

