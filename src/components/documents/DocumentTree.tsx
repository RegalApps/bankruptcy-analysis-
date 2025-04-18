import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientDocumentTree } from "./ClientDocumentTree";
import { useDocumentTree } from "./useDocumentTree";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { DocumentTreeNode } from "@/utils/documents/types/index";
import { useEffect } from "react";

export interface DocumentTreeProps {
  onNodeSelect: (node: any) => void;
  onFileOpen: (node: any) => void;
  rootNodes?: DocumentTreeNode[];
  documents?: DocumentTreeNode[];
  selectedDocumentId?: string | null;
  onDocumentSelect?: (documentId: string) => void;
  clientId?: string;
}

export const DocumentTree = ({ 
  onNodeSelect,
  onFileOpen,
  rootNodes,
  documents,
  selectedDocumentId,
  onDocumentSelect,
  clientId
}: DocumentTreeProps) => {
  const { documentTree, isLoading, refreshTree } = useDocumentTree();
  
  // Use passed rootNodes or documents if available, otherwise use documentTree from hook
  const effectiveNodes = rootNodes || documents || documentTree;

  // Refresh tree when clientId changes
  useEffect(() => {
    if (clientId) {
      console.log("DocumentTree: ClientID changed, refreshing tree for", clientId);
      refreshTree();
    }
  }, [clientId, refreshTree]);

  if (isLoading && !rootNodes && !documents) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  const groupDocumentsByClient = (nodes: DocumentTreeNode[]) => {
    const clientMap = new Map();
    
    const processNode = (node: DocumentTreeNode) => {
      if (node.type === 'file') {
        const clientName = node.metadata?.client_name || 'Uncategorized';
        const client = clientMap.get(clientName) || {
          id: node.metadata?.client_id || node.id,
          name: clientName,
          documents: []
        };
        client.documents.push(node);
        clientMap.set(clientName, client);
      }
      node.children?.forEach(processNode);
    };

    nodes.forEach(processNode);
    return Array.from(clientMap.values());
  };

  // Handle document selection
  const handleDocumentSelection = (documentId: string) => {
    console.log("DocumentTree: Document selected:", documentId);
    if (onDocumentSelect) {
      onDocumentSelect(documentId);
    } else {
      const node = findDocumentNode(effectiveNodes, documentId);
      if (node) {
        onFileOpen(node);
      }
    }
  };

  const clients = groupDocumentsByClient(effectiveNodes);

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-4 p-4">
        {clients.map((client) => (
          <ClientDocumentTree
            key={client.id}
            client={client}
            onDocumentSelect={handleDocumentSelection}
            selectedDocumentId={selectedDocumentId || undefined}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

function findDocumentNode(nodes: DocumentTreeNode[], documentId: string): DocumentTreeNode | null {
  for (const node of nodes) {
    if (node.id === documentId) {
      return node;
    }
    if (node.children) {
      const found = findDocumentNode(node.children, documentId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}
