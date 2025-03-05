
import React, { useState } from 'react';
import { CommentItemProps } from './types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Reply, Edit2, Trash2, Check, X, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistance } from 'date-fns';
import { CommentInput } from './CommentInput';

export const ThreadedComment: React.FC<CommentItemProps> = ({
  comment,
  allComments,
  currentUser,
  userProfile,
  onReply,
  onEdit,
  onDelete,
  onResolve,
  isSubmitting,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);

  const handleSaveEdit = async () => {
    if (editedContent.trim() === comment.content.trim()) {
      setIsEditing(false);
      return;
    }

    await onEdit(comment.id, editedContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
  };

  const handleReply = () => {
    setIsReplying(true);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
  };

  const handleSubmitReply = async (content: string) => {
    // The parent component will handle the reply
    onReply(comment.id);
    setIsReplying(false);
  };

  const handleToggleResolved = async () => {
    await onResolve(comment.id, !comment.is_resolved);
  };

  const isOwnComment = currentUser?.id === comment.user_id;
  const formattedDate = comment.created_at
    ? formatDistance(new Date(comment.created_at), new Date(), { addSuffix: true })
    : '';

  // Find child comments (replies to this comment)
  const childComments = allComments?.filter(c => c.parent_id === comment.id) || [];

  return (
    <div className={`p-4 rounded-lg border ${comment.is_resolved ? 'bg-green-50 border-green-200' : 'bg-card border-border'}`}>
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={userProfile?.avatar_url || ''} alt={userProfile?.full_name || 'User'} />
          <AvatarFallback>
            {userProfile?.full_name
              ? userProfile.full_name
                  .split(' ')
                  .map(name => name[0])
                  .join('')
                  .toUpperCase()
              : 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{userProfile?.full_name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
              {comment.is_resolved && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-800">
                  Resolved
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {isOwnComment && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(comment.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleToggleResolved}>
                      <Check className="h-4 w-4 mr-2" />
                      {comment.is_resolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full min-h-[100px] p-2 text-sm border rounded-md"
                placeholder="Edit your comment..."
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit} disabled={isSubmitting}>
                  <Check className="h-4 w-4 mr-1" /> Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm">{comment.content}</p>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleReply}
                >
                  <Reply className="h-3 w-3 mr-1" /> Reply
                </Button>
                {!isOwnComment && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handleToggleResolved}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    {comment.is_resolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
                  </Button>
                )}
              </div>
            </>
          )}

          {isReplying && (
            <div className="mt-3">
              <CommentInput
                currentUser={currentUser}
                userProfile={userProfile}
                onSubmit={handleSubmitReply}
                isSubmitting={isSubmitting}
                parentId={comment.id}
                onCancel={handleCancelReply}
                placeholder="Write a reply..."
              />
            </div>
          )}

          {/* Render child comments */}
          {childComments.length > 0 && (
            <div className="pl-4 border-l border-border mt-4 space-y-4">
              {childComments.map((childComment) => (
                <ThreadedComment
                  key={childComment.id}
                  comment={childComment}
                  allComments={allComments}
                  currentUser={currentUser}
                  userProfile={userProfile}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onResolve={onResolve}
                  isSubmitting={isSubmitting}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
