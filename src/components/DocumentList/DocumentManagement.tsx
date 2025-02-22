
import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Header } from "./Header";
import { SearchBar } from "./SearchBar";
import { DocumentList } from "./DocumentList";
import { DocumentUploadButton } from "./DocumentUploadButton";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface DocumentManagementProps {
  onDocumentSelect: (id: string) => void;
}

export const DocumentManagement: React.FC<DocumentManagementProps> = ({ onDocumentSelect }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      console.log("Fetching documents...");
      const { data, error } = await supabase
        .from('documents')
        .select('*')
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

      console.log('Fetched documents:', data);
      setDocuments(data || []);
    } catch (error) {
      console.error('Error in fetchDocuments:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while fetching documents"
      });
    }
  };

  useEffect(() => {
    fetchDocuments();

    const channel = supabase
      .channel('document_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
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
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <DocumentUploadButton />
          </div>
          <DocumentList 
            documents={documents}
            searchQuery={searchQuery}
            onDocumentSelect={onDocumentSelect}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
            <FileUpload />
          </div>
        </div>
      </div>
    </>
  );
};
