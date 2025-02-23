
import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Header } from "./Header";
import { SearchBar } from "./SearchBar";
import { DocumentList } from "./DocumentList";
import { DocumentUploadButton } from "./DocumentUploadButton";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { TreeView } from "./TreeView";

interface DocumentManagementProps {
  onDocumentSelect: (id: string) => void;
}

interface DocumentNode {
  id: string;
  title: string;
  type: string;
  children?: DocumentNode[];
}

export const DocumentManagement: React.FC<DocumentManagementProps> = ({ onDocumentSelect }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [treeData, setTreeData] = useState<DocumentNode[]>([]);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      console.log("Fetching documents...");
      setIsLoading(true);

      const { data, error } = await supabase
        .from('documents')
        .select(`
          id,
          title,
          type,
          size,
          storage_path,
          created_at,
          updated_at,
          metadata
        `)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch documents"
        });
        return;
      }

      // Process and organize documents into tree structure
      const processedData = data?.map(doc => ({
        ...doc,
        type: doc.type || determineFileType(doc.title)
      })) || [];

      // Organize documents into tree structure
      const tree = organizeDocumentsIntoTree(processedData);

      console.log('Processed documents:', processedData);
      setDocuments(processedData);
      setTreeData(tree);
    } catch (error) {
      console.error('Error in fetchDocuments:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while fetching documents"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const organizeDocumentsIntoTree = (docs: any[]): DocumentNode[] => {
    // First, group by client (assuming we extract client from metadata)
    const clientGroups = docs.reduce((acc, doc) => {
      const clientName = doc.metadata?.client_name || 'Uncategorized';
      if (!acc[clientName]) {
        acc[clientName] = [];
      }
      acc[clientName].push(doc);
      return acc;
    }, {} as Record<string, any[]>);

    // Then, for each client, group by document type
    return Object.entries(clientGroups).map(([clientName, clientDocs]) => {
      const typeGroups = clientDocs.reduce((acc, doc) => {
        const type = doc.type || 'Other';
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(doc);
        return acc;
      }, {} as Record<string, any[]>);

      // Create the tree structure
      return {
        id: clientName,
        title: clientName,
        type: 'client',
        children: Object.entries(typeGroups).map(([type, docs]) => ({
          id: `${clientName}-${type}`,
          title: type,
          type: 'category',
          children: docs.map(doc => ({
            id: doc.id,
            title: doc.title,
            type: 'document'
          }))
        }))
      };
    });
  };

  const determineFileType = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'PDF Document';
      case 'doc':
      case 'docx':
        return 'Word Document';
      case 'xls':
      case 'xlsx':
        return 'Excel Spreadsheet';
      case 'ppt':
      case 'pptx':
        return 'PowerPoint Presentation';
      case 'txt':
        return 'Text Document';
      default:
        return 'Other';
    }
  };

  useEffect(() => {
    fetchDocuments();

    const channel = supabase
      .channel('document_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'documents' },
        () => {
          console.log('Document change detected, refreshing...');
          fetchDocuments();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <Header />
      <div className="grid gap-6 grid-cols-[300px,1fr]">
        <aside className="h-[calc(100vh-6rem)] border-r">
          <div className="p-4 space-y-4">
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <TreeView 
              data={treeData} 
              onSelect={onDocumentSelect}
              searchQuery={searchQuery}
            />
          </div>
        </aside>

        <main className="space-y-6">
          <div className="flex justify-end px-4">
            <DocumentUploadButton />
          </div>
          
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 px-4">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className="h-[120px] rounded-lg border bg-card animate-pulse"
                />
              ))}
            </div>
          ) : (
            <DocumentList 
              documents={documents}
              searchQuery={searchQuery}
              onDocumentSelect={onDocumentSelect}
            />
          )}

          <div className="fixed bottom-6 right-6">
            <div className="rounded-lg border bg-card p-4">
              <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
              <FileUpload />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
