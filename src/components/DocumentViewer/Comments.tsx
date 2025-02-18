
import { useState, useEffect } from "react";
import { MessageSquare, Send, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Comment } from "./types";
import { format } from "date-fns";

interface CommentsProps {
  documentId: string;
  comments?: Comment[];
  onCommentAdded: () => void;
}

export const Comments: React.FC<CommentsProps> = ({ documentId, comments, onCommentAdded }) => {
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });

    // Set up real-time subscription
    const channel = supabase
      .channel('document_comments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'document_comments',
          filter: `document_id=eq.${documentId}`
        },
        (payload) => {
          onCommentAdded(); // Refresh comments when new ones are added
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser) return;

    try {
      const { error } = await supabase
        .from('document_comments')
        .insert([
          {
            document_id: documentId,
            content: newComment,
            user_id: currentUser.id,
            user_email: currentUser.email,
            user_name: currentUser.user_metadata?.full_name || currentUser.email
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

  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Comments & Collaboration</h3>
        </div>
        {currentUser && (
          <div className="text-xs text-muted-foreground">
            Commenting as: {currentUser.email}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {comments && comments.map((comment) => (
          <div key={comment.id} className="p-4 rounded-md bg-muted">
            <div className="flex items-start space-x-2">
              <UserCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {comment.user_name || comment.user_email || 'Anonymous'}
                  </p>
                  <time className="text-xs text-muted-foreground">
                    {formatTimestamp(comment.created_at)}
                  </time>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
            </div>
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
            disabled={!currentUser}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        {!currentUser && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Please sign in to add comments
          </p>
        )}
      </div>
    </div>
  );
};
