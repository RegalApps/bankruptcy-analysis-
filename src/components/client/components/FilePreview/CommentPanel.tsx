
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send } from "lucide-react";

interface CommentPanelProps {
  documentId: string;
}

export const CommentPanel = ({ documentId }: CommentPanelProps) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        avatar: "/avatars/sarah.jpg",
        initials: "SJ",
      },
      content: "Please review the highlighted sections on page 2. There are some discrepancies with the financial data.",
      timestamp: "2023-06-15T14:30:00Z",
    },
    {
      id: "2",
      user: {
        name: "Michael Chen",
        avatar: "/avatars/michael.jpg",
        initials: "MC",
      },
      content: "I've made some corrections to the document. Let me know if you need any clarification.",
      timestamp: "2023-06-16T09:45:00Z",
    },
  ]);
  
  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    
    // Add new comment
    const newComment = {
      id: Date.now().toString(),
      user: {
        name: "You",
        avatar: "/avatars/you.jpg",
        initials: "YO",
      },
      content: comment,
      timestamp: new Date().toISOString(),
    };
    
    setComments([...comments, newComment]);
    setComment("");
  };
  
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex-1 space-y-4 mb-4">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar>
                <AvatarImage src={c.user.avatar} alt={c.user.name} />
                <AvatarFallback>{c.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-medium">{c.user.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(c.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-sm">{c.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-6">
            <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No comments yet</p>
            <p className="text-sm text-muted-foreground">Be the first to add a comment</p>
          </div>
        )}
      </div>
      
      <div className="border-t pt-4">
        <div className="flex gap-3">
          <Avatar>
            <AvatarFallback>YO</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none mb-2"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment} 
                disabled={!comment.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
