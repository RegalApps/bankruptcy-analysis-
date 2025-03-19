
import { CollaborationPanel } from "@/components/DocumentViewer/CollaborationPanel";
import { Document } from "../../types";

interface CommentsTabProps {
  document: Document;
  effectiveDocumentId: string;
}

export const CommentsTab: React.FC<CommentsTabProps> = ({
  document,
  effectiveDocumentId,
}) => {
  return (
    <CollaborationPanel 
      document={{
        id: effectiveDocumentId,
        title: document.title,
        type: document.type || 'document',
        storage_path: document.metadata?.storage_path || '',
        comments: []
      }}
      onCommentAdded={() => console.log('Comment added')}
    />
  );
};
