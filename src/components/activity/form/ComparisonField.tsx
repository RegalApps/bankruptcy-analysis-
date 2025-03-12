
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, TrendingDown, TrendingUp } from "lucide-react";

interface ComparisonFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  previousValue?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  tooltip?: string;
  placeholder?: string;
}

export const ComparisonField = ({
  id,
  name,
  label,
  value,
  previousValue,
  onChange,
  required,
  tooltip,
  placeholder
}: ComparisonFieldProps) => {
  const currentValue = parseFloat(value || '0');
  const prevValue = parseFloat(previousValue || '0');
  
  const hasPreviousValue = previousValue && !isNaN(prevValue);
  const hasChange = hasPreviousValue && !isNaN(currentValue);
  const changePercentage = hasChange ? ((currentValue - prevValue) / prevValue) * 100 : 0;
  const significantChange = Math.abs(changePercentage) > 10;
  
  return (
    <div className="space-y-1">
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
      
      <div className="flex items-center gap-2">
        <Input
          id={id}
          name={name}
          type="number"
          placeholder={placeholder || "0.00"}
          value={value}
          onChange={onChange}
          required={required}
          step="0.01"
          className="flex-grow"
        />
        
        {hasPreviousValue && (
          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
            !hasChange ? 'text-muted-foreground' :
            changePercentage > 0 ? 'text-green-600 bg-green-50' : 
            changePercentage < 0 ? 'text-red-600 bg-red-50' : 
            'text-muted-foreground'
          }`}>
            {hasChange && significantChange && (
              changePercentage > 0 ? 
                <TrendingUp className="h-3 w-3" /> : 
                <TrendingDown className="h-3 w-3" />
            )}
            <span>{hasPreviousValue ? `$${prevValue.toFixed(2)}` : 'N/A'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
