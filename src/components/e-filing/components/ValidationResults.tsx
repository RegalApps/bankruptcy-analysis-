
import { ValidationItem } from "./ValidationItem";
import { ValidationResult } from "../types";

interface ValidationResultsProps {
  validations: ValidationResult[];
}

export const ValidationResults = ({ validations }: ValidationResultsProps) => {
  return (
    <div className="grid gap-4">
      {validations.map((validation) => (
        <ValidationItem key={validation.id} validation={validation} />
      ))}
    </div>
  );
};
