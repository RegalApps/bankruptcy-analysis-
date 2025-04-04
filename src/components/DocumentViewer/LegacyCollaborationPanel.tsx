
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { DocumentDetails } from "./types";
import { Comment } from "./Comments/types";
import { MessageSquare, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
        title: "Comment added",
        description: "Your comment has been added successfully"
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto space-y-3 pr-1">
        {typedComments.length > 0 ? (
          typedComments.map((comment) => {
            const { date, time } = formatDateTime(comment.created_at);
            return (
              <div key={comment.id} className="p-3 rounded-md bg-white dark:bg-muted/40 shadow-sm border border-border/50">
                <div className="flex items-start gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      <User className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground break-words">{comment.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {date} at {time}
                      </p>
                      <span className="text-xs px-2 py-0.5 bg-primary/10 rounded-full text-primary">
                        User {comment.user_id.substring(0, 6)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-32 p-4">
            <MessageSquare className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
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
          <span className="sr-only sm:not-sr-only sm:inline">Send</span>
        </Button>
      </div>
    </div>
  );
};
