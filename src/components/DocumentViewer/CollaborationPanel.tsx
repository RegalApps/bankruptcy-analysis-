
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { DocumentDetails } from "./types";
import { Comment } from "./Comments/types";
import { TaskManager } from "./TaskManager";

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

  // Properly map document comments to Comment type with all required properties
  const typedComments: Comment[] = document.comments ? document.comments.map(comment => ({
    id: comment.id,
    content: comment.content,
    created_at: comment.created_at,
    user_id: comment.user_id,
    document_id: document.id,
    parent_id: undefined,
    mentions: [],
    is_resolved: false
  })) : [];

  return (
    <div className="h-full flex flex-col">
      <div className="space-y-2 flex-1 overflow-auto">
        {typedComments.length > 0 ? (
          typedComments.map((comment) => (
            <div key={comment.id} className="p-2 rounded-md bg-muted/40">
              <p className="text-sm">{comment.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-3">
            <p className="text-xs text-muted-foreground">No comments yet</p>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1 mt-3 pt-2 border-t">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 min-w-0 rounded-md border bg-background px-2 py-1.5 text-xs"
          onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
        />
        <button
          onClick={handleAddComment}
          className="inline-flex items-center justify-center rounded-md bg-primary px-2 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </button>
      </div>
    </div>
  );
};
