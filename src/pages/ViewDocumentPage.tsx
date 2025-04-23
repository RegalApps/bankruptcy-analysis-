import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentProvider } from '@/contexts/DocumentContext';
import { SimpleDocumentViewer } from '@/components/DocumentViewer/SimpleDocumentViewer';
import logger from '@/utils/logger';

export const ViewDocumentPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    if (!documentId) {
      logger.error('No document ID provided');
      navigate('/dashboard');
      return;
    }
    
    setIsReady(true);
  }, [documentId, navigate]);
  
  const handleLoadFailure = () => {
    logger.error(`Document load failed for ID: ${documentId}`);
    navigate('/dashboard');
  };
  
  if (!isReady || !documentId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading document...</p>
      </div>
    );
  }
  
  return (
    <DocumentProvider>
      <div className="container mx-auto p-4 h-[calc(100vh-4rem)]">
        <SimpleDocumentViewer 
          documentId={documentId} 
          onLoadFailure={handleLoadFailure}
        />
      </div>
    </DocumentProvider>
  );
};
