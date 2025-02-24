
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { DocumentStats } from "./DocumentStats";
import { DocumentUpload } from "./DocumentUpload";
import { DocumentList } from "./DocumentList";

interface Document {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

export const DocumentVault = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
    subscribeToDocumentUpdates();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch documents"
      });
    }
  };

  const subscribeToDocumentUpdates = () => {
    const channel = supabase
      .channel('document_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        (payload) => {
          console.log('Document update:', payload);
          fetchDocuments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Secure Document Vault</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <DocumentStats pendingCount={documents.filter(d => d.status === 'pending').length} />
            <DocumentUpload />
            <DocumentList documents={documents} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
