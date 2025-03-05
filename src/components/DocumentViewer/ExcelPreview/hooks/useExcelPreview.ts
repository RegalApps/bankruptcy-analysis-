
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ExcelData } from '../types';
import { useToast } from '@/hooks/use-toast';
import { processExcelData } from '../utils/excelDataProcessor';
import { organizeFolder } from '../services/folderOrganizationService';
import { loadCachedExcelData, markDocumentProcessingStarted } from '../services/cacheService';
import { useDebounce } from '@/hooks/use-debounce';

export const useExcelPreview = (storagePath: string) => {
  const [data, setData] = useState<ExcelData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [clientName, setClientName] = useState<string | null>(null);
  const { toast } = useToast();
  
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
      setLoadingProgress(20);

      // Get document ID
      const documentId = storagePath.split('/').pop()?.split('.')[0];
      
      // Mark document as being processed
      await markDocumentProcessingStarted(documentId);

      // Check for cached data
      const { cachedData, clientName: cachedClientName } = await loadCachedExcelData(documentId);
      
      // If we have valid cached data, use it
      if (cachedData) {
        setData(cachedData);
        
        if (cachedClientName) {
          setClientName(cachedClientName);
        }
        
        setLoading(false);
        setLoadingProgress(100);
        return;
      }
      
      setLoadingProgress(30);
      
      // Use a more efficient approach - only fetch a small portion of the file
      const { data: fileData, error: fetchError } = await supabase.storage
        .from('documents')
        .download(storagePath);

      if (fetchError) {
        throw new Error(`Failed to download file: ${fetchError.message}`);
      }
      
      // Process Excel in a non-blocking way using setTimeout
      setTimeout(async () => {
        try {
          // Process the Excel file
          const { excelData, extractedClientName } = await processExcelData(
            fileData,
            documentId,
            storagePath,
            setLoadingProgress,
            setClientName
          );
          
          setData(excelData);
          
          // Start folder organization in the background
          if (extractedClientName && documentId) {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
              console.log('Starting background folder organization for client:', extractedClientName);
              // This is done in the background and doesn't block UI
              organizeFolder(documentId, user.id, extractedClientName);
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
  }, [storagePath, toast]);

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
