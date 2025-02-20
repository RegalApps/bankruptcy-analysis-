
import { useState, useRef } from "react";
import { Send, UserCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CommentInputProps } from "./types";

export const CommentInput = ({ 
  currentUser, 
  userProfile,
  onSubmit,
  isSubmitting 
}: CommentInputProps) => {
  const [content, setContent] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    await onSubmit(content);
    setContent("");
  };

  return (
    <>
      <div className="flex items-center space-x-2 mt-4">
        <input
          ref={inputRef}
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 min-w-0 rounded-md border bg-background px-3 py-2 text-sm"
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          disabled={isSubmitting}
        />
        <button
          onClick={handleSubmit}
          className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          disabled={!currentUser || isSubmitting}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      {!currentUser && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Please sign in to add comments
        </p>
      )}
    </>
  );
};
