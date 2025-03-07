
import { EditableField } from "../types";

interface ReadOnlyFieldsProps {
  fields: EditableField[];
}

export const ReadOnlyFields: React.FC<ReadOnlyFieldsProps> = ({ fields }) => {
  return (
    <>
      {fields.map(field => 
        field.value ? (
          <div key={field.key} className="flex items-start py-2 border-b border-muted/50 last:border-0">
            <div className="flex items-center min-w-[120px] mr-2">
              {field.icon && <span className="text-primary/80 mr-1.5">{field.icon}</span>}
              <span className="text-xs font-medium text-muted-foreground">{field.label}:</span>
            </div>
            <span className="text-sm">{field.value}</span>
          </div>
        ) : null
      )}
    </>
  );
};
