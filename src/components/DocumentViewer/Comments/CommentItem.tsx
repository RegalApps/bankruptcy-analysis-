
import { useState } from "react";
import { format } from "date-fns";
import { Edit, Trash2, X, Check } from "lucide-react";
import { UserCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CommentItemProps } from "./types";

export const CommentItem = ({ 
  comment, 
  currentUser, 
  userProfile,
  onEdit,
  onDelete,
  isSubmitting 
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleEdit = async () => {
    await onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  return (
    <div className="p-4 rounded-md bg-muted">
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage 
            src={userProfile?.avatar_url || ''} 
            alt="Profile" 
          />
          <AvatarFallback>
            <UserCircle className="h-6 w-6 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {userProfile?.full_name || userProfile?.email?.split('@')[0] || 'Anonymous'}
            </p>
            <div className="flex items-center space-x-2">
              <time className="text-xs text-muted-foreground">
                {format(new Date(comment.created_at), "MMM d, yyyy 'at' h:mm a")}
              </time>
              {currentUser?.id === comment.user_id && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 hover:text-primary"
                    disabled={isSubmitting}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="p-1 hover:text-destructive"
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-1 text-sm"
                autoFocus
                disabled={isSubmitting}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  onClick={handleEdit}
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
  );
};
