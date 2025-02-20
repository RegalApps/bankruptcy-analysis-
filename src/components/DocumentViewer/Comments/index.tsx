
import { useState, useEffect } from "react";
import { MessageSquare, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
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
import { CommentItem } from "./CommentItem";
import { CommentInput } from "./CommentInput";
import { CommentsProps, Profile } from "./types";

const COMMENTS_PER_PAGE = 10;

export const Comments = ({ documentId, comments = [], onCommentAdded }: CommentsProps) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfiles, setUserProfiles] = useState<Record<string, Profile>>({});
  const [deleteComment, setDeleteComment] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleAddComment = async (content: string) => {
    if (!content.trim() || !currentUser || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('document_comments')
        .insert([
          {
            document_id: documentId,
            content,
            user_id: currentUser.id
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment added successfully"
      });

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

  const handleEditComment = async (commentId: string, content: string) => {
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('document_comments')
        .update({ content })
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment updated successfully"
      });

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
            <span>
              Commenting as: {userProfiles[currentUser.id]?.full_name || 'Anonymous'}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {paginatedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            userProfile={userProfiles[comment.user_id]}
            onEdit={handleEditComment}
            onDelete={async (id) => {
              setDeleteComment(id);
              return new Promise<void>((resolve) => {
                // We'll resolve the promise after the delete operation is complete
                // This will be handled by the AlertDialog
                resolve();
              });
            }}
            isSubmitting={isSubmitting}
          />
        ))}

        {hasMoreComments && (
          <button
            onClick={() => setPage(p => p + 1)}
            className="w-full text-sm text-muted-foreground hover:text-foreground py-2"
          >
            Load more comments
          </button>
        )}

        <CommentInput
          currentUser={currentUser}
          userProfile={userProfiles[currentUser?.id]}
          onSubmit={handleAddComment}
          isSubmitting={isSubmitting}
        />
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
