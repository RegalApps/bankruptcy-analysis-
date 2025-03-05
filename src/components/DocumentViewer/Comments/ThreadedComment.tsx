
import React, { useState } from 'react';
import { Comment, Profile, ThreadedCommentProps } from './types';
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, MessageSquare, CheckCircle } from 'lucide-react';
import { CommentInput } from './CommentInput';

export const ThreadedComment: React.FC<ThreadedCommentProps> = ({
  comment,
  allComments = [],
  currentUser,
  userProfile,
  onEdit,
  onDelete,
  onReply,
  onResolve,
  onSubmit,
  isSubmitting,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  
  const isCommentOwner = currentUser?.id === comment.user_id;
  const hasReplies = allComments.filter(c => c.parent_id === comment.id).length > 0;
  
  const handleReplyClick = () => {
    if (replyingToId === comment.id) {
      setReplyingToId(null);
    } else {
      setReplyingToId(comment.id);
      onReply(comment.id);
    }
  };

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSubmit = async (content: string) => {
    await onEdit(comment.id, content);
    setIsEditing(false);
  };

  const handleResolveToggle = () => {
    onResolve(comment.id, !comment.is_resolved);
  };

  const replies = allComments.filter(c => c.parent_id === comment.id);
  
  return (
    <div className={`border-l-2 pl-4 mb-4 ${
      comment.is_resolved ? 'border-green-400 bg-green-50/30' : 'border-gray-200'
    }`}>
      {isEditing ? (
        <CommentInput
          currentUser={currentUser}
          userProfile={userProfile}
          onSubmit={async (content) => handleEditSubmit(content)}
          isSubmitting={isSubmitting}
          onCancel={handleEditCancel}
          initialValue={comment.content}
        />
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{userProfile?.full_name || 'User'}</span>
              <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
              {comment.is_resolved && (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Resolved
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {isCommentOwner && (
                <>
                  <button
                    onClick={handleEditStart}
                    className="text-blue-500 hover:text-blue-700"
                    aria-label="Edit comment"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete comment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
              <button
                onClick={handleResolveToggle}
                className={`${
                  comment.is_resolved ? 'text-green-600' : 'text-gray-400'
                } hover:text-green-700`}
                aria-label={comment.is_resolved ? "Mark as unresolved" : "Mark as resolved"}
              >
                <CheckCircle className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          
          <div className="mt-1 text-sm">
            {comment.content}
          </div>
          
          <div className="mt-2 flex items-center gap-2">
            <Button
              onClick={handleReplyClick}
              variant="ghost"
              size="sm"
              className="text-xs h-6 px-2 py-0 gap-1"
            >
              <MessageSquare className="h-3 w-3" />
              Reply
            </Button>
            
            {hasReplies && (
              <Button
                onClick={() => setShowReplies(!showReplies)}
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2 py-0"
              >
                {showReplies ? 'Hide replies' : `Show ${replies.length} replies`}
              </Button>
            )}
          </div>
        </div>
      )}
      
      {replyingToId === comment.id && onSubmit && (
        <div className="mt-3 pl-4">
          <CommentInput
            currentUser={currentUser}
            userProfile={userProfile}
            onSubmit={async (content, _, mentions) => {
              await onSubmit(content, comment.id, mentions);
              setReplyingToId(null);
            }}
            isSubmitting={isSubmitting}
            parentId={comment.id}
            onCancel={() => setReplyingToId(null)}
            placeholder="Write a reply..."
          />
        </div>
      )}
      
      {hasReplies && showReplies && (
        <div className="mt-3 pl-2">
          {replies.map(reply => (
            <ThreadedComment
              key={reply.id}
              comment={reply}
              allComments={allComments}
              currentUser={currentUser}
              userProfile={userProfile}
              onEdit={onEdit}
              onDelete={onDelete}
              onReply={onReply}
              onResolve={onResolve}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}
    </div>
  );
};
