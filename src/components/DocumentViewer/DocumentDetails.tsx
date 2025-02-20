
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

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
  documentId: string;
  formType?: string;
}

interface EditableField {
  label: string;
  key: string;
  value: string | undefined;
  showForTypes: string[];
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
  summary,
  documentId,
  formType = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const fields: EditableField[] = [
    { label: "Form Number", key: "formNumber", value: formNumber, showForTypes: ['all'] },
    { label: "Client/Debtor Name", key: "clientName", value: clientName, showForTypes: ['all'] },
    { label: "Licensed Insolvency Trustee", key: "trusteeName", value: trusteeName, showForTypes: ['all'] },
    { label: "Estate Number", key: "estateNumber", value: estateNumber, showForTypes: ['bankruptcy', 'proposal'] },
    { label: "District", key: "district", value: district, showForTypes: ['bankruptcy', 'proposal'] },
    { label: "Division Number", key: "divisionNumber", value: divisionNumber, showForTypes: ['bankruptcy', 'proposal'] },
    { label: "Court Number", key: "courtNumber", value: courtNumber, showForTypes: ['bankruptcy', 'proposal', 'court'] },
    { label: "Meeting of Creditors", key: "meetingOfCreditors", value: meetingOfCreditors, showForTypes: ['bankruptcy', 'proposal', 'meeting'] },
    { label: "Chair Information", key: "chairInfo", value: chairInfo, showForTypes: ['meeting'] },
    { label: "Security Information", key: "securityInfo", value: securityInfo, showForTypes: ['security'] },
    { label: "Date of Bankruptcy", key: "dateBankruptcy", value: dateBankruptcy, showForTypes: ['bankruptcy'] },
    { label: "Date Signed", key: "dateSigned", value: dateSigned, showForTypes: ['all'] },
    { label: "Official Receiver", key: "officialReceiver", value: officialReceiver, showForTypes: ['bankruptcy', 'proposal'] }
  ];

  const handleEdit = () => {
    const initialValues = fields.reduce((acc, field) => ({
      ...acc,
      [field.key]: field.value || ''
    }), {});
    setEditedValues(initialValues);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const { data: existingAnalysis } = await supabase
        .from('document_analysis')
        .select('content')
        .eq('document_id', documentId)
        .single();

      const updatedContent = {
        ...existingAnalysis?.content,
        extracted_info: {
          ...existingAnalysis?.content?.extracted_info,
          ...editedValues
        }
      };

      const { error } = await supabase
        .from('document_analysis')
        .update({ content: updatedContent })
        .eq('document_id', documentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document details updated successfully",
      });

      setIsEditing(false);
      setEditedValues({});

    } catch (error) {
      console.error('Error updating document details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update document details",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValues({});
  };

  const relevantFields = fields.filter(field => 
    field.showForTypes.includes('all') || field.showForTypes.includes(formType.toLowerCase())
  );

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
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button variant="default" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>

      {summary && (
        <div className="mb-4 p-3 bg-background rounded border">
          <h4 className="text-sm font-medium mb-2">Document Summary</h4>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
      )}

      <div className="space-y-4">
        {relevantFields.filter(field => field.value || isEditing).map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-sm text-muted-foreground">{field.label}:</label>
            {isEditing ? (
              <Input
                value={editedValues[field.key] || ''}
                onChange={(e) => setEditedValues({
                  ...editedValues,
                  [field.key]: e.target.value
                })}
                className="mt-1"
              />
            ) : (
              <p className="text-sm">{field.value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
