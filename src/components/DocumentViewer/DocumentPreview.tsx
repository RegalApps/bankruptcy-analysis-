import React, { useState, useEffect } from 'react';
import { FileSearch } from 'lucide-react';
import { Button } from '../ui/button';
import logger from '../../utils/logger';

export interface DocumentPreviewProps {
  storagePath: string;
  title: string;
  documentId: string;
  bypassAnalysis?: boolean;
  onAnalyzeRequest?: () => Promise<void>;
  isAnalyzing?: boolean;
  forcePdfDisplay?: boolean;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  storagePath,
  title,
  documentId,
  bypassAnalysis,
  onAnalyzeRequest,
  isAnalyzing,
  forcePdfDisplay
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Load the PDF file
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use direct path if provided (e.g., data URL)
        if (storagePath && (storagePath.startsWith('data:') || storagePath.startsWith('blob:'))) {
          setPdfUrl(storagePath);
          return;
        }
        
        // For sample documents, use the direct path
        if (storagePath && storagePath.startsWith('sample-documents/')) {
          setPdfUrl(`/assets/${storagePath}`);
          return;
        }
        
        // For uploaded documents, get from local storage
        const documentsJson = localStorage.getItem('uploaded_documents') || '{}';
        const documents = JSON.parse(documentsJson);
        
        if (documents[documentId] && documents[documentId].dataUrl) {
          setPdfUrl(documents[documentId].dataUrl);
          logger.info(`Successfully loaded document ${documentId} from local storage`);
        } else {
          // If not found in local storage, check if it's a sample document ID
          const sampleDocs = {
            'sample-doc-1': '/assets/sample-documents/bankruptcy-form-1.pdf',
            'sample-doc-2': '/assets/sample-documents/consumer-proposal-form-47.pdf',
            'form47': '/assets/sample-documents/form-47-consumer-proposal.pdf'
          };
          
          if (sampleDocs[documentId]) {
            setPdfUrl(sampleDocs[documentId]);
            logger.info(`Using sample document for ${documentId}`);
          } else if (storagePath) {
            // Last resort: try using the storage path directly
            setPdfUrl(storagePath);
            logger.info(`Using storage path directly for ${documentId}: ${storagePath}`);
          } else {
            throw new Error(`Document not found: ${documentId}`);
          }
        }
      } catch (err) {
        logger.error('Error loading PDF:', err);
        setError(`Failed to load PDF: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadPdf();
  }, [documentId, storagePath]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center p-6">
          <h3 className="text-lg font-medium mb-2">Error Loading Document</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-2 border-b">
        <div className="text-sm font-medium">{title}</div>
        <div className="flex items-center space-x-2">
          {onAnalyzeRequest && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAnalyzeRequest}
              disabled={isAnalyzing}
            >
              <FileSearch className="h-4 w-4 mr-1" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-gray-50">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        
        {!loading && pdfUrl && (
          <iframe 
            src={pdfUrl}
            className="w-full h-full border-0"
            title={title}
            onLoad={() => {
              logger.info(`PDF loaded successfully: ${title}`);
              setLoading(false);
            }}
            onError={(e) => {
              logger.error('Error loading PDF in iframe:', e);
              setError('Failed to load PDF in viewer');
            }}
          />
        )}
        
        {!loading && !pdfUrl && !error && (
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">No document to display</p>
          </div>
        )}
      </div>
    </div>
  );
};
