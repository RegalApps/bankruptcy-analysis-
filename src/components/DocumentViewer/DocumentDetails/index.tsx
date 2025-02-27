
import { DocumentSummary } from "./DocumentSummary";
import { EditableFields } from "./EditableFields";
import { useDocumentUpdate } from "./useDocumentUpdate";
import { Separator } from "@/components/ui/separator";
import logger from "@/utils/logger";

interface DocumentDetailsProps {
  documentId: string;
  formType?: string;
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
  documentId,
  formType,
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
  const { handleSaveUpdate, updating } = useDocumentUpdate(documentId);

  logger.debug('DocumentDetails Props:', {
    formType,
    clientName,
    trusteeName,
    dateSigned,
    formNumber
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Document Details</h3>
        <EditableFields 
          fields={{
            formType,
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
            officialReceiver
          }}
          onSave={handleSaveUpdate}
          isLoading={updating}
        />
      </div>

      <Separator className="my-4" />

      <DocumentSummary summary={summary} />
    </div>
  );
};
