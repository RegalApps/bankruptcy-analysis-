
import { useEffect, useState } from "react";
import { buildDocumentTree } from "@/utils/documents/documentSync";
import { DocumentTreeNode } from "@/utils/documents/types";
import { DocumentDisplay } from "./DocumentDisplay";
import { DocumentTree } from "./DocumentTree";
import { DocumentViewerPanel } from "../DocumentViewer/DocumentViewerPanel";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { UploadButton } from "./UploadButton";
import { useDocumentSync } from "@/hooks/useDocumentSync";

interface DocumentsContainerProps {
  clientId?: string;
  clientName?: string;
  initialDocumentId?: string;
}

export const DocumentsContainer = ({
  clientId,
  clientName,
  initialDocumentId
}: DocumentsContainerProps) => {
  const [documentTree, setDocumentTree] = useState<DocumentTreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(initialDocumentId || null);
  const { toast } = useToast();

  // Load document tree
  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      try {
        const tree = await buildDocumentTree();
        setDocumentTree(tree);
        console.log("DocumentsContainer: Document tree loaded successfully", tree.length, "root items");
      } catch (error) {
        console.error("Error loading document tree:", error);
        toast({
          title: "Error loading documents",
          description: "There was a problem loading your documents. Please try refreshing the page.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocuments();
  }, [toast]);
  
  // Set up sync for real-time updates
  useDocumentSync(() => {
    // Rebuild document tree when changes are detected
    buildDocumentTree().then(tree => {
      console.log("DocumentsContainer: Document tree updated from sync", tree.length, "root items");
      setDocumentTree(tree);
    });
  });

  // Set initial document selection from prop
  useEffect(() => {
    if (initialDocumentId) {
      console.log("DocumentsContainer: Setting initial document ID:", initialDocumentId);
      setSelectedDocumentId(initialDocumentId);
    }
  }, [initialDocumentId]);

  const handleDocumentSelected = (documentId: string) => {
    console.log("DocumentsContainer: Document selected:", documentId);
    setSelectedDocumentId(documentId);
  };

  // Define handler functions for DocumentTree
  const handleNodeSelect = (node: any) => {
    console.log("Selected node:", node);
    // If the node is a file, select it
    if (node.type === 'file') {
      setSelectedDocumentId(node.id);
    }
  };
  
  const handleFileOpen = (node: any) => {
    console.log("Opening file:", node);
    setSelectedDocumentId(node.id);
  };

  const handleDocumentUploaded = (documentId: string) => {
    console.log("DocumentsContainer: Document uploaded:", documentId);
    // Refresh the document tree
    buildDocumentTree().then(tree => {
      console.log("DocumentsContainer: Tree refreshed after upload", tree.length, "root items");
      setDocumentTree(tree);
    });
    
    // Select the newly uploaded document
    setSelectedDocumentId(documentId);
    
    toast({
      title: "Document uploaded successfully",
      description: "The document will be processed and analyzed"
    });
  };

  return (
    <div className="flex h-full">
      <div className="w-1/4 border-r p-4">
        <div className="mb-4">
          <UploadButton 
            clientId={clientId} 
            clientName={clientName} 
            onUploadComplete={handleDocumentUploaded}
            variant="outline"
            className="w-full"
          />
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <DocumentTree 
            documents={documentTree}
            selectedDocumentId={selectedDocumentId}
            onDocumentSelect={handleDocumentSelected}
            clientId={clientId}
            onNodeSelect={handleNodeSelect}
            onFileOpen={handleFileOpen}
          />
        )}
      </div>
      
      <div className="flex-1">
        {selectedDocumentId ? (
          <DocumentViewerPanel 
            documentId={selectedDocumentId} 
            onClose={() => setSelectedDocumentId(null)}
          />
        ) : (
          <DocumentDisplay />
        )}
      </div>
    </div>
  );
};
