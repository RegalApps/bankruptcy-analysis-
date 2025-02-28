
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
    <div className="space-y-4">
      {fields.filter(field => field.value || isEditing).map((field) => (
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
              disabled={isSaving}
            />
          ) : (
            <p className="text-sm">{field.value}</p>
          )}
        </div>
      ))}
    </div>
  );
};
