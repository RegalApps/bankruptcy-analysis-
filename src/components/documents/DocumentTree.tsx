
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientDocumentTree } from "./ClientDocumentTree";
import { Document } from "@/components/DocumentList/types";
import { useCallback } from "react";

interface DocumentTreeProps {
  rootNodes: any[];
  onNodeSelect: (node: any) => void;
  onFileOpen: (node: any) => void;
}

export const DocumentTree = ({ 
  rootNodes, 
  onNodeSelect,
  onFileOpen 
}: DocumentTreeProps) => {
  const groupDocumentsByClient = useCallback((nodes: any[]) => {
    const clientMap = new Map<string, { id: string; name: string; documents: Document[] }>();

    // Recursively process nodes to extract documents
    const processNode = (node: any) => {
      if (node.type === 'file') {
        const clientId = node.id.split('-')[0];
        const client = clientMap.get(clientId) || {
          id: clientId,
          name: findClientName(rootNodes, clientId),
          documents: []
        };
        client.documents.push({
          id: node.id,
          title: node.name,
          type: node.folderType || 'document',
          storage_path: node.filePath || '',
          size: 0,
          // Add the missing required properties
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        clientMap.set(clientId, client);
      }
      node.children?.forEach(processNode);
    };

    rootNodes.forEach(processNode);
    return Array.from(clientMap.values());
  }, [rootNodes]);

  const findClientName = (nodes: any[], clientId: string): string => {
    for (const node of nodes) {
      if (node.id === `${clientId}-root`) {
        return node.name;
      }
    }
    return 'Unknown Client';
  };

  const clients = groupDocumentsByClient(rootNodes);

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-4 p-4">
        {clients.map((client) => (
          <ClientDocumentTree
            key={client.id}
            client={client}
            onDocumentSelect={(documentId) => {
              const node = findDocumentNode(rootNodes, documentId);
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
