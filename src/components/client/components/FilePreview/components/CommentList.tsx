
import React from 'react';
import { Comment } from '../../../types';
import { AlertCircle, CheckCircle2, FileText } from 'lucide-react';

interface CommentListProps {
  comments: Comment[];
  documentType?: string;
}

export const CommentList: React.FC<CommentListProps> = ({ comments, documentType }) => {
  const isForm31 = documentType === 'Form 31' || documentType?.includes('Form 31');

  if (!comments.length) {
    return (
      <div className="text-center text-sm text-muted-foreground pt-4 p-6">
        {isForm31 ? (
          <div className="space-y-2">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
            <p>No comments yet for this Proof of Claim document.</p>
            <p className="text-xs">Add comments about form compliance, missing fields, or required corrections.</p>
          </div>
        ) : (
          <p>No comments yet. Be the first to add a comment.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment, index) => {
        // Check if comment is related to a BIA compliance issue
        const isBiaComment = comment.content.includes('BIA') || 
                            comment.content.includes('Subsection') || 
                            comment.content.includes('Section');
        
        // Check if comment indicates a resolution
        const isResolutionComment = comment.content.toLowerCase().includes('resolved') ||
                                   comment.content.toLowerCase().includes('fixed') ||
                                   comment.content.toLowerCase().includes('corrected') ||
                                   comment.is_resolved;
        
        return (
          <div 
            key={comment.id || index}
            className={`p-3 rounded-lg ${
              isResolutionComment ? 'bg-green-50 dark:bg-green-900/20' :
              isBiaComment ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
              'bg-muted'
            }`}
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              {isResolutionComment && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
              {isBiaComment && !isResolutionComment && <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />}
              <span>{comment.user_name || 'Anonymous'}</span>
              <span className="mx-1">•</span>
              <span>{new Date(comment.created_at).toLocaleDateString()}</span>
              {comment.is_resolved && <span className="ml-auto text-green-600 text-xs font-medium">Resolved</span>}
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
        );
      })}
    </div>
  );
};
