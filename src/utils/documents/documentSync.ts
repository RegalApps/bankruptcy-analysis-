
import { supabase } from '@/lib/supabase';
import { DocumentTreeNode } from '@/utils/documents/types/index';
import { toast } from 'sonner';

export const buildDocumentTree = async (): Promise<DocumentTreeNode[]> => {
  try {
    // Fetch all documents
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transform flat list to hierarchical structure
    const tree: DocumentTreeNode[] = [];
    const nodeMap = new Map<string, DocumentTreeNode>();
    
    // First pass: Create all nodes
    documents?.forEach(doc => {
      const node: DocumentTreeNode = {
        id: doc.id,
        name: doc.title,
        type: doc.is_folder ? 'folder' : 'file',
        status: doc.ai_processing_status,
        metadata: doc.metadata,
        storagePath: doc.storage_path,
        folderType: doc.folder_type,
        children: [],
        url: doc.url
      };
      
      nodeMap.set(doc.id, node);
    });
    
    // Second pass: Build the tree
    documents?.forEach(doc => {
      const node = nodeMap.get(doc.id);
      if (!node) return;
      
      if (doc.parent_folder_id) {
        const parent = nodeMap.get(doc.parent_folder_id);
        if (parent && parent.children) {
          parent.children.push(node);
        } else {
          // If parent not found, add to root
          tree.push(node);
        }
      } else {
        // Root level node
        tree.push(node);
      }
    });
    
    console.log('Document tree built with', tree.length, 'root nodes');
    return tree;
  } catch (error) {
    console.error('Error building document tree:', error);
    toast.error('Failed to load document tree');
    return [];
  }
};

export const setupDocumentSync = (onUpdate: () => void): (() => void) => {
  const channel = supabase
    .channel('document-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'documents'
      },
      (payload) => {
        console.log('Document change detected:', payload);
        
        // Show toast based on the event type
        if (payload.eventType === 'INSERT') {
          toast.success('New document added', {
            description: `Document "${payload.new.title}" has been added`
          });
        } else if (payload.eventType === 'UPDATE') {
          // Only show toast for meaningful updates (status changes, etc.)
          if (payload.old.ai_processing_status !== payload.new.ai_processing_status) {
            toast.info('Document updated', {
              description: `Document "${payload.new.title}" status changed to ${payload.new.ai_processing_status}`
            });
          }
        } else if (payload.eventType === 'DELETE') {
          toast.info('Document removed');
        }
        
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
