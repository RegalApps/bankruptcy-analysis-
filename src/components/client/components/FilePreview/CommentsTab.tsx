
import React from 'react';
import { Document } from '../../types';
import { CommentInput } from './components/CommentInput';
import { CommentList } from './components/CommentList';

interface CommentsTabProps {
  document: Document;
  onAddComment?: (comment: string) => void;
  isLoading?: boolean;
  documentType?: string;
}

export const CommentsTab: React.FC<CommentsTabProps> = ({ 
  document, 
  onAddComment,
  isLoading = false,
  documentType
}) => {
  const viewerDocument = {
    ...document,
    comments: document.comments || [] // Ensure comments is always an array
  };

  // Determine if document is Form 31
  const isForm31 = documentType === 'Form 31' || 
                    document?.type?.includes('Form 31') || 
                    document.title?.toLowerCase().includes('form 31');
  
  // Provide suggested comments for Form 31 based on common issues and BIA compliance
  const suggestedComments = isForm31 ? [
    "Missing checkboxes in claim category section",
    "Missing confirmation of relatedness status per BIA s.4",
    "No disclosure of transfers or payments per BIA s.95",
    "Incorrect date format in declaration - YYYY-MM-DD required",
    "Schedule A attachment required per BIA s.124(1)(b)",
    "Missing debt particulars - dates required per BIA s.121(1)(d)",
    "Claim amount calculation needs verification per BIA s.121(4)"
  ] : [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto p-3">
        <CommentList 
          comments={viewerDocument.comments} 
          documentType={documentType} 
        />
      </div>
      
      <CommentInput 
        onAddComment={onAddComment}
        isLoading={isLoading}
        suggestedComments={suggestedComments}
      />
    </div>
  );
};
