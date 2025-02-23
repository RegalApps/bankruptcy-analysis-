
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Document, DocumentNode } from "../types";
import { determineFileType, organizeDocumentsIntoTree } from "../utils/documentUtils";

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
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
      const processedData = (data as Document[])?.map(doc => ({
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

  return {
    documents,
    treeData,
    isLoading,
    searchQuery,
    setSearchQuery
  };
};
