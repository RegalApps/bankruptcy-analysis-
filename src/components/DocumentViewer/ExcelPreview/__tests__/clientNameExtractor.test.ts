
import { describe, it, expect, vi } from 'vitest';
import { extractClientNameFromWorksheet } from '../utils/clientNameExtractor';

describe('Client Name Extractor', () => {
  it('extracts client name from worksheet cells', () => {
    // Mock worksheet with cells containing client information
    const mockWorksheet = {
      '!ref': 'A1:D10',
      'A1': { v: 'Client:', t: 's' },
      'B1': { v: 'Acme Corporation', t: 's' },
      'C1': { v: 'Date', t: 's' },
      'A2': { v: 'Invoice', t: 's' },
      'A3': { v: 'Customer ID:', t: 's' },
      'B3': { v: '12345', t: 's' }
    };
    
    const result = extractClientNameFromWorksheet(mockWorksheet, 'documents/test.xlsx');
    expect(result).toBe('Acme Corporation');
  });
  
  it('extracts client name when using "Customer" label', () => {
    const mockWorksheet = {
      '!ref': 'A1:D10',
      'A1': { v: 'Customer Name:', t: 's' },
      'B1': { v: 'XYZ Industries', t: 's' }
    };
    
    const result = extractClientNameFromWorksheet(mockWorksheet, 'documents/test.xlsx');
    expect(result).toBe('XYZ Industries');
  });
  
  it('extracts client name from filename if not found in cells', () => {
    // Mock worksheet with no client information
    const mockWorksheet = {
      '!ref': 'A1:D10',
      'A1': { v: 'Invoice Number', t: 's' },
      'B1': { v: '1001', t: 's' }
    };
    
    // Path includes client name
    const result = extractClientNameFromWorksheet(mockWorksheet, 'documents/ABC_Company_Report.xlsx');
    expect(result).toBe('ABC Company');
  });
  
  it('returns null if no client name can be extracted', () => {
    // Mock worksheet with no client information
    const mockWorksheet = {
      '!ref': 'A1:D10',
      'A1': { v: 'Sales', t: 's' },
      'B1': { v: '1000', t: 's' }
    };
    
    // Path doesn't include client name
    const result = extractClientNameFromWorksheet(mockWorksheet, 'documents/financial_report_2023.xlsx');
    expect(result).toBeNull();
  });
});

