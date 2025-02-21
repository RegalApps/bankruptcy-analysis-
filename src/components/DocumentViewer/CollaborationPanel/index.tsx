
import { VersionControl } from "../VersionControl";
import { Comments } from "../Comments";
import { DocumentDetails } from "../types";

interface CollaborationPanelProps {
  document: DocumentDetails;
  onCommentAdded: () => void;
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ 
  document,
  onCommentAdded 
}) => {
  return (
    <div className="space-y-6">
      <VersionControl documentId={document.id} />
      <Comments
        documentId={document.id}
        comments={document.comments}
        onCommentAdded={onCommentAdded}
      />
    </div>
  );
};
