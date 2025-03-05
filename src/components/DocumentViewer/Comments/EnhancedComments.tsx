
import { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Comment, CommentsProps, Profile } from './types';
import { EnhancedCommentInput } from './EnhancedCommentInput';
import { ThreadedComment } from './ThreadedComment';

export const EnhancedComments: React.FC<CommentsProps> = ({ 
  documentId, 
  comments = [],
  onCommentAdded 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<Profile | undefined>(undefined);
  const [replyToId, setReplyToId] = useState<string | undefined>(undefined);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get the current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        if (user) {
          setCurrentUser(user);
          
          // Get user profile info
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, full_name, avatar_url')
            .eq('id', user.id)
            .single();
            
          if (profileError) throw profileError;
          setUserProfile(profile as Profile);
        }
      } catch (error: any) {
        console.error('Error fetching user:', error);
        setLoadingError(error.message);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Group comments into threads
  const rootComments = comments.filter(comment => !comment.parent_id);

  const handleAddComment = async (content: string, parentId?: string, mentions?: string[]) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to add comments",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newComment = {
        document_id: documentId,
        user_id: currentUser.id,
        content,
        parent_id: parentId || null,
        mentions: mentions || []
      };
      
      const { error } = await supabase
        .from('document_comments')
        .insert([newComment]);
        
      if (error) throw error;
      
      // If there are mentions, send notifications
      if (mentions && mentions.length > 0) {
        for (const userId of mentions) {
          await supabase.from('notifications').insert([{
            user_id: userId,
            title: 'You were mentioned in a comment',
            message: `${userProfile?.full_name || 'Someone'} mentioned you in a comment`,
            category: 'task',
            priority: 'normal',
            action_url: `/documents/${documentId}`,
            metadata: {
              type: 'mention',
              document_id: documentId
            }
          }]);
        }
      }
      
      toast({
        title: "Success",
        description: "Comment added successfully"
      });
      
      onCommentAdded();
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: `Failed to add comment: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setReplyToId(undefined);
    }
  };

  const handleEditComment = async (id: string, content: string) => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('document_comments')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', currentUser.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Comment updated successfully"
      });
      
      onCommentAdded();
    } catch (error: any) {
      console.error('Error updating comment:', error);
      toast({
        title: "Error",
        description: `Failed to update comment: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      // First, delete all child comments
      const { data: childComments } = await supabase
        .from('document_comments')
        .select('id')
        .eq('parent_id', id);
        
      if (childComments && childComments.length > 0) {
        const childIds = childComments.map(c => c.id);
        const { error: childDeleteError } = await supabase
          .from('document_comments')
          .delete()
          .in('id', childIds);
          
        if (childDeleteError) throw childDeleteError;
      }
      
      // Then delete the comment itself
      const { error } = await supabase
        .from('document_comments')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUser.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Comment deleted successfully"
      });
      
      onCommentAdded();
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: `Failed to delete comment: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveComment = async (id: string, resolved: boolean) => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('document_comments')
        .update({ is_resolved: resolved })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Comment ${resolved ? 'resolved' : 'reopened'} successfully`
      });
      
      onCommentAdded();
    } catch (error: any) {
      console.error('Error resolving comment:', error);
      toast({
        title: "Error",
        description: `Failed to ${resolved ? 'resolve' : 'reopen'} comment: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingError) {
    return (
      <div className="p-4 bg-destructive/10 rounded-md">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>Error loading comments: {loadingError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-medium">Comments & Collaboration</h3>
      </div>
      
      <EnhancedCommentInput 
        currentUser={currentUser}
        userProfile={userProfile}
        onSubmit={handleAddComment}
        isSubmitting={isSubmitting}
      />
      
      <div className="space-y-4 mt-6">
        {rootComments.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-4">
            No comments yet. Start the conversation!
          </p>
        ) : (
          rootComments.map(comment => (
            <ThreadedComment
              key={comment.id}
              comment={comment}
              allComments={comments}
              currentUser={currentUser}
              userProfile={userProfile as Profile}
              onReply={setReplyToId}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              onResolve={handleResolveComment}
              isSubmitting={isSubmitting}
            />
          ))
        )}
      </div>
    </div>
  );
};
