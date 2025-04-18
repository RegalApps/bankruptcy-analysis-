
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { DocumentTreeNode } from '@/utils/documents/types/index';
import { toast } from 'sonner';

interface DocumentsContextType {
  clients: any[];
  documents: DocumentTreeNode[];
  selectedClientId: string | null;
  isLoading: boolean;
  setSelectedClientId: (id: string | null) => void;
  refreshDocuments: () => Promise<void>;
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

export const useDocumentsContext = () => {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error('useDocumentsContext must be used within a DocumentsProvider');
  }
  return context;
};

export const DocumentsProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [documents, setDocuments] = useState<DocumentTreeNode[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false });

      if (documentsError) throw documentsError;

      // Extract unique clients from documents
      const clientsMap = new Map();
      documentsData.forEach((doc: any) => {
        if (doc.metadata?.client_name) {
          const clientName = doc.metadata.client_name;
          if (!clientsMap.has(clientName)) {
            clientsMap.set(clientName, {
              id: clientName.toLowerCase().replace(/\s+/g, '-'),
              name: clientName,
              status: 'active',
              lastActivity: doc.updated_at
            });
          }
        }
      });

      // Create document tree
      const documentTree = buildDocumentTree(documentsData);
      
      setDocuments(documentTree);
      setClients(Array.from(clientsMap.values()));
    } catch (error) {
      console.error('Error fetching document data:', error);
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  // Build document tree from flat document list
  const buildDocumentTree = (documents: any[]): DocumentTreeNode[] => {
    // Create a map of parent ids to children
    const childrenMap = new Map<string, DocumentTreeNode[]>();
    const roots: DocumentTreeNode[] = [];

    // First pass: create all nodes
    documents.forEach(doc => {
      const node: DocumentTreeNode = {
        id: doc.id,
        name: doc.title,
        type: doc.is_folder ? 'folder' : 'file',
        parentId: doc.parent_folder_id,
        status: doc.ai_processing_status as any,
        metadata: doc.metadata,
        storagePath: doc.storage_path,
        folderType: doc.folder_type,
        filePath: doc.url
      };

      if (doc.parent_folder_id) {
        if (!childrenMap.has(doc.parent_folder_id)) {
          childrenMap.set(doc.parent_folder_id, []);
        }
        childrenMap.get(doc.parent_folder_id)?.push(node);
      } else {
        roots.push(node);
      }
    });

    // Second pass: build tree by assigning children
    const assignChildren = (node: DocumentTreeNode): DocumentTreeNode => {
      const children = childrenMap.get(node.id);
      if (children) {
        node.children = children;
        children.forEach(assignChildren);
      }
      return node;
    };

    return roots.map(assignChildren);
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel('document_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        (payload) => {
          console.log('Document change detected:', payload);
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <DocumentsContext.Provider
      value={{
        clients,
        documents,
        selectedClientId,
        isLoading,
        setSelectedClientId,
        refreshDocuments: fetchData
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
};
