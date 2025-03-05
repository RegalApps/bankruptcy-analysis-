import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ExcelData } from '../types';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

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

      // Important: Update document metadata immediately with processing started flag
      // This allows other parts of the app to know we're working on this
      const documentId = storagePath.split('/').pop()?.split('.')[0];
      if (documentId) {
        await supabase
          .from('documents')
          .update({ 
            metadata: { 
              excel_processing_started: true,
              last_processing_attempt: new Date().toISOString()
            }
          })
          .eq('id', documentId);
      }

      // Check if we have a cached version of this data first
      const { data: cachedData, error: cacheError } = await supabase
        .from('document_metadata')
        .select('extracted_metadata')
        .eq('document_id', documentId)
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
      
      setLoadingProgress(30);
      
      // Use a more efficient approach - only fetch a small portion of the file for preview
      const { data: fileData, error: fetchError } = await supabase.storage
        .from('documents')
        .download(storagePath);

      if (fetchError) {
        throw new Error(`Failed to download file: ${fetchError.message}`);
      }
      
      setLoadingProgress(40);
      
      // Process Excel in a non-blocking way using setTimeout
      // This allows the UI to remain responsive while we process the file
      setTimeout(async () => {
        try {
          // Use dynamic import for excel parser to reduce initial load time
          const XLSX = await import('xlsx');
          const arrayBuffer = await fileData.arrayBuffer();
          
          // Only read the first worksheet and limit to 10 rows for client name extraction
          // This is much faster than processing the entire file
          const workbook = XLSX.read(arrayBuffer, { 
            type: 'array',
            sheetRows: 10 // Limit initial read to just 10 rows for fast client name extraction
          });
          
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Extract client name from the first few cells (quick scan)
          let extractedClientName = extractClientNameFromWorksheet(worksheet);
          setClientName(extractedClientName);

          // Update metadata with client name immediately
          if (documentId && extractedClientName) {
            await supabase
              .from('document_metadata')
              .upsert({
                document_id: documentId,
                extracted_metadata: {
                  client_name: extractedClientName,
                  last_processed: new Date().toISOString()
                }
              });
              
            // Start folder organization in the background
            if (extractedClientName) {
              const { data: { user } } = await supabase.auth.getUser();
              
              if (user) {
                console.log('Starting background folder organization for client:', extractedClientName);
                // This is done in the background and doesn't block UI
                organizeFolder(documentId, user.id, extractedClientName);
              }
            }
          }
          
          setLoadingProgress(60);
          
          // Now load a bit more data for the preview (up to 100 rows)
          // This second pass is just for display purposes
          const fullWorkbook = XLSX.read(arrayBuffer, { 
            type: 'array',
            sheetRows: 100 // Limit to first 100 rows for preview
          });
          
          const fullWorksheet = fullWorkbook.Sheets[sheetName];
          const rawJson = XLSX.utils.sheet_to_json(fullWorksheet, { header: 1 });
          
          // Extract headers (first row)
          const headers = rawJson[0] as string[];
          
          // Only take first 99 rows for preview
          const rows = rawJson.slice(1, 100) as any[][];
          
          setData({
            headers,
            rows
          });
          
          // Cache the extracted data
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

  const extractClientNameFromWorksheet = (worksheet: any): string | null => {
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
      const fileName = storagePath.split('/').pop() || '';
      if (fileName.includes('_')) {
        return fileName.split('_')[0].replace(/[^a-zA-Z0-9\s]/g, ' ');
      }
      
      return null;
    } catch (e) {
      console.error('Error extracting client name:', e);
      return null;
    }
  };

  const organizeFolder = async (documentId: string, userId: string, clientName: string) => {
    try {
      // Get document metadata
      const { data: doc } = await supabase
        .from('documents')
        .select('metadata')
        .eq('id', documentId)
        .single();
        
      // Skip if already organized
      if (doc?.metadata?.processing_complete) return;
      
      // Do folder organization
      await supabase.functions.invoke('organize-document', {
        body: { 
          documentId,
          userId,
          clientName,
          documentType: "Excel"
        }
      });
    } catch (error) {
      console.error('Error in background folder organization:', error);
    }
  };

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
