
interface DocumentDetailsProps {
  clientName?: string;
  trusteeName?: string;
  dateSigned?: string;
  formNumber?: string;
}

export const DocumentDetails: React.FC<DocumentDetailsProps> = ({
  clientName,
  trusteeName,
  dateSigned,
  formNumber
}) => {
  return (
    <div className="p-4 rounded-md bg-muted">
      <h3 className="font-medium mb-2">Document Details</h3>
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-muted-foreground">Client Name:</span>
          <p>{clientName || 'Not extracted'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Trustee Name:</span>
          <p>{trusteeName || 'Not extracted'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Date Signed:</span>
          <p>{dateSigned || 'Not extracted'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Form Number:</span>
          <p>{formNumber || 'Not extracted'}</p>
        </div>
      </div>
    </div>
  );
};
