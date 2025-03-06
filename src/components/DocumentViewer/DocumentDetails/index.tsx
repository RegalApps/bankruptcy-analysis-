
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Save, X, FileText, User, Calendar, Building } from "lucide-react";
import { DocumentDetailsProps, EditableField } from "./types";
import { useDocumentUpdate } from "./useDocumentUpdate";
import { DocumentSummary } from "./DocumentSummary";
import { EditableFields } from "./EditableFields";
import { Badge } from "@/components/ui/badge";

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

  const fields: EditableField[] = [
    { 
      label: "Form Number", 
      key: "formNumber", 
      value: formNumber || '', 
      showForTypes: ['all'],
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Client/Debtor Name", 
      key: "clientName", 
      value: clientName || '', 
      showForTypes: ['all'],
      icon: <User className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Licensed Insolvency Trustee", 
      key: "trusteeName", 
      value: trusteeName || '', 
      showForTypes: ['form-76', 'bankruptcy'],
      icon: <User className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Administrator", 
      key: "administratorName", 
      value: administratorName || '', 
      showForTypes: ['form-47', 'proposal'],
      icon: <User className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Document Status", 
      key: "documentStatus", 
      value: documentStatus || '', 
      showForTypes: ['form-47', 'proposal'],
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Filing Date", 
      key: "filingDate", 
      value: filingDate ? new Date(filingDate).toLocaleDateString() : '', 
      showForTypes: ['form-47', 'form-76', 'proposal', 'bankruptcy'],
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Submission Deadline", 
      key: "submissionDeadline", 
      value: submissionDeadline ? new Date(submissionDeadline).toLocaleDateString() : '', 
      showForTypes: ['form-47', 'form-76', 'proposal', 'bankruptcy'],
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Estate Number", 
      key: "estateNumber", 
      value: estateNumber || '', 
      showForTypes: ['bankruptcy', 'proposal'],
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "District", 
      key: "district", 
      value: district || '', 
      showForTypes: ['bankruptcy', 'proposal'],
      icon: <Building className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Division Number", 
      key: "divisionNumber", 
      value: divisionNumber || '', 
      showForTypes: ['bankruptcy', 'proposal'],
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Court Number", 
      key: "courtNumber", 
      value: courtNumber || '', 
      showForTypes: ['bankruptcy', 'proposal', 'court'],
      icon: <Building className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Meeting of Creditors", 
      key: "meetingOfCreditors", 
      value: meetingOfCreditors || '', 
      showForTypes: ['bankruptcy', 'proposal', 'meeting'],
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Chair Information", 
      key: "chairInfo", 
      value: chairInfo || '', 
      showForTypes: ['meeting'],
      icon: <User className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Security Information", 
      key: "securityInfo", 
      value: securityInfo || '', 
      showForTypes: ['security'],
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Date of Bankruptcy", 
      key: "dateBankruptcy", 
      value: dateBankruptcy || '', 
      showForTypes: ['bankruptcy'],
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Date Signed", 
      key: "dateSigned", 
      value: dateSigned || '', 
      showForTypes: ['all'],
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Official Receiver", 
      key: "officialReceiver", 
      value: officialReceiver || '', 
      showForTypes: ['bankruptcy', 'proposal'],
      icon: <User className="h-4 w-4 text-muted-foreground" />
    }
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
    <div className="rounded-md bg-muted/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Document Details</h3>
          {formType && (
            <Badge variant="outline" className="ml-2 text-xs">
              {formType === 'form-47' ? 'Consumer Proposal' : 
               formType === 'form-76' ? 'Statement of Affairs' : 
               formType}
            </Badge>
          )}
        </div>
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
            <Button variant="default" size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      {summary && <DocumentSummary summary={summary} />}

      <div className="space-y-1 mt-4">
        {isEditing ? (
          <EditableFields 
            fields={relevantFields} 
            editedValues={editedValues} 
            setEditedValues={setEditedValues} 
          />
        ) : (
          relevantFields.map(field => 
            field.value ? (
              <div key={field.key} className="flex items-start py-2 border-b border-muted last:border-0">
                <div className="flex items-center min-w-[180px] mr-2">
                  {field.icon}
                  <span className="text-sm ml-2">{field.label}:</span>
                </div>
                <span className="text-sm font-medium">{field.value}</span>
              </div>
            ) : null
          )
        )}
      </div>
    </div>
  );
};
