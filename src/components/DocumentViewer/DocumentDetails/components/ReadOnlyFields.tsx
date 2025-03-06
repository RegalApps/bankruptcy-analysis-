
import { EditableField } from "../types";

interface ReadOnlyFieldsProps {
  fields: EditableField[];
}

export const ReadOnlyFields: React.FC<ReadOnlyFieldsProps> = ({ fields }) => {
  return (
    <>
      {fields.map(field => 
        field.value ? (
          <div key={field.key} className="flex items-start py-2 border-b border-muted last:border-0">
            <div className="flex items-center min-w-[180px] mr-2">
              {field.icon}
              <span className="text-sm ml-2">{field.label}:</span>
            </div>
            <span className="text-sm font-medium">{field.value}</span>
          </div>
        ) : null
      )}
    </>
  );
};
