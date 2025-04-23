import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DocumentData, 
  getDocumentById,
  uploadDocument,
  deleteDocument,
  BankruptcyAnalysisResult,
  analyzeDocument
} from '@/utils/documentOperations';
import logger from '@/utils/logger';

interface DocumentContextState {
  document: DocumentData | null;
  isLoading: boolean;
  isAnalyzing: boolean;
  error: string | null;
}

interface DocumentContextValue extends DocumentContextState {
  getDocument: (id: string) => Promise<DocumentData | null>;
  analyzeDocument: (documentId: string) => Promise<boolean>;
  deleteDocument: () => Promise<boolean>;
}

const DocumentContext = createContext<DocumentContextValue | undefined>(undefined);

export const DocumentProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, setState] = useState<DocumentContextState>({
    document: null,
    isLoading: false,
    isAnalyzing: false,
    error: null
  });

  const getDocument = async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const doc = await getDocumentById(id);
      
      if (!doc) {
        throw new Error(`Document not found: ${id}`);
      }
      
      setState(prev => ({
        ...prev,
        document: doc,
        isLoading: false
      }));
      
      return doc;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      return null;
    }
  };

  const analyzeDocument = async (documentId: string) => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    
    try {
      // Use the analyzeDocument function from documentOperations
      const result = await analyzeDocument(documentId);
      const success = !!result;
      
      if (success) {
        // Refresh the document to get the updated analysis
        const updatedDoc = await getDocumentById(documentId);
        
        if (updatedDoc) {
          setState(prev => ({
            ...prev,
            document: updatedDoc,
            isAnalyzing: false
          }));
        }
      } else {
        // Silently handle failure without showing error in UI
        setState(prev => ({
          ...prev,
          isAnalyzing: false
        }));
      }
      
      return success;
    } catch (error) {
      // Log error but don't display in UI to prevent console errors
      logger.error(`Error analyzing document: ${error instanceof Error ? error.message : String(error)}`);
      setState(prev => ({
        ...prev,
        isAnalyzing: false
      }));
      return false;
    }
  };

  const removeDocument = async (): Promise<boolean> => {
    if (!state.document) {
      return false;
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await deleteDocument(state.document.id);
      
      if (success) {
        setState({
          document: null,
          isLoading: false,
          isAnalyzing: false,
          error: null
        });
      }
      
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      return false;
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        ...state,
        getDocument,
        analyzeDocument,
        deleteDocument: removeDocument
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};
