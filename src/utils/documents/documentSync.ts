
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { DocumentTreeNode, DocumentRecord } from "./types";

export const setupDocumentSync = (onUpdate: () => void) => {
  console.log("Setting up document sync");
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
    .subscribe((status) => {
      console.log("Document sync subscription status:", status);
    });

  return () => {
    console.log("Cleaning up document sync");
    supabase.removeChannel(channel);
  };
};

export const buildDocumentTree = async (): Promise<DocumentTreeNode[]> => {
  console.log("Building document tree");
  try {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return [];
    }

    console.log(`Fetched ${documents.length} documents`);

    // Create a map of parent ids to children
    const childrenMap = new Map<string, DocumentTreeNode[]>();
    const roots: DocumentTreeNode[] = [];

    // First pass: create all nodes
    documents.forEach((doc: DocumentRecord) => {
      const node: DocumentTreeNode = {
        id: doc.id,
        name: doc.title,
        type: doc.is_folder ? 'folder' : 'file',
        parentId: doc.parent_folder_id,
        status: doc.ai_processing_status,
        metadata: doc.metadata,
        storagePath: doc.storage_path,
        folderType: doc.folder_type
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

    const result = roots.map(assignChildren);
    console.log("Document tree built successfully");
    return result;
  } catch (err) {
    console.error("Error building document tree:", err);
    return [];
  }
};

// Function to add client-specific metadata filtering
export const getClientSpecificDocuments = async (clientId: string): Promise<DocumentTreeNode[]> => {
  if (!clientId) return [];
  
  console.log(`Fetching documents for client: ${clientId}`);
  try {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .or(`metadata->client_id.eq.${clientId},metadata->client_name.ilike.%${clientId}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching documents for client ${clientId}:`, error);
      return [];
    }

    console.log(`Fetched ${documents?.length || 0} documents for client ${clientId}`);
    
    // Process into tree structure
    const tree = buildClientDocumentTree(documents || []);
    return tree;
  } catch (err) {
    console.error(`Error processing documents for client ${clientId}:`, err);
    return [];
  }
};

// Helper function to build a client-specific document tree
const buildClientDocumentTree = (documents: DocumentRecord[]): DocumentTreeNode[] => {
  // Create a map of parent ids to children
  const childrenMap = new Map<string, DocumentTreeNode[]>();
  const roots: DocumentTreeNode[] = [];

  // First pass: create all nodes
  documents.forEach((doc) => {
    const node: DocumentTreeNode = {
      id: doc.id,
      name: doc.title,
      type: doc.is_folder ? 'folder' : 'file',
      parentId: doc.parent_folder_id,
      status: doc.ai_processing_status,
      metadata: doc.metadata,
      storagePath: doc.storage_path,
      folderType: doc.folder_type
    };

    if (doc.parent_folder_id && documents.some(d => d.id === doc.parent_folder_id)) {
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
