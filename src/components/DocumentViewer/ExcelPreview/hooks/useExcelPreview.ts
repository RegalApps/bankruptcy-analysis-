import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ExcelData } from '../types';

export const useExcelPreview = (storagePath: string) => {
  const [data, setData] = useState<ExcelData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  
  const fetchExcelData = useCallback(async () => {
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

      // Performance optimization: Check if we have a cached version of this data
      const { data: cachedData, error: cacheError } = await supabase
        .from('document_metadata')
        .select('extracted_metadata')
        .eq('document_id', storagePath.split('/').pop()?.split('.')[0])
        .maybeSingle();
        
      // If we have valid cached Excel data, use it
      if (!cacheError && cachedData?.extracted_metadata?.excel_data) {
        console.log('Using cached Excel data');
        setData(cachedData.extracted_metadata.excel_data);
        setLoading(false);
        setLoadingProgress(100);
        return;
      }
      
      // Otherwise proceed with fetching and parsing the Excel file
      setLoadingProgress(40);
      
      // Fetch the file
      const { data: fileData, error: fetchError } = await supabase.storage
        .from('documents')
        .download(storagePath);

      if (fetchError) {
        throw new Error(`Failed to download file: ${fetchError.message}`);
      }
      
      setLoadingProgress(60);
      
      // Use dynamic import for excel parser to reduce initial load time
      const XLSX = await import('xlsx');
      const arrayBuffer = await fileData.arrayBuffer();
      
      setLoadingProgress(75);
      
      // Parse Excel data
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with headers
      const rawJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // For large files, process rows in batches to avoid freezing the UI
      if (rawJson.length > 1000) {
        // Extract headers
        const headers = rawJson[0] as string[];
        
        // Initial data with headers and first batch of rows
        const initialBatchSize = 100;
        const initialRows = rawJson.slice(1, initialBatchSize + 1) as any[][];
        
        setData({
          headers,
          rows: initialRows
        });
        
        // Load the rest of the rows in batches
        let currentRow = initialBatchSize + 1;
        const batchSize = 500;
        
        const loadNextBatch = () => {
          if (currentRow >= rawJson.length) {
            setLoadingProgress(100);
            return;
          }
          
          const nextBatch = rawJson.slice(currentRow, currentRow + batchSize) as any[][];
          currentRow += batchSize;
          
          setData(prevData => {
            if (!prevData) return {
              headers,
              rows: nextBatch
            };
            
            return {
              headers: prevData.headers,
              rows: [...prevData.rows, ...nextBatch]
            };
          });
          
          const progress = Math.min(75 + Math.floor((currentRow / rawJson.length) * 25), 100);
          setLoadingProgress(progress);
          
          // Load next batch on next animation frame to keep UI responsive
          if (currentRow < rawJson.length) {
            window.requestAnimationFrame(loadNextBatch);
          }
        };
        
        // Start loading batches
        window.requestAnimationFrame(loadNextBatch);
      } else {
        // For smaller files, process all at once
        const headers = rawJson[0] as string[];
        const rows = rawJson.slice(1) as any[][];
        
        setData({
          headers,
          rows
        });
        setLoadingProgress(100);
      }
      
      // Cache the processed data for future use
      if (storagePath.includes('/')) {
        const documentId = storagePath.split('/').pop()?.split('.')[0];
        
        if (documentId) {
          // Try to cache the Excel data for future use
          const { error: metadataError } = await supabase
            .from('document_metadata')
            .upsert({
              document_id: documentId,
              extracted_metadata: {
                excel_data: {
                  headers: rawJson[0],
                  rows: rawJson.slice(1, 1000) // Only cache first 1000 rows to avoid size limits
                },
                last_processed: new Date().toISOString()
              }
            });
            
          if (metadataError) {
            console.error('Failed to cache Excel data:', metadataError);
          }
        }
      }
    } catch (err: any) {
      console.error('Error parsing Excel file:', err);
      setError(err.message || 'Failed to load Excel file');
    } finally {
      setLoading(false);
    }
  }, [storagePath]);

  const handleRefresh = useCallback(() => {
    fetchExcelData();
  }, [fetchExcelData]);

  useEffect(() => {
    fetchExcelData();
  }, [fetchExcelData]);

  return {
    data,
    loading,
    error,
    publicUrl,
    loadingProgress,
    handleRefresh
  };
};
