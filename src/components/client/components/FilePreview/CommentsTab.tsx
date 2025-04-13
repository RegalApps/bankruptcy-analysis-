
import React from 'react';
import { Document } from '../../types';
import { CommentInput } from './components/CommentInput';
import { CommentList } from './components/CommentList';

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
  const viewerDocument = {
    ...document,
    comments: document.comments || [] // Ensure comments is always an array
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto p-3">
        <CommentList comments={viewerDocument.comments} />
      </div>
      
      <CommentInput 
        onAddComment={onAddComment}
        isLoading={isLoading}
      />
    </div>
  );
};
