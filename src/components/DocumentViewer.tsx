import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { FileText, MessageSquare, Send, AlertTriangle, CheckCircle, Calendar } from "lucide-react";

interface DocumentViewerProps {
  documentId: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface DocumentAnalysis {
  clientName: string;
  trusteeName: string;
  dateSigned: string;
  formNumber: string;
  documentType: string;
  risks: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
}

interface DocumentDetails {
  id: string;
  title: string;
  type: string;
  url: string;
  storage_path: string;
  analysis?: {
    content: string;
    extracted_info?: DocumentAnalysis;
  }[];
  comments?: Comment[];
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentId }) => {
  const [document, setDocument] = useState<DocumentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchDocumentDetails();
  }, [documentId]);

  const fetchDocumentDetails = async () => {
    try {
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select(`
          *,
          analysis:document_analysis(content),
          comments:document_comments(id, content, created_at, user_id)
        `)
        .eq('id', documentId)
        .single();

      if (docError) throw docError;
      setDocument(document);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load document details"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('document_comments')
        .insert([
          {
            document_id: documentId,
            content: newComment,
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment added successfully"
      });

      setNewComment("");
      fetchDocumentDetails();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment"
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Document not found</p>
      </div>
    );
  }

  const extractedInfo = document.analysis?.[0]?.extracted_info;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Panel - Document Analysis */}
      <div className="lg:col-span-3 space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-2 rounded-md bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{document.title}</h2>
              <p className="text-sm text-muted-foreground">{document.type}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-md bg-muted">
              <h3 className="font-medium mb-2">Document Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Client Name:</span>
                  <p>{extractedInfo?.clientName || 'Not extracted'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Trustee Name:</span>
                  <p>{extractedInfo?.trusteeName || 'Not extracted'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date Signed:</span>
                  <p>{extractedInfo?.dateSigned || 'Not extracted'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Form Number:</span>
                  <p>{extractedInfo?.formNumber || 'Not extracted'}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-md bg-muted">
              <h3 className="font-medium mb-2">Risk Assessment</h3>
              <div className="space-y-2">
                {extractedInfo?.risks ? (
                  extractedInfo.risks.map((risk, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      {risk.severity === 'high' ? (
                        <AlertTriangle className={`h-4 w-4 ${getSeverityColor(risk.severity)} mt-0.5`} />
                      ) : (
                        <CheckCircle className={`h-4 w-4 ${getSeverityColor(risk.severity)} mt-0.5`} />
                      )}
                      <div>
                        <p className="font-medium">{risk.type}</p>
                        <p className="text-muted-foreground text-xs">{risk.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No risks identified</p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-md bg-muted">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Deadlines</h3>
                <button className="text-sm text-primary hover:underline">
                  <Calendar className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">No deadlines set</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Panel - Document View */}
      <div className="lg:col-span-6">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Document Preview</h3>
            <a 
              href={`${supabase.storage.from('documents').getPublicUrl(document.storage_path).data.publicUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Open Document
            </a>
          </div>
          
          <div className="aspect-[3/4] w-full bg-muted rounded-lg">
            <iframe
              src={`${supabase.storage.from('documents').getPublicUrl(document.storage_path).data.publicUrl}`}
              className="w-full h-full rounded-lg"
              title="Document Preview"
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Comments & Collaboration */}
      <div className="lg:col-span-3 space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Comments & Collaboration</h3>
          </div>

          <div className="space-y-4">
            {document.comments && document.comments.map((comment) => (
              <div key={comment.id} className="p-3 rounded-md bg-muted">
                <p className="text-sm">{comment.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}

            <div className="flex items-center space-x-2 mt-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 min-w-0 rounded-md border bg-background px-3 py-2 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
