/**
 * Utility to clear document-related items from storage
 */

export const clearDocumentStorage = () => {
  try {
    // Clear localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('document') || 
        key.includes('file') || 
        key.includes('pdf') ||
        key.includes('supabase') ||
        key.includes('29e938f5-949e-401a-8a82-c9a66370efc1')
      )) {
        localStorage.removeItem(key);
      }
    }
    
    // Clear sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (
        key.includes('document') || 
        key.includes('file') || 
        key.includes('pdf') ||
        key.includes('supabase') ||
        key.includes('29e938f5-949e-401a-8a82-c9a66370efc1')
      )) {
        sessionStorage.removeItem(key);
      }
    }
    
    // Clear specific document ID that's causing issues
    localStorage.removeItem('29e938f5-949e-401a-8a82-c9a66370efc1');
    sessionStorage.removeItem('29e938f5-949e-401a-8a82-c9a66370efc1');
    
    // Remove any recent documents list
    localStorage.removeItem('recentDocuments');
    sessionStorage.removeItem('recentDocuments');
    
    console.log('Document storage cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing document storage:', error);
    return false;
  }
};
