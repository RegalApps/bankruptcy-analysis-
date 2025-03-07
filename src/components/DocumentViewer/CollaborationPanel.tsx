
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { DocumentDetails } from "./types";
import { Comment } from "./Comments/types";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="mb-2 flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Document Comments</h3>
      </div>
      
      <div className="space-y-2 flex-1 overflow-auto border rounded-md bg-muted/10 p-2">
        {typedComments.length > 0 ? (
          typedComments.map((comment) => (
            <div key={comment.id} className="p-3 rounded-md bg-white dark:bg-muted/40 shadow-sm">
              <p className="text-sm text-foreground">{comment.content}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
                <span className="text-xs px-2 py-1 bg-primary/10 rounded-full text-primary">User ID: {comment.user_id.substring(0, 6)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 px-3">
            <p className="text-sm text-muted-foreground">No comments yet</p>
            <p className="text-xs text-muted-foreground mt-1">Start the conversation by adding a comment below</p>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 mt-3 pt-2 border-t">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 min-w-0 rounded-md border bg-background px-3 py-2 text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
        />
        <Button
          onClick={handleAddComment}
          size="sm"
          className="gap-1"
        >
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </div>
    </div>
  );
};
