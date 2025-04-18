
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { DocumentTreeNode } from '@/utils/documents/types';
import { toast } from 'sonner';

export const useDocumentTree = () => {
  const [documentTree, setDocumentTree] = useState<DocumentTreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const buildTree = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch documents from Supabase
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
      
      console.log('Document tree built:', tree);
      setDocumentTree(tree);
      return tree;
    } catch (error) {
      console.error('Error building document tree:', error);
      toast.error('Failed to load document tree');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshTree = useCallback(async () => {
    console.log('Refreshing document tree...');
    return buildTree();
  }, [buildTree]);

  // Initial load
  useEffect(() => {
    buildTree();
  }, [buildTree]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('document-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        () => {
          console.log('Document change detected, refreshing tree');
          refreshTree();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshTree]);

  return {
    documentTree,
    isLoading,
    refreshTree
  };
};
