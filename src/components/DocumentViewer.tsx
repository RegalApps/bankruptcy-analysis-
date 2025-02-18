
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { FileText, MessageSquare, Send } from "lucide-react";

interface DocumentViewerProps {
  documentId: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface DocumentDetails {
  id: string;
  title: string;
  type: string;
  url: string;
  storage_path: string;
  analysis?: {
    content: string;
  };
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
      fetchDocumentDetails(); // Refresh comments
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment"
      });
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

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-md bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{document.title}</h2>
              <p className="text-sm text-muted-foreground">{document.type}</p>
            </div>
          </div>
          <a 
            href={`${supabase.storage.from('documents').getPublicUrl(document.storage_path).data.publicUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Open Document
          </a>
        </div>

        {document.analysis?.[0]?.content && (
          <div className="mt-6 p-4 rounded-md bg-muted">
            <h3 className="font-medium mb-2">Analysis</h3>
            <p className="text-sm text-muted-foreground">{document.analysis[0].content}</p>
          </div>
        )}
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Comments</h3>
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
  );
};
