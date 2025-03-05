
import { MessageSquare, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { DocumentDetails } from "./types";
import { Comment } from "./Comments/types";

interface CollaborationPanelProps {
  document: DocumentDetails;
  onCommentAdded: () => void;
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ document, onCommentAdded }) => {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('document_comments')
        .insert([
          {
            document_id: document.id,
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
      onCommentAdded();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment"
      });
    }
  };

  // Ensure document.comments has document_id property
  const typedComments: Comment[] = document.comments ? document.comments.map(comment => ({
    ...comment,
    document_id: document.id
  })) : [];

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center space-x-2 mb-4">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-medium">Comments & Collaboration</h3>
      </div>

      <div className="space-y-4">
        {typedComments.map((comment) => (
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
  );
};
