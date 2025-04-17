
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientDocumentTree } from "./ClientDocumentTree";
import { useDocumentTree } from "./useDocumentTree";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { DocumentTreeNode } from "@/utils/documents/types";

interface DocumentTreeProps {
  onNodeSelect: (node: any) => void;
  onFileOpen: (node: any) => void;
  rootNodes?: DocumentTreeNode[]; // This prop should be defined
}

export const DocumentTree = ({ 
  onNodeSelect,
  onFileOpen,
  rootNodes // Make sure this prop is recognized
}: DocumentTreeProps) => {
  const { documentTree, isLoading } = useDocumentTree();
  
  // Use passed rootNodes if available, otherwise use documentTree from hook
  const effectiveNodes = rootNodes || documentTree;

  if (isLoading && !rootNodes) {
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

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-4 p-4">
        {clients.map((client) => (
          <ClientDocumentTree
            key={client.id}
            client={client}
            onDocumentSelect={(documentId) => {
              const node = findDocumentNode(effectiveNodes, documentId);
              if (node) {
                onFileOpen(node);
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
