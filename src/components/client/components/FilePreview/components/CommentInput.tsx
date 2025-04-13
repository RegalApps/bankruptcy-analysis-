
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface CommentInputProps {
  onAddComment?: (comment: string) => void;
  isLoading?: boolean;
}

export const CommentInput: React.FC<CommentInputProps> = ({ 
  onAddComment,
  isLoading = false
}) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (comment.trim() && onAddComment) {
      onAddComment(comment);
      setComment('');
    }
  };

  return (
    <div className="p-3 border-t">
      <div className="flex gap-2">
        <Textarea
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="resize-none"
          rows={2}
        />
        <Button 
          size="icon" 
          onClick={handleSubmit}
          disabled={!comment.trim() || isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
