
import { useState } from 'react';
import { DocumentDetailsProps } from "./types";
import { useDocumentUpdate } from "./useDocumentUpdate";
import { DocumentSummary } from "./DocumentSummary";
import { EditableFields } from "./EditableFields";
import { DocumentDetailsHeader } from "./components/DocumentDetailsHeader";
import { ReadOnlyFields } from "./components/ReadOnlyFields";
import { useDocumentFields } from "./hooks/useDocumentFields";

export const DocumentDetails: React.FC<DocumentDetailsProps> = ({
  clientName,
  trusteeName,
  administratorName,
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
  summary,
  documentId,
  filingDate,
  submissionDeadline,
  documentStatus,
  formType = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const { saveDocumentDetails, isSaving } = useDocumentUpdate(documentId, formType);
  const { getRelevantFields } = useDocumentFields(
    clientName, trusteeName, administratorName, dateSigned, formNumber,
    estateNumber, district, divisionNumber, courtNumber, meetingOfCreditors,
    chairInfo, securityInfo, dateBankruptcy, officialReceiver,
    documentStatus, filingDate, submissionDeadline, formType
  );

  const relevantFields = getRelevantFields(formType);

  const handleEdit = () => {
    const initialValues = relevantFields.reduce((acc, field) => ({
      ...acc,
      [field.key]: field.value
    }), {});
    setEditedValues(initialValues);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const success = await saveDocumentDetails(editedValues);
    if (success) {
      setIsEditing(false);
      setEditedValues({});
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValues({});
  };

  return (
    <div className="rounded-md bg-muted/50 p-4">
      <DocumentDetailsHeader 
        isEditing={isEditing}
        isSaving={isSaving}
        formType={formType}
        handleEdit={handleEdit}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />

      {summary && <DocumentSummary summary={summary} />}

      <div className="space-y-1 mt-4">
        {isEditing ? (
          <EditableFields 
            fields={relevantFields} 
            isEditing={isEditing}
            editedValues={editedValues} 
            setEditedValues={setEditedValues}
            isSaving={isSaving}
          />
        ) : (
          <ReadOnlyFields fields={relevantFields} />
        )}
      </div>
    </div>
  );
};
