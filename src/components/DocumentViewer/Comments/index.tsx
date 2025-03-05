
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { CommentInput } from './CommentInput';
import { CommentItem } from './CommentItem';
import { CommentsProps, Comment, Profile } from './types';
import { ThreadedComment } from './ThreadedComment';

export const Comments: React.FC<CommentsProps> = ({ 
  documentId, 
  comments: initialComments = [],
  onCommentAdded
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<Profile | undefined>();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch comments and current user
  useEffect(() => {
    const fetchData = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, avatar_url, full_name')
          .eq('id', user.id)
          .single();

        setUserProfile(profile || {
          id: user.id,
          email: user.email || '',
          avatar_url: null,
          full_name: user.email?.split('@')[0] || 'User'
        });
      }

      // Get comments for this document
      const { data: commentsData, error: commentsError } = await supabase
        .from('document_comments')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: true });

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
        return;
      }

      setComments(commentsData as Comment[]);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  // Handle comment submission
  const handleSubmitComment = async (content: string, parentId?: string, mentions?: string[]) => {
    if (!content.trim() || !currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      const newComment = {
        content,
        document_id: documentId,
        user_id: currentUser.id,
        parent_id: parentId,
        mentions,
        is_resolved: false
      };
      
      const { data, error } = await supabase
        .from('document_comments')
        .insert([newComment])
        .select();
        
      if (error) throw error;
      
      // Add the new comment to the list
      const addedComment = data[0] as Comment;
      setComments(prevComments => [...prevComments, addedComment]);
      
      if (onCommentAdded) {
        onCommentAdded();
      }
      
      setReplyingTo(null);
      
      toast({
        title: 'Comment added',
        description: 'Your comment has been added successfully',
      });
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add comment. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle comment editing
  const handleEditComment = async (id: string, content: string) => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('document_comments')
        .update({ content })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the comment in the list
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === id ? { ...comment, content } : comment
        )
      );
      
      toast({
        title: 'Comment updated',
        description: 'Your comment has been updated successfully',
      });
    } catch (error: any) {
      console.error('Error editing comment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update comment. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('document_comments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Remove the comment from the list
      setComments(prevComments => 
        prevComments.filter(comment => comment.id !== id)
      );
      
      toast({
        title: 'Comment deleted',
        description: 'Your comment has been deleted',
      });
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete comment. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle marking comment as resolved
  const handleResolveComment = async (id: string, resolved: boolean) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('document_comments')
        .update({ is_resolved: resolved })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the comment in the list
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === id ? { ...comment, is_resolved: resolved } : comment
        )
      );
      
      toast({
        title: resolved ? 'Comment resolved' : 'Comment reopened',
        description: resolved 
          ? 'The comment has been marked as resolved' 
          : 'The comment has been reopened',
      });
    } catch (error: any) {
      console.error('Error resolving comment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update comment status. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Organize comments into threads
  const threadedComments = useCallback(() => {
    const rootComments: Comment[] = [];
    const commentMap: Record<string, Comment[]> = {};
    
    // Group child comments by parent ID
    comments.forEach(comment => {
      if (!comment.parent_id) {
        rootComments.push(comment);
      } else {
        if (!commentMap[comment.parent_id]) {
          commentMap[comment.parent_id] = [];
        }
        commentMap[comment.parent_id].push(comment);
      }
    });
    
    return { rootComments, commentMap };
  }, [comments]);
  
  const { rootComments, commentMap } = threadedComments();
  
  // Only render if we have a current user
  if (!currentUser) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Please sign in to view and add comments.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {rootComments.map(comment => (
          <ThreadedComment
            key={comment.id}
            comment={comment}
            replies={commentMap[comment.id] || []}
            currentUser={currentUser}
            userProfile={userProfile as Profile}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
            onReply={setReplyingTo}
            onResolve={handleResolveComment}
            onSubmit={handleSubmitComment}
            isSubmitting={isSubmitting}
          />
        ))}
      </div>
      
      <CommentInput
        currentUser={currentUser}
        userProfile={userProfile}
        onSubmit={handleSubmitComment}
        isSubmitting={isSubmitting}
        placeholder="Add a comment..."
      />
    </div>
  );
};
