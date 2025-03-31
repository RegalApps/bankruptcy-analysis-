
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FeedbackQuestionProps {
  id: string;
  question: string;
  options: string[];
  allowOther?: boolean;
  value: string;
  otherValue?: string;
  onValueChange: (value: string) => void;
  onOtherValueChange?: (value: string) => void;
}

export const FeedbackQuestion = ({
  id,
  question,
  options,
  allowOther = false,
  value,
  otherValue = "",
  onValueChange,
  onOtherValueChange
}: FeedbackQuestionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">{question}</h3>
      <RadioGroup 
        value={value || ""} 
        onValueChange={onValueChange}
        className="space-y-2"
      >
        {options.map((option, i) => (
          <div key={i} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option} 
              id={`${id}-${i}`} 
            />
            <Label htmlFor={`${id}-${i}`}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
      
      {allowOther && value === "Other" && onOtherValueChange && (
        <div className="mt-2 pl-6">
          <Label htmlFor={`${id}-other`} className="text-sm text-muted-foreground mb-1 block">
            Please specify:
          </Label>
          <Input
            id={`${id}-other`}
            value={otherValue}
            onChange={(e) => onOtherValueChange(e.target.value)}
            placeholder="Enter your response"
            className="max-w-md"
          />
        </div>
      )}
    </div>
  );
};
