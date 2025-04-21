
import * as XLSX from 'xlsx';

/**
 * Extracts client name from Excel worksheet by analyzing patterns in the first few rows
 * with improved pattern recognition
 */
export const extractClientNameFromWorksheet = (worksheet: any, storagePath?: string): string | null => {
  try {
    // Convert just the first few rows to check for client name
    const smallJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Search for client name in first few rows with expanded pattern recognition
    for (let i = 0; i < Math.min(10, smallJson.length); i++) {
      const row = smallJson[i] as any[];
      if (!row) continue;
      
      // Check each cell in the row (up to 10 columns)
      for (let j = 0; j < Math.min(10, row.length); j++) {
        const cellValue = String(row[j] || '').toLowerCase();
        if (!cellValue) continue;
        
        // Check for client label variations
        if ((cellValue.includes('client') || 
             cellValue.includes('name') || 
             cellValue.includes('customer') || 
             cellValue === 'for' ||
             cellValue === 'debtor')) {
          
          // Check next cell first (most common pattern)
          if (row[j+1] && typeof row[j+1] === 'string' && row[j+1].trim().length > 1) {
            return row[j+1].toString().trim();
          }
          
          // Check the cell to the right of that one
          if (row[j+2] && typeof row[j+2] === 'string' && row[j+2].trim().length > 1) {
            return row[j+2].toString().trim();
          }
          
          // Check cell below (another common pattern)
          if (smallJson[i+1] && smallJson[i+1][j] && 
              typeof smallJson[i+1][j] === 'string' && 
              smallJson[i+1][j].trim().length > 1) {
            return smallJson[i+1][j].toString().trim();
          }
        }
        
        // Check for statement patterns
        if (cellValue.includes('statement for') || cellValue.includes('account of') || 
            cellValue.includes('report for') || cellValue.includes('prepared for')) {
          
          // Extract name after the pattern
          const parts = cellValue.split(/for|of/i);
          if (parts.length > 1 && parts[1].trim().length > 1) {
            return parts[1].trim();
          }
        }
        
        // Check for header cells with client name
        if (cellValue === 'client' || cellValue === 'name' || cellValue === 'customer') {
          // Check cells to the right until we find a likely name
          for (let k = j+1; k < Math.min(j+4, row.length); k++) {
            if (row[k] && typeof row[k] === 'string' && row[k].trim().length > 1) {
              return row[k].toString().trim();
            }
          }
        }
      }
    }
    
    // Look for title/header rows with likely names
    for (let i = 0; i < Math.min(3, smallJson.length); i++) {
      const row = smallJson[i] as any[];
      if (row && row[0] && typeof row[0] === 'string' && row[0].trim().length > 3) {
        const text = row[0].toString().trim();
        // Look for patterns like "John Smith's Financial Statement"
        if (text.toLowerCase().includes('statement') || 
            text.toLowerCase().includes('report') || 
            text.toLowerCase().includes('account')) {
          
          // Try to extract the name part
          const namePart = text.split(/('s|\s-|\sFinancial|\sReport|\sStatement|\sAccount)/i)[0];
          if (namePart && namePart.trim().length > 3) {
            return namePart.trim();
          }
        }
      }
    }
    
    // Fallback to filename if client name not found in content
    if (storagePath) {
      const fileName = storagePath.split('/').pop() || '';
      if (fileName.includes('_')) {
        // Extract first part as potential client name
        const possibleName = fileName.split('_')[0].replace(/[^a-zA-Z0-9\s]/g, ' ');
        if (possibleName.length > 3) {
          return possibleName.trim();
        }
      } else if (fileName.includes('-')) {
        // Try dash separator instead
        const possibleName = fileName.split('-')[0].replace(/[^a-zA-Z0-9\s]/g, ' ');
        if (possibleName.length > 3) {
          return possibleName.trim();
        }
      }
    }
    
    return null;
  } catch (e) {
    console.error('Error extracting client name:', e);
    return null;
  }
};
