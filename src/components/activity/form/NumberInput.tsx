
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormFieldProps } from "../types";

export const NumberInput = ({ id, name, label, value, onChange, required }: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type="number"
        placeholder="0.00"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};
