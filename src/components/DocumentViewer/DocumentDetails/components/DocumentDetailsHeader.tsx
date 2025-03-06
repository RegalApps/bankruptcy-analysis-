
import { Button } from "@/components/ui/button";
import { Pencil, Save, X, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocumentDetailsHeaderProps {
  isEditing: boolean;
  isSaving: boolean;
  formType?: string;
  handleEdit: () => void;
  handleSave: () => void;
  handleCancel: () => void;
}

export const DocumentDetailsHeader: React.FC<DocumentDetailsHeaderProps> = ({
  isEditing,
  isSaving,
  formType,
  handleEdit,
  handleSave,
  handleCancel
}) => {
  return (
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
  );
};
