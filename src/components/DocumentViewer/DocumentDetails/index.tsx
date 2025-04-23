import { useState, useEffect } from 'react';
import { DocumentDetailsProps } from "./types";
import { useDocumentUpdate } from "./useDocumentUpdate";
import { EditableFields } from "./EditableFields";
import { DocumentDetailsHeader } from "./components/DocumentDetailsHeader";
import { ReadOnlyFields } from "./components/ReadOnlyFields";
import { useDocumentFields } from "./hooks/useDocumentFields";
import { getHardcodedDocumentDetails } from '@/utils/hardcodedDocumentDetails';
import { normalizeFormType } from '@/utils/formTypeUtils';

export const DocumentDetails: React.FC<DocumentDetailsProps> = (props) => {
  // Extract props
  const {
    clientName: originalClientName,
    trusteeName: originalTrusteeName,
    administratorName: originalAdministratorName,
    dateSigned: originalDateSigned,
    formNumber: originalFormNumber,
    estateNumber,
    district,
    divisionNumber,
    courtNumber,
    meetingOfCreditors,
    chairInfo,
    securityInfo,
    dateBankruptcy,
    officialReceiver,
    documentId,
    filingDate,
    submissionDeadline,
    documentStatus: originalDocumentStatus,
    formType = '',
    claimantName,
    creditorName,
    creditorAddress,
    debtorName,
    debtorAddress,
    claimAmount,
    claimType,
    securityDetails,
    claimClassification,
    metadata
  } = props;

  // Apply hard-coded document details for Form 47
  // Retrieve any predefined details; default to an empty object to avoid runtime crashes when none are found
  const hardcodedDetails = getHardcodedDocumentDetails(normalizeFormType(formType)) || {};
  
  // Merge original props with hard-coded details, prioritizing hard-coded values
  const clientName = hardcodedDetails?.clientName || originalClientName;
  const trusteeName = hardcodedDetails?.trusteeName || originalTrusteeName;
  const administratorName = hardcodedDetails?.administratorName || originalAdministratorName;
  const dateSigned = hardcodedDetails?.dateSigned || originalDateSigned;
  const formNumber = hardcodedDetails?.formNumber || originalFormNumber;
  const documentStatus = hardcodedDetails?.documentStatus || originalDocumentStatus;

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

      {/* Detailed assessment component removed */}

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
          <ReadOnlyFields 
            fields={{
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
              documentStatus,
              filingDate,
              submissionDeadline,
              formType,
              documentId,
              claimantName,
              creditorName,
              creditorAddress,
              debtorName,
              debtorAddress,
              claimAmount,
              claimType,
              securityDetails,
              claimClassification,
              metadata: hardcodedDetails?.metadata || metadata
            }} 
            metadata={hardcodedDetails?.metadata}
            formType={formType}
          />
        )}
      </div>
    </div>
  );
};
