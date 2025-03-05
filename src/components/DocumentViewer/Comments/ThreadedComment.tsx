
import { useState } from 'react';
import { CornerDownRight, Edit, Trash2, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EnhancedCommentInput } from './EnhancedCommentInput';
import { CommentItemProps, Comment } from './types';

export const ThreadedComment = ({
  comment,
  allComments = [],
  currentUser,
  userProfile,
  onReply,
  onEdit,
  onDelete,
  onResolve,
  isSubmitting
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplyInput, setShowReplyInput] = useState(false);
  
  // Find replies to this comment
  const replies = allComments.filter(c => c.parent_id === comment.id);
  
  const isOwnComment = currentUser && comment.user_id === currentUser.id;
  const canEdit = isOwnComment;
  const canDelete = isOwnComment;
  
  const formattedDate = comment.created_at 
    ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })
    : 'just now';

  const handleSaveEdit = async () => {
    await onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  const handleToggleReply = () => {
    setShowReplyInput(!showReplyInput);
    if (!showReplyInput) {
      onReply(comment.id);
    }
  };

  const handleResolve = () => {
    onResolve(comment.id, !comment.is_resolved);
  };

  // Format content to highlight mentions
  const formatContent = (content: string) => {
    return content.replace(/@([a-zA-Z0-9 ]+)/g, '<span class="text-primary font-medium">@$1</span>');
  };

  return (
    <div className={`p-3 rounded-md border ${comment.is_resolved ? 'bg-green-50 border-green-100' : 'bg-card'}`}>
      <div className="flex items-start gap-2">
        <Avatar className="h-8 w-8 mt-1">
          <AvatarFallback>{userProfile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
          {userProfile?.avatar_url && (
            <AvatarImage src={userProfile.avatar_url} alt={userProfile.full_name} />
          )}
        </Avatar>
        
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium">{userProfile?.full_name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
            
            {comment.is_resolved && (
              <span className="inline-flex items-center text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                <CheckCircle className="h-3 w-3 mr-1" />
                Resolved
              </span>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 text-sm border rounded-md"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={!editContent.trim() || isSubmitting}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: formatContent(comment.content) }}
            />
          )}
          
          <div className="flex gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={handleToggleReply}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Reply
            </Button>
            
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setIsEditing(true)}
                disabled={isEditing}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}
            
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                onClick={() => onDelete(comment.id)}
                disabled={isSubmitting}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 text-xs ${comment.is_resolved ? 'text-red-600' : 'text-green-600'}`}
              onClick={handleResolve}
              disabled={isSubmitting}
            >
              {comment.is_resolved ? (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Unresolve
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Resolve
                </>
              )}
            </Button>
          </div>
          
          {/* Show reply form if requested */}
          {showReplyInput && (
            <div className="mt-2 pl-4 border-l-2 border-muted">
              <EnhancedCommentInput
                currentUser={currentUser}
                userProfile={userProfile}
                onSubmit={(content, _, mentions) => {
                  onSubmit(content, comment.id, mentions);
                  setShowReplyInput(false);
                  return Promise.resolve();
                }}
                isSubmitting={isSubmitting}
                parentId={comment.id}
                onCancel={() => setShowReplyInput(false)}
                placeholder="Write a reply..."
              />
            </div>
          )}
          
          {/* Show replies */}
          {replies.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-muted space-y-3">
              {replies.map(reply => (
                <div key={reply.id} className="flex items-start gap-2">
                  <CornerDownRight className="h-4 w-4 text-muted-foreground" />
                  <ThreadedComment
                    comment={reply}
                    allComments={allComments}
                    currentUser={currentUser}
                    userProfile={userProfile}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onResolve={onResolve}
                    isSubmitting={isSubmitting}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
