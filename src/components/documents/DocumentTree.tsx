import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientDocumentTree } from "./ClientDocumentTree";
import { useDocumentTree } from "./useDocumentTree";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { DocumentTreeNode } from "@/utils/documents/types";

interface DocumentTreeProps {
  onNodeSelect: (node: any) => void;
  onFileOpen: (node: any) => void;
  rootNodes?: DocumentTreeNode[];
  documents?: DocumentTreeNode[]; // Added this prop
  selectedDocumentId?: string;    // Added this prop
  onDocumentSelect?: (documentId: string) => void; // Added this prop
  clientId?: string;              // Added this prop
}

export const DocumentTree = ({ 
  onNodeSelect,
  onFileOpen,
  rootNodes, // This prop is recognized
  documents, // Added this prop
  selectedDocumentId, // Added this prop
  onDocumentSelect, // Added this prop
  clientId // Added this prop
}: DocumentTreeProps) => {
  const { documentTree, isLoading } = useDocumentTree();
  
  // Use passed rootNodes or documents if available, otherwise use documentTree from hook
  const effectiveNodes = rootNodes || documents || documentTree;

  if (isLoading && !rootNodes && !documents) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  const groupDocumentsByClient = (nodes: any[]) => {
    const clientMap = new Map();
    
    const processNode = (node: any) => {
      if (node.type === 'file') {
        const clientName = node.metadata?.client_name || 'Uncategorized';
        const client = clientMap.get(clientName) || {
          id: node.id,
          name: clientName,
          documents: []
        };
        client.documents.push(node);
        clientMap.set(clientName, client);
      }
      node.children?.forEach(processNode);
    };

    effectiveNodes.forEach(processNode);
    return Array.from(clientMap.values());
  };

  const clients = groupDocumentsByClient(effectiveNodes);

  // If we have clientId, handle client-specific behavior
  if (clientId && selectedDocumentId && onDocumentSelect) {
    // Client-specific view logic could go here if needed
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-4 p-4">
        {clients.map((client) => (
          <ClientDocumentTree
            key={client.id}
            client={client}
            onDocumentSelect={(documentId) => {
              if (onDocumentSelect) {
                onDocumentSelect(documentId);
              } else {
                const node = findDocumentNode(effectiveNodes, documentId);
                if (node) {
                  onFileOpen(node);
                }
              }
            }}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

function findDocumentNode(nodes: any[], documentId: string): any {
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
