
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Document {
  id: string;
  title: string;
  type: string;
  created_at: string;
  last_accessed: string;
  client_name?: string;
}

interface RecentDocumentsProps {
  onDocumentSelect: (documentId: string) => void;
}

export const RecentDocuments = ({ onDocumentSelect }: RecentDocumentsProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecentDocuments = async () => {
      try {
        setIsLoading(true);
        
        // Get recent document access history
        const { data: accessHistory, error: accessError } = await supabase
          .from('document_access_history')
          .select('document_id, accessed_at')
          .order('accessed_at', { ascending: false })
          .limit(10);
          
        if (accessError) throw accessError;
        
        if (!accessHistory || accessHistory.length === 0) {
          // Fall back to recent documents if no access history
          const { data: recentDocs, error: recentError } = await supabase
            .from('documents')
            .select('*')
            .eq('is_folder', false)
            .order('created_at', { ascending: false })
            .limit(10);
            
          if (recentError) throw recentError;
          
          const docsWithAccess = recentDocs?.map(doc => ({
            ...doc,
            last_accessed: doc.updated_at || doc.created_at,
            client_name: doc.metadata?.client_name
          })) || [];
          
          setDocuments(docsWithAccess);
          setIsLoading(false);
          return;
        }
        
        // Get documents from the access history
        const documentIds = accessHistory.map(record => record.document_id);
        const { data: docs, error: docsError } = await supabase
          .from('documents')
          .select('*')
          .in('id', documentIds)
          .eq('is_folder', false);
          
        if (docsError) throw docsError;
        
        // Map the access time to each document
        const accessedDocs = docs?.map(doc => {
          const accessRecord = accessHistory.find(record => record.document_id === doc.id);
          return {
            ...doc,
            last_accessed: accessRecord?.accessed_at || doc.updated_at || doc.created_at,
            client_name: doc.metadata?.client_name
          };
        }) || [];
        
        // Sort by last accessed time
        accessedDocs.sort((a, b) => {
          return new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime();
        });
        
        setDocuments(accessedDocs);
      } catch (error) {
        console.error('Error fetching recent documents:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load recent documents"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentDocuments();
  }, [toast]);

  const getDocumentTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'excel':
      case 'xlsx':
      case 'xls':
        return 'bg-green-100 text-green-800';
      case 'word':
      case 'doc':
      case 'docx':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No documents yet</h3>
        <p className="text-muted-foreground mb-4">
          Upload your first document to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map(doc => (
        <Card
          key={doc.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onDocumentSelect(doc.id)}
        >
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-medium truncate" title={doc.title}>
                  {doc.title}
                </h3>
                <Badge 
                  variant="outline" 
                  className={`text-xs font-normal ${getDocumentTypeColor(doc.type)}`}
                >
                  {doc.type || 'Unknown'}
                </Badge>
              </div>
              
              {doc.client_name && (
                <p className="text-sm">
                  Client: <span className="font-medium">{doc.client_name}</span>
                </p>
              )}
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                Last accessed: {new Date(doc.last_accessed).toLocaleString()}
              </div>
              
              <div className="pt-2">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDocumentSelect(doc.id);
                  }}
                >
                  Open Document
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
