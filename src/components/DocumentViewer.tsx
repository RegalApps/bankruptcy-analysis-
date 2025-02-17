
interface DocumentViewerProps {
  documentId: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentId }) => {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p>Viewing document: {documentId}</p>
    </div>
  );
};
