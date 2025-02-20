
export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export interface Profile {
  id: string;
  email: string;
  avatar_url: string | null;
  full_name: string;
}

export interface CommentsProps {
  documentId: string;
  comments?: Comment[];
  onCommentAdded: () => void;
}

export interface CommentItemProps {
  comment: Comment;
  currentUser: any;
  userProfile: Profile;
  onEdit: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isSubmitting: boolean;
}

export interface CommentInputProps {
  currentUser: any;
  userProfile: Profile | undefined;
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
}
