
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ExcelData } from '../types';

export const useExcelPreview = (storagePath: string) => {
  const [data, setData] = useState<ExcelData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [clientName, setClientName] = useState<string | null>(null);
  
  const fetchExcelDataOptimized = useCallback(async () => {
    if (!storagePath) {
      setError('No storage path provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setLoadingProgress(10);
      setError(null);
      
      // Get public URL for the file
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(storagePath);
      setPublicUrl(urlData.publicUrl);
      setLoadingProgress(30);

      // Check if we have a cached version of this data first
      const { data: cachedData, error: cacheError } = await supabase
        .from('document_metadata')
        .select('extracted_metadata')
        .eq('document_id', storagePath.split('/').pop()?.split('.')[0])
        .maybeSingle();
        
      // If we have valid cached data, use it
      if (!cacheError && cachedData?.extracted_metadata?.excel_data) {
        console.log('Using cached Excel data');
        setData(cachedData.extracted_metadata.excel_data);
        
        // Extract client name from cache if available
        if (cachedData.extracted_metadata.client_name) {
          setClientName(cachedData.extracted_metadata.client_name);
        }
        
        setLoading(false);
        setLoadingProgress(100);
        return;
      }
      
      setLoadingProgress(40);
      
      // Use a more efficient approach - only fetch a small portion of the file for preview
      const { data: fileData, error: fetchError } = await supabase.storage
        .from('documents')
        .download(storagePath);

      if (fetchError) {
        throw new Error(`Failed to download file: ${fetchError.message}`);
      }
      
      setLoadingProgress(60);
      
      // Process Excel in a non-blocking way using a web worker if available
      // or a setTimeout to avoid freezing the UI
      setTimeout(async () => {
        try {
          // Use dynamic import for excel parser to reduce initial load time
          const XLSX = await import('xlsx');
          const arrayBuffer = await fileData.arrayBuffer();
          
          // Only read the first worksheet and limit to 100 rows for preview
          const workbook = XLSX.read(arrayBuffer, { 
            type: 'array',
            sheetRows: 100 // Limit to first 100 rows
          });
          
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON with headers, limited to first 100 rows
          const rawJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Extract headers (first row)
          const headers = rawJson[0] as string[];
          
          // Only take first 99 rows for preview
          const rows = rawJson.slice(1, 100) as any[][];
          
          // Try to extract client name from first few cells
          let extractedClientName = null;
          for (let i = 0; i < Math.min(5, rows.length); i++) {
            for (let j = 0; j < Math.min(5, rows[i]?.length || 0); j++) {
              const cellValue = rows[i][j]?.toString() || '';
              if (
                (cellValue.toLowerCase().includes('client') || 
                 cellValue.toLowerCase().includes('name')) && 
                 rows[i][j+1]
              ) {
                extractedClientName = rows[i][j+1].toString();
                break;
              }
              
              // Also check for common patterns in financial documents
              if (cellValue.toLowerCase().includes('statement for') ||
                  cellValue.toLowerCase().includes('account of')) {
                const parts = cellValue.split(/for|of/i);
                if (parts.length > 1) {
                  extractedClientName = parts[1].trim();
                  break;
                }
              }
            }
            if (extractedClientName) break;
          }
          
          if (extractedClientName) {
            setClientName(extractedClientName);
          } else {
            // Fallback to filename if client name not found in content
            const fileName = storagePath.split('/').pop() || '';
            if (fileName.includes('_')) {
              setClientName(fileName.split('_')[0].replace(/[^a-zA-Z0-9\s]/g, ' '));
            }
          }
          
          setData({
            headers,
            rows
          });
          
          // Cache the extracted data and client name
          if (storagePath.includes('/')) {
            const documentId = storagePath.split('/').pop()?.split('.')[0];
            
            if (documentId) {
              await supabase
                .from('document_metadata')
                .upsert({
                  document_id: documentId,
                  extracted_metadata: {
                    excel_data: {
                      headers,
                      rows: rows.slice(0, 50) // Only cache first 50 rows to keep size small
                    },
                    client_name: extractedClientName,
                    last_processed: new Date().toISOString()
                  }
                });
            }
          }
          
          setLoadingProgress(100);
          setLoading(false);
        } catch (err: any) {
          console.error('Error processing Excel file:', err);
          setError(err.message || 'Failed to process Excel file');
          setLoading(false);
        }
      }, 10); // Small timeout to allow UI to update
      
    } catch (err: any) {
      console.error('Error loading Excel file:', err);
      setError(err.message || 'Failed to load Excel file');
      setLoading(false);
    }
  }, [storagePath]);

  const handleRefresh = useCallback(() => {
    fetchExcelDataOptimized();
  }, [fetchExcelDataOptimized]);

  useEffect(() => {
    fetchExcelDataOptimized();
  }, [fetchExcelDataOptimized]);

  return {
    data,
    loading,
    error,
    publicUrl,
    loadingProgress,
    clientName,
    handleRefresh
  };
};
