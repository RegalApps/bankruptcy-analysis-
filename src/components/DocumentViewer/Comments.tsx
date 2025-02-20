
import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, UserCircle, Edit, Trash2, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface Profile {
  id: string;
  email: string;
  avatar_url: string | null;
  full_name: string;
}

interface CommentsProps {
  documentId: string;
  comments?: Comment[];
  onCommentAdded: () => void;
}

const COMMENTS_PER_PAGE = 10;

export const Comments: React.FC<CommentsProps> = ({ documentId, comments = [], onCommentAdded }) => {
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfiles, setUserProfiles] = useState<Record<string, Profile>>({});
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deleteComment, setDeleteComment] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (profile) {
          if (profile.avatar_url) {
            const { data: { publicUrl } } = supabase
              .storage
              .from('avatars')
              .getPublicUrl(profile.avatar_url);
            
            profile.avatar_url = publicUrl;
          }
          
          setUserProfiles(prev => ({
            ...prev,
            [user.id]: profile
          }));
        }
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (comments?.length) {
      const fetchProfiles = async () => {
        const userIds = [...new Set(comments.map(c => c.user_id))];
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .in('id', userIds);

          if (error) throw error;
          
          if (data) {
            const profileMap = await Promise.all(
              data.map(async (profile) => {
                if (profile.avatar_url) {
                  const { data: { publicUrl } } = supabase
                    .storage
                    .from('avatars')
                    .getPublicUrl(profile.avatar_url);
                  
                  return {
                    ...profile,
                    avatar_url: publicUrl
                  };
                }
                return profile;
              })
            ).then(profiles => {
              return profiles.reduce((acc, profile) => ({
                ...acc,
                [profile.id]: profile
              }), {});
            });
            
            setUserProfiles(prev => ({
              ...prev,
              ...profileMap
            }));
          }
        } catch (error) {
          console.error('Error fetching user profiles:', error);
        }
      };

      fetchProfiles();
    }
  }, [comments]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('document_comments')
        .insert([
          {
            document_id: documentId,
            content: newComment,
            user_id: currentUser.id
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment added successfully"
      });

      setNewComment("");
      onCommentAdded();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('document_comments')
        .update({ content: editContent })
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment updated successfully"
      });

      setEditingComment(null);
      onCommentAdded();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update comment"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!deleteComment || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('document_comments')
        .delete()
        .eq('id', deleteComment);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment deleted successfully"
      });

      setDeleteComment(null);
      onCommentAdded();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete comment"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserDisplayName = (userId: string) => {
    const profile = userProfiles[userId];
    return profile?.full_name || profile?.email?.split('@')[0] || 'Anonymous';
  };

  const paginatedComments = comments.slice(0, page * COMMENTS_PER_PAGE);
  const hasMoreComments = comments.length > page * COMMENTS_PER_PAGE;

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Comments & Collaboration</h3>
        </div>
        {currentUser && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Avatar className="h-6 w-6">
              <AvatarImage 
                src={userProfiles[currentUser.id]?.avatar_url || ''} 
                alt="Profile" 
              />
              <AvatarFallback>
                <UserCircle className="h-4 w-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <span>Commenting as: {getUserDisplayName(currentUser.id)}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {paginatedComments.map((comment) => (
          <div key={comment.id} className="p-4 rounded-md bg-muted">
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={userProfiles[comment.user_id]?.avatar_url || ''} 
                  alt="Profile" 
                />
                <AvatarFallback>
                  <UserCircle className="h-6 w-6 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {getUserDisplayName(comment.user_id)}
                  </p>
                  <div className="flex items-center space-x-2">
                    <time className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </time>
                    {currentUser?.id === comment.user_id && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            setEditingComment(comment.id);
                            setEditContent(comment.content);
                          }}
                          className="p-1 hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteComment(comment.id)}
                          className="p-1 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {editingComment === comment.id ? (
                  <div className="mt-2 space-y-2">
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full rounded-md border bg-background px-3 py-1 text-sm"
                      autoFocus
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingComment(null)}
                        className="text-sm text-muted-foreground hover:text-foreground"
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        className="text-sm text-primary hover:text-primary/90"
                        disabled={isSubmitting}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm mt-1">{comment.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {hasMoreComments && (
          <button
            onClick={() => setPage(p => p + 1)}
            className="w-full text-sm text-muted-foreground hover:text-foreground py-2"
          >
            Load more comments
          </button>
        )}

        <div className="flex items-center space-x-2 mt-4">
          <input
            ref={commentInputRef}
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 min-w-0 rounded-md border bg-background px-3 py-2 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
            disabled={isSubmitting}
          />
          <button
            onClick={handleAddComment}
            className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            disabled={!currentUser || isSubmitting}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        {!currentUser && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Please sign in to add comments
          </p>
        )}
      </div>

      <AlertDialog open={!!deleteComment} onOpenChange={() => setDeleteComment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteComment}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
