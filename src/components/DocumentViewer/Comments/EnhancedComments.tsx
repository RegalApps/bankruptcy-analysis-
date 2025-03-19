
import { useState } from 'react';
import { CommentsProps } from './types';
import { EnhancedCommentInput } from './EnhancedCommentInput';
import { useCommentUser } from './hooks/useCommentUser';
import { useCommentActions } from './hooks/useCommentActions';
import { organizeCommentThreads } from './utils/commentUtils';
import { CommentsErrorDisplay } from './components/CommentsErrorDisplay';
import { CommentsHeader } from './components/CommentsHeader';
import { CommentsList } from './components/CommentsList';

export const EnhancedComments: React.FC<CommentsProps> = ({ 
  documentId, 
  comments = [],
  onCommentAdded 
}) => {
  // Get user data and authentication status
  const { currentUser, userProfile, loadingError } = useCommentUser();
  
  // Get comment action handlers
  const { 
    isSubmitting, 
    setReplyToId, 
    handleAddComment, 
    handleEditComment, 
    handleDeleteComment, 
    handleResolveComment 
  } = useCommentActions({ documentId, onCommentAdded });

  // Group comments into threads
  const rootComments = organizeCommentThreads(comments);

  // Handle adding a comment or reply
  const onSubmitComment = async (content: string, parentId?: string, mentions?: string[]) => {
    await handleAddComment(content, parentId, mentions, currentUser, userProfile);
  };

  // Handle editing a comment
  const onEditComment = async (id: string, content: string) => {
    await handleEditComment(id, content, currentUser);
  };

  // Handle deleting a comment
  const onDeleteComment = async (id: string) => {
    await handleDeleteComment(id, currentUser);
  };

  // Handle resolving/reopening a comment
  const onResolveComment = async (id: string, resolved: boolean) => {
    await handleResolveComment(id, resolved, currentUser);
  };

  // Show error message if there was a problem loading the user data
  if (loadingError) {
    return <CommentsErrorDisplay error={loadingError} />;
  }

  return (
    <div className="space-y-4">
      <CommentsHeader />
      
      <EnhancedCommentInput 
        currentUser={currentUser}
        userProfile={userProfile}
        onSubmit={onSubmitComment}
        isSubmitting={isSubmitting}
      />
      
      <div className="space-y-4 mt-6">
        <CommentsList 
          rootComments={rootComments}
          allComments={comments}
          currentUser={currentUser}
          userProfile={userProfile as any}
          onReply={setReplyToId}
          onEdit={onEditComment}
          onDelete={onDeleteComment}
          onResolve={onResolveComment}
          isSubmitting={isSubmitting}
          onSubmit={onSubmitComment}
        />
      </div>
    </div>
  );
};
