
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSignature, Shield, Clock, Bell, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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

  const handleSignDocument = async (documentId: string) => {
    try {
      const { error } = await supabase.functions.invoke('process-document', {
        body: {
          action: 'sign',
          documentId,
          signatureData: 'electronic_signature', // In real app, this would be actual signature data
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document signed successfully"
      });
    } catch (error) {
      console.error('Error signing document:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign document"
      });
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('secure_documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          file_path: filePath,
          status: 'pending'
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document uploaded successfully"
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload document"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Secure Document Vault</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileSignature className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Pending Signatures</h4>
                    <p className="text-sm text-muted-foreground">
                      {documents.filter(d => d.status === 'pending').length} documents
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Secure Documents</h4>
                    <p className="text-sm text-muted-foreground">128-bit encrypted</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Recent Activity</h4>
                    <p className="text-sm text-muted-foreground">Real-time updates</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                <label className="cursor-pointer">
                  Upload Document
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleUpload}
                    accept=".pdf,.doc,.docx"
                  />
                </label>
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Recent Documents</h4>
              {documents.map((doc) => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FileSignature className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.status === 'pending' ? 'Pending signature' : 'Signed'}
                        </p>
                      </div>
                    </div>
                    {doc.status === 'pending' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSignDocument(doc.id)}
                      >
                        Sign Document
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
