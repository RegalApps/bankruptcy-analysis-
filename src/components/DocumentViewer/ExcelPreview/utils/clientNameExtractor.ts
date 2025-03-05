
import * as XLSX from 'xlsx';

/**
 * Extracts client name from Excel worksheet by analyzing patterns in the first few rows
 */
export const extractClientNameFromWorksheet = (worksheet: any, storagePath?: string): string | null => {
  try {
    // Convert just the first few rows to check for client name
    const smallJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Search for client name in first few rows
    for (let i = 0; i < Math.min(5, smallJson.length); i++) {
      const row = smallJson[i] as any[];
      if (!row) continue;
      
      for (let j = 0; j < Math.min(5, row.length); j++) {
        const cellValue = row[j]?.toString()?.toLowerCase() || '';
        
        // Check for client label
        if ((cellValue.includes('client') || cellValue.includes('name')) && row[j+1]) {
          return row[j+1].toString();
        }
        
        // Check for statement patterns
        if (cellValue.includes('statement for') || cellValue.includes('account of')) {
          const parts = cellValue.split(/for|of/i);
          if (parts.length > 1) {
            return parts[1].trim();
          }
        }
      }
    }
    
    // Fallback to filename if client name not found in content
    if (storagePath) {
      const fileName = storagePath.split('/').pop() || '';
      if (fileName.includes('_')) {
        return fileName.split('_')[0].replace(/[^a-zA-Z0-9\s]/g, ' ');
      }
    }
    
    return null;
  } catch (e) {
    console.error('Error extracting client name:', e);
    return null;
  }
};
