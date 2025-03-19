
import { ThreadedComment } from '../ThreadedComment';
import { Comment, Profile } from '../types';

interface CommentsListProps {
  rootComments: Comment[];
  allComments: Comment[];
  currentUser: any;
  userProfile: Profile;
  onReply: (parentId: string) => void;
  onEdit: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onResolve: (id: string, resolved: boolean) => Promise<void>;
  isSubmitting: boolean;
  onSubmit: (content: string, parentId?: string, mentions?: string[]) => Promise<void>;
}

export const CommentsList = ({ 
  rootComments, 
  allComments,
  currentUser, 
  userProfile,
  onReply,
  onEdit,
  onDelete,
  onResolve,
  isSubmitting,
  onSubmit
}: CommentsListProps) => {
  if (rootComments.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm py-4">
        No comments yet. Start the conversation!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {rootComments.map(comment => {
        // Find all replies for this comment
        const replies = allComments.filter(c => c.parent_id === comment.id);
        
        return (
          <ThreadedComment
            key={comment.id}
            comment={comment}
            allComments={allComments}
            replies={replies}
            currentUser={currentUser}
            userProfile={userProfile}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            onResolve={onResolve}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
          />
        );
      })}
    </div>
  );
};
