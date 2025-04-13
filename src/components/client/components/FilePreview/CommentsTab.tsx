
import React, { useState } from 'react';
import { Document, Comment } from '../../types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface CommentsTabProps {
  document: Document;
  onAddComment?: (comment: string) => void;
  isLoading?: boolean;
}

export const CommentsTab: React.FC<CommentsTabProps> = ({ 
  document, 
  onAddComment,
  isLoading = false
}) => {
  const [comment, setComment] = useState('');
  
  // Create a document object for the DocumentViewer with required props
  const viewerDocument = {
    id: document.id,
    title: document.title,
    type: document.type || 'document',
    user_id: document.user_id || '',
    created_at: document.created_at || new Date().toISOString(),
    updated_at: document.updated_at || new Date().toISOString(),
    comments: document.comments || [],
  };

  const handleSubmit = () => {
    if (comment.trim() && onAddComment) {
      onAddComment(comment);
      setComment('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto p-3 space-y-3">
        {!document.comments?.length ? (
          <p className="text-center text-sm text-muted-foreground pt-4">
            No comments yet. Be the first to add a comment.
          </p>
        ) : (
          document.comments.map((comment, index) => (
            <div 
              key={comment.id || index}
              className="bg-muted p-3 rounded-lg"
            >
              <div className="text-xs text-muted-foreground mb-1">
                {comment.user_name || 'Anonymous'} • {new Date(comment.created_at).toLocaleDateString()}
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))
        )}
      </div>
      
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
    </div>
  );
};
