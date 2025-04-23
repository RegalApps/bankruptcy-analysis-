import React, { useEffect, useState } from 'react';
import { useDocument } from '@/contexts/DocumentContext';
import { DocumentPreview } from './DocumentPreview';
import { Sidebar } from './Sidebar';
import { ViewerLayout } from './layout/ViewerLayout';
import { ViewerLoadingState } from './components/ViewerLoadingState';
import { ViewerErrorState } from './components/ViewerErrorState';
import { ViewerNotFoundState } from './components/ViewerNotFoundState';
import { CollaborationPanel } from './CollaborationPanel';
import { VersionTab } from './VersionTab';
import { TaskManager } from './TaskManager';
import logger from '@/utils/logger';
import { Link } from 'react-router-dom';

interface SimpleDocumentViewerProps {
  documentId: string;
  onLoadFailure?: () => void;
}

export const SimpleDocumentViewer: React.FC<SimpleDocumentViewerProps> = ({ 
  documentId, 
  onLoadFailure 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { 
    document, 
    isLoading, 
    error, 
    contentUrl, 
    loadDocument, 
    analyzeDocument 
  } = useDocument();

  // Load document when component mounts or documentId changes
  useEffect(() => {
    const loadDocumentData = async () => {
      try {
        await loadDocument(documentId);
      } catch (error) {
        logger.error('Error loading document:', error);
        if (onLoadFailure) {
          onLoadFailure();
        }
      }
    };

    loadDocumentData();
  }, [documentId, loadDocument, onLoadFailure]);

  // Handle document analysis
  const handleAnalyzeDocument = async () => {
    if (!document) return;
    
    setIsAnalyzing(true);
    try {
      await analyzeDocument();
    } catch (error) {
      logger.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle document updates (like tasks or comments added)
  const handleDocumentUpdated = () => {
    loadDocument(documentId);
  };

  if (isLoading) {
    return (
      <ViewerLoadingState 
        onRetry={() => loadDocument(documentId)}
        networkError={false}
      />
    );
  }

  if (error) {
    return (
      <ViewerErrorState 
        error={error} 
        onRetry={() => loadDocument(documentId)}
      />
    );
  }

  if (!document) {
    return <ViewerNotFoundState />;
  }

  // Adapt document to the format expected by original components
  const adaptedDocument = {
    id: document.id,
    title: document.title,
    type: document.type,
    created_at: document.created_at,
    updated_at: document.created_at,
    storage_path: contentUrl || '',
    analysis: document.analysis ? [{ 
      id: `${document.id}-analysis`,
      content: document.analysis
    }] : [],
    comments: [],
    tasks: [], // Tasks will be loaded from local storage by the TaskManager
    versions: []
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 py-4 px-6 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Document Analyzer</h1>
        <div className="flex gap-4">
          <Link to="/custom-analysis" className="text-blue-300 hover:text-blue-100">
            Custom Analysis
          </Link>
        </div>
      </header>
      <div className="h-full overflow-hidden rounded-lg shadow-sm border border-border/20">
        <ViewerLayout
          documentTitle={document.title}
          documentType={document.type}
          isForm47={document.title?.toLowerCase().includes('form 47')}
          sidebar={
            <Sidebar 
              document={adaptedDocument}
              onDeadlineUpdated={handleDocumentUpdated}
            />
          }
          mainContent={
            <DocumentPreview 
              storagePath={contentUrl || ''} 
              title={document.title}
              documentId={document.id}
              bypassAnalysis={false}
              onAnalyzeRequest={handleAnalyzeDocument}
              isAnalyzing={isAnalyzing}
              forcePdfDisplay={document.type.includes('pdf')}
            />
          }
          collaborationPanel={
            <CollaborationPanel 
              document={adaptedDocument} 
              onCommentAdded={handleDocumentUpdated} 
            />
          }
          versionPanel={
            <VersionTab 
              documentId={documentId}
              versions={[]}
            />
          }
        />
        <TaskManager 
          documentId={documentId} 
          tasks={[]} 
          onTaskUpdate={handleDocumentUpdated} 
        />
      </div>
    </div>
  );
};
