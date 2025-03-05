
import { VersionControl } from "../VersionControl";
import { Comments } from "../Comments";
import { DocumentDetails } from "../types";
import { Comment } from "../Comments/types";

interface CollaborationPanelProps {
  document: DocumentDetails;
  onCommentAdded: () => void;
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ 
  document,
  onCommentAdded 
}) => {
  // Map document comments to the correct Comment type with all required fields
  const typedComments: Comment[] = document.comments ? document.comments.map(comment => ({
    id: comment.id,
    content: comment.content,
    created_at: comment.created_at,
    user_id: comment.user_id,
    document_id: document.id,
    parent_id: undefined,
    mentions: [],
    is_resolved: false
  })) : [];

  return (
    <div className="space-y-6">
      <VersionControl documentId={document.id} />
      <Comments
        documentId={document.id}
        comments={typedComments}
        onCommentAdded={onCommentAdded}
      />
    </div>
  );
};
