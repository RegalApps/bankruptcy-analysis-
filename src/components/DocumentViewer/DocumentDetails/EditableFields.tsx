
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditableField } from "./types";
import { Pencil, Save, X } from "lucide-react";

interface EditableFieldsProps {
  fields: Record<string, string | undefined>;
  onSave: (values: Record<string, string>) => Promise<boolean>;
  isLoading: boolean;
}

export const EditableFields = ({
  fields,
  onSave,
  isLoading
}: EditableFieldsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  // Initialize edited values when entering edit mode
  const handleStartEdit = () => {
    const initialValues: Record<string, string> = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        initialValues[key] = value;
      }
    });
    setEditedValues(initialValues);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValues({});
  };

  const handleSave = async () => {
    const success = await onSave(editedValues);
    if (success) {
      setIsEditing(false);
    }
  };

  // Map fields to a format for rendering
  const fieldsList: EditableField[] = Object.entries(fields)
    .map(([key, value]) => {
      // Create a proper label from the key (e.g., "formType" -> "Form Type")
      const label = key
        .replace(/([A-Z])/g, ' $1') // Insert a space before all caps
        .replace(/^./, (str) => str.toUpperCase()); // Uppercase first character
      
      return {
        key,
        label,
        value,
        showForTypes: ['*'] // Show for all types by default
      };
    })
    .filter(field => field.value || isEditing); // Only show fields with values or when editing

  return (
    <div className="space-y-4">
      {/* Edit/Save/Cancel buttons */}
      <div className="flex justify-end space-x-2">
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartEdit}
            disabled={isLoading}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Details
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </>
        )}
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fieldsList.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">{field.label}:</label>
            {isEditing ? (
              <Input
                value={editedValues[field.key] || ''}
                onChange={(e) => setEditedValues({
                  ...editedValues,
                  [field.key]: e.target.value
                })}
                className="mt-1"
                disabled={isLoading}
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
