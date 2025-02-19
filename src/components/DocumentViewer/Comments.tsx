
import { useState, useEffect } from "react";
import { MessageSquare, Send, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

export const Comments: React.FC<CommentsProps> = ({ documentId, comments, onCommentAdded }) => {
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfiles, setUserProfiles] = useState<Record<string, Profile>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      if (user) {
        // Fetch current user's profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (profile) {
          // Get the public URL for the avatar if it exists
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
    // Get user profiles for all comments
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
                  // Get the public URL for each avatar
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
    if (!newComment.trim() || !currentUser) return;

    try {
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
    }
  };

  const getUserDisplayName = (userId: string) => {
    const profile = userProfiles[userId];
    return profile?.full_name || profile?.email?.split('@')[0] || 'Anonymous';
  };

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
        {comments && comments.map((comment) => (
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
                  <time className="text-xs text-muted-foreground">
                    {format(new Date(comment.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </time>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center space-x-2 mt-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 min-w-0 rounded-md border bg-background px-3 py-2 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
          />
          <button
            onClick={handleAddComment}
            className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            disabled={!currentUser}
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
    </div>
  );
};
