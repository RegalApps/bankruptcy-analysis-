
import { useDocumentViewer } from "./useDocumentViewer";
import { DocumentPreview } from "./DocumentPreview";
import { Sidebar } from "./Sidebar";
import { CollaborationPanel } from "./CollaborationPanel";
import { LoadingState } from "./LoadingState";
import { TaskManager } from "./TaskManager";
import { VersionTab } from "./VersionTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentDetails } from "./DocumentDetails";
import { RiskAssessment } from "./RiskAssessment";
import logger from "@/utils/logger";

interface DocumentViewerProps {
  documentId: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentId }) => {
  const { document, loading, fetchDocumentDetails } = useDocumentViewer(documentId);

  logger.debug('Document data in DocumentViewer:', document);

  if (loading) {
    return <LoadingState />;
  }

  if (!document) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Document not found</p>
      </div>
    );
  }

  const analysis = document.analysis?.[0]?.content;
  logger.debug('Analysis content:', analysis);
  
  // Extract document fields from analysis for DocumentDetails
  const extractedInfo = analysis?.extracted_info || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <Sidebar 
          document={document}
          onDeadlineUpdated={fetchDocumentDetails} 
        />
        
        <DocumentDetails
          documentId={document.id}
          formType={extractedInfo.type}
          clientName={extractedInfo.clientName}
          trusteeName={extractedInfo.trusteeName}
          dateSigned={extractedInfo.dateSigned}
          formNumber={extractedInfo.formNumber}
          estateNumber={extractedInfo.estateNumber}
          district={extractedInfo.district}
          divisionNumber={extractedInfo.divisionNumber}
          courtNumber={extractedInfo.courtNumber}
          meetingOfCreditors={extractedInfo.meetingOfCreditors}
          chairInfo={extractedInfo.chairInfo}
          securityInfo={extractedInfo.securityInfo}
          dateBankruptcy={extractedInfo.dateBankruptcy}
          officialReceiver={extractedInfo.officialReceiver}
          summary={extractedInfo.summary}
        />
        
        {analysis?.risks && (
          <RiskAssessment 
            risks={analysis.risks} 
            documentId={document.id} 
          />
        )}
      </div>

      <div className="lg:col-span-6">
        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <DocumentPreview 
              storagePath={document.storage_path} 
              onAnalysisComplete={fetchDocumentDetails}
            />
          </TabsContent>
          <TabsContent value="versions">
            <VersionTab documentId={document.id} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <CollaborationPanel 
          document={document}
          onCommentAdded={fetchDocumentDetails}
        />
        <TaskManager
          documentId={document.id}
          tasks={document.tasks || []}
          onTaskUpdate={fetchDocumentDetails}
        />
      </div>
    </div>
  );
};
