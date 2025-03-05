
import { Input } from "@/components/ui/input";
import { EditableField } from "./types";

interface EditableFieldsProps {
  fields: EditableField[];
  isEditing: boolean;
  editedValues: Record<string, string>;
  setEditedValues: (values: Record<string, string>) => void;
  isSaving: boolean;
}

export const EditableFields = ({
  fields,
  isEditing,
  editedValues,
  setEditedValues,
  isSaving
}: EditableFieldsProps) => {
  return (
    <div className="space-y-4 mt-4">
      {fields.filter(field => field.value || isEditing).map((field) => (
        <div key={field.key} className="space-y-2">
          <div className="flex items-center gap-2">
            {field.icon}
            <label className="text-sm text-muted-foreground">{field.label}:</label>
          </div>
          {isEditing ? (
            <Input
              value={editedValues[field.key] || ''}
              onChange={(e) => setEditedValues({
                ...editedValues,
                [field.key]: e.target.value
              })}
              className="mt-1"
              disabled={isSaving}
            />
          ) : (
            <p className="text-sm pl-6">{field.value || 'Not available'}</p>
          )}
        </div>
      ))}
    </div>
  );
};
