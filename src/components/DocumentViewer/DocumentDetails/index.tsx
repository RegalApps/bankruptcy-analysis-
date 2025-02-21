
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Save, X } from "lucide-react";
import { DocumentDetailsProps, EditableField } from "./types";
import { useDocumentUpdate } from "./useDocumentUpdate";
import { DocumentSummary } from "./DocumentSummary";
import { EditableFields } from "./EditableFields";

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
  summary,
  documentId,
  formType = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const { saveDocumentDetails, isSaving } = useDocumentUpdate(documentId, formType);

  const fields: EditableField[] = [
    { label: "Form Number", key: "formNumber", value: formNumber || '', showForTypes: ['all'] },
    { label: "Client/Debtor Name", key: "clientName", value: clientName || '', showForTypes: ['all'] },
    { label: "Licensed Insolvency Trustee", key: "trusteeName", value: trusteeName || '', showForTypes: ['all'] },
    { label: "Estate Number", key: "estateNumber", value: estateNumber || '', showForTypes: ['bankruptcy', 'proposal'] },
    { label: "District", key: "district", value: district || '', showForTypes: ['bankruptcy', 'proposal'] },
    { label: "Division Number", key: "divisionNumber", value: divisionNumber || '', showForTypes: ['bankruptcy', 'proposal'] },
    { label: "Court Number", key: "courtNumber", value: courtNumber || '', showForTypes: ['bankruptcy', 'proposal', 'court'] },
    { label: "Meeting of Creditors", key: "meetingOfCreditors", value: meetingOfCreditors || '', showForTypes: ['bankruptcy', 'proposal', 'meeting'] },
    { label: "Chair Information", key: "chairInfo", value: chairInfo || '', showForTypes: ['meeting'] },
    { label: "Security Information", key: "securityInfo", value: securityInfo || '', showForTypes: ['security'] },
    { label: "Date of Bankruptcy", key: "dateBankruptcy", value: dateBankruptcy || '', showForTypes: ['bankruptcy'] },
    { label: "Date Signed", key: "dateSigned", value: dateSigned || '', showForTypes: ['all'] },
    { label: "Official Receiver", key: "officialReceiver", value: officialReceiver || '', showForTypes: ['bankruptcy', 'proposal'] }
  ];

  const handleEdit = () => {
    const initialValues = fields.reduce((acc, field) => ({
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

  // Show all fields for unknown document types
  const relevantFields = formType 
    ? fields.filter(field => 
        field.showForTypes.includes('all') || 
        field.showForTypes.includes(formType.toLowerCase())
      )
    : fields;

  return (
    <div className="p-4 rounded-md bg-muted">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Document Details</h3>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Details
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSaving}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleSave} 
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </div>

      {summary && <DocumentSummary summary={summary} />}
      
      <EditableFields
        fields={relevantFields}
        isEditing={isEditing}
        editedValues={editedValues}
        setEditedValues={setEditedValues}
        isSaving={isSaving}
      />
    </div>
  );
};
