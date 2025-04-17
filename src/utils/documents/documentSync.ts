
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { DocumentTreeNode } from "./types";

export const setupDocumentSync = (onUpdate: () => void) => {
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
        onUpdate();
        
        // Show toast notification based on the event
        if (payload.eventType === 'INSERT') {
          toast.success('New document added');
        } else if (payload.eventType === 'UPDATE') {
          toast.success('Document updated');
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const buildDocumentTree = async (): Promise<DocumentTreeNode[]> => {
  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }

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
      status: doc.ai_processing_status,
      metadata: doc.metadata,
      storagePath: doc.storage_path
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
  const assignChildren = (node: DocumentTreeNode) => {
    const children = childrenMap.get(node.id);
    if (children) {
      node.children = children;
      children.forEach(assignChildren);
    }
    return node;
  };

  return roots.map(assignChildren);
};
