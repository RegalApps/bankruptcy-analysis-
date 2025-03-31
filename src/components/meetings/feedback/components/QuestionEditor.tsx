
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, PlusCircle, GripVertical } from "lucide-react";
import { FeedbackQuestion as FeedbackQuestionType } from "../hooks/useFeedbackForm";

interface QuestionEditorProps {
  question: FeedbackQuestionType;
  onUpdate: (updatedQuestion: FeedbackQuestionType) => void;
  onDelete: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onUpdate,
  onDelete
}) => {
  const [options, setOptions] = useState<string[]>(question.options);
  const [questionText, setQuestionText] = useState(question.question);
  const [allowOther, setAllowOther] = useState(question.allowOther || false);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    
    // Update the parent component
    onUpdate({
      ...question,
      options: newOptions,
      question: questionText,
      allowOther
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    
    // Update the parent component
    onUpdate({
      ...question,
      options: newOptions,
      question: questionText,
      allowOther
    });
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionText(e.target.value);
    
    // Update the parent component
    onUpdate({
      ...question,
      question: e.target.value,
      options,
      allowOther
    });
  };

  const handleAllowOtherChange = () => {
    const newAllowOther = !allowOther;
    setAllowOther(newAllowOther);
    
    // Update the parent component
    onUpdate({
      ...question,
      question: questionText,
      options,
      allowOther: newAllowOther
    });
  };

  return (
    <div className="border p-4 rounded-md space-y-4 mb-4">
      <div className="flex items-center justify-between">
        <Label htmlFor={`question-${question.id}`} className="font-semibold">
          Question
        </Label>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onDelete}
          className="h-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <Input
        id={`question-${question.id}`}
        value={questionText}
        onChange={handleQuestionChange}
        placeholder="Enter your question"
        className="mb-2"
      />
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="font-medium">Answer Options</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddOption}
            className="h-8"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Option
          </Button>
        </div>
        
        <div className="space-y-2 mt-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="text-muted-foreground flex items-center">
                <GripVertical className="h-4 w-4" />
              </div>
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveOption(index)}
                className="h-8 px-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id={`allow-other-${question.id}`}
            checked={allowOther}
            onChange={handleAllowOtherChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor={`allow-other-${question.id}`} className="text-sm">
            Allow "Other" option
          </Label>
        </div>
      </div>
    </div>
  );
};
