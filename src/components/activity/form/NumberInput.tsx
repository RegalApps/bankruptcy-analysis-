
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { FormFieldProps } from "../types";

export const NumberInput = ({ 
  id, 
  name, 
  label, 
  value, 
  onChange, 
  required,
  tooltip,
  placeholder 
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id}>{label}</Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Input
        id={id}
        name={name}
        type="number"
        placeholder={placeholder || "0.00"}
        value={value}
        onChange={onChange}
        required={required}
        step="0.01"
      />
    </div>
  );
};
