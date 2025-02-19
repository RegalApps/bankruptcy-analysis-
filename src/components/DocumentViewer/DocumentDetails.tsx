
interface DocumentDetailsProps {
  clientName?: string;
  trusteeName?: string;
  dateSigned?: string;
  formNumber?: string;
  estateNumber?: string;
  district?: string;
  divisionNumber?: string;
  courtNumber?: string;
  meetingOfCreditors?: string;
  chairInfo?: string;
  securityInfo?: string;
  dateBankruptcy?: string;
  officialReceiver?: string;
  summary?: string;
}

export const DocumentDetails: React.FC<DocumentDetailsProps> = ({
  clientName,
  trusteeName,
  dateSigned,
  formNumber,
  estateNumber,
  district,
  divisionNumber,
  courtNumber,
  meetingOfCreditors,
  chairInfo,
  securityInfo,
  dateBankruptcy,
  officialReceiver,
  summary
}) => {
  return (
    <div className="p-4 rounded-md bg-muted">
      <h3 className="font-medium mb-2">Document Details</h3>
      {summary && (
        <div className="mb-4 p-3 bg-background rounded border">
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
      )}
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-muted-foreground">Form Number:</span>
          <p>{formNumber || 'Not extracted'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Client/Debtor Name:</span>
          <p>{clientName || 'Not extracted'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Licensed Insolvency Trustee:</span>
          <p>{trusteeName || 'Not extracted'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Estate Number:</span>
          <p>{estateNumber || 'Not extracted'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">District:</span>
          <p>{district || 'Not extracted'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Division Number:</span>
          <p>{divisionNumber || 'Not extracted'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Court Number:</span>
          <p>{courtNumber || 'Not extracted'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Meeting of Creditors:</span>
          <p>{meetingOfCreditors || 'Not extracted'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Chair Information:</span>
          <p>{chairInfo || 'Not extracted'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Security Information:</span>
          <p>{securityInfo || 'Not extracted'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Date of Bankruptcy:</span>
          <p>{dateBankruptcy || 'Not extracted'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Date Signed:</span>
          <p>{dateSigned || 'Not extracted'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Official Receiver:</span>
          <p>{officialReceiver || 'Not extracted'}</p>
        </div>
      </div>
    </div>
  );
};
