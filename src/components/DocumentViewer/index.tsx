
import { useDocumentViewer } from "./useDocumentViewer";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentDetails } from "./DocumentDetails";
import { RiskAssessment } from "./RiskAssessment";
import { DeadlineManager } from "./DeadlineManager";
import { DocumentPreview } from "./DocumentPreview";
import { Comments } from "./Comments";
import { VersionControl } from "./VersionControl";

interface DocumentViewerProps {
  documentId: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentId }) => {
  const { document, loading, fetchDocumentDetails } = useDocumentViewer(documentId);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Document not found</p>
      </div>
    );
  }

  const extractedInfo = document.analysis?.[0]?.content?.extracted_info;
  console.log("Final extracted info being passed to components:", extractedInfo);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <DocumentHeader title={document.title} type={document.type} />
          <div className="space-y-4">
            <DocumentDetails
              documentId={document.id}
              formType={extractedInfo?.type ?? document.type}
              clientName={extractedInfo?.clientName}
              trusteeName={extractedInfo?.trusteeName}
              dateSigned={extractedInfo?.dateSigned}
              formNumber={extractedInfo?.formNumber}
              estateNumber={extractedInfo?.estateNumber}
              district={extractedInfo?.district}
              divisionNumber={extractedInfo?.divisionNumber}
              courtNumber={extractedInfo?.courtNumber}
              meetingOfCreditors={extractedInfo?.meetingOfCreditors}
              chairInfo={extractedInfo?.chairInfo}
              securityInfo={extractedInfo?.securityInfo}
              dateBankruptcy={extractedInfo?.dateBankruptcy}
              officialReceiver={extractedInfo?.officialReceiver}
              summary={extractedInfo?.summary}
            />
            <RiskAssessment 
              risks={extractedInfo?.risks} 
              documentId={document.id}
            />
            <DeadlineManager 
              document={document}
              onDeadlineUpdated={fetchDocumentDetails}
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-6">
        <DocumentPreview 
          storagePath={document.storage_path} 
          onAnalysisComplete={fetchDocumentDetails}
        />
      </div>

      <div className="lg:col-span-3 space-y-6">
        <VersionControl documentId={document.id} />
        <Comments
          documentId={document.id}
          comments={document.comments}
          onCommentAdded={fetchDocumentDetails}
        />
      </div>
    </div>
  );
};
