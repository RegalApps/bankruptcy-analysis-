
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizonal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CommentInputProps {
  onAddComment?: (comment: string) => void;
  isLoading?: boolean;
  suggestedComments?: string[];
}

export const CommentInput: React.FC<CommentInputProps> = ({ 
  onAddComment,
  isLoading = false,
  suggestedComments = []
}) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && onAddComment) {
      onAddComment(comment.trim());
      setComment('');
    }
  };

  const handleSuggestedCommentClick = (suggestedComment: string) => {
    setComment(prevComment => {
      // If there's already text, add the suggestion as a new line
      return prevComment ? `${prevComment}\n${suggestedComment}` : suggestedComment;
    });
  };

  return (
    <div className="border-t p-3">
      {suggestedComments.length > 0 && (
        <div className="mb-2">
          <p className="text-xs text-muted-foreground mb-1.5">Suggested comments:</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {suggestedComments.map((suggestion, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-secondary"
                onClick={() => handleSuggestedCommentClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full resize-none min-h-[80px]"
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!comment.trim() || isLoading}
            size="sm"
            className="gap-1"
          >
            <SendHorizonal className="h-4 w-4" />
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </form>
    </div>
  );
};
