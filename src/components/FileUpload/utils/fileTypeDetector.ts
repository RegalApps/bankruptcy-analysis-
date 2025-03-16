
/**
 * Identifies file types and special forms from filenames
 */
export const detectDocumentType = (file: File): {
  isForm76: boolean;
  isExcel: boolean;
} => {
  const fileName = file.name.toLowerCase();
  const fileType = file.type;
  
  const isForm76 = fileName.includes('form 76') || 
                   fileName.includes('f76') || 
                   fileName.includes('form76');
                
  const isExcel = fileName.endsWith('.xlsx') || 
                 fileName.endsWith('.xls') ||
                 fileType.includes('excel');
  
  return {
    isForm76,
    isExcel
  };
};
