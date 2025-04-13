
import React from 'react';
import { Comment } from '../../../types';

interface CommentListProps {
  comments: Comment[];
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (!comments.length) {
    return (
      <p className="text-center text-sm text-muted-foreground pt-4">
        No comments yet. Be the first to add a comment.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment, index) => (
        <div 
          key={comment.id || index}
          className="bg-muted p-3 rounded-lg"
        >
          <div className="text-xs text-muted-foreground mb-1">
            {comment.user_name || 'Anonymous'} • {new Date(comment.created_at).toLocaleDateString()}
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};
