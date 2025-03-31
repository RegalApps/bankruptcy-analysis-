
import React from "react";
import { FeedbackQuestion } from "./FeedbackQuestion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Question {
  id: string;
  question: string;
  options: string[];
  allowOther?: boolean;
}

interface FeedbackCategoryProps {
  questions: Question[];
  category: string;
  responses: Record<string, string>;
  otherResponses: Record<string, string>;
  onResponseChange: (questionId: string, value: string) => void;
  onOtherResponseChange: (questionId: string, value: string) => void;
  additionalFeedback?: string;
  onAdditionalFeedbackChange?: (value: string) => void;
  showAdditionalFeedback?: boolean;
}

export const FeedbackCategory = ({
  questions,
  category,
  responses,
  otherResponses,
  onResponseChange,
  onOtherResponseChange,
  additionalFeedback = "",
  onAdditionalFeedbackChange,
  showAdditionalFeedback = false
}: FeedbackCategoryProps) => {
  return (
    <div className="space-y-6 pt-2">
      {questions.map((q) => (
        <FeedbackQuestion
          key={q.id}
          id={q.id}
          question={q.question}
          options={q.options}
          allowOther={q.allowOther}
          value={responses[q.id] || ""}
          otherValue={otherResponses[q.id] || ""}
          onValueChange={(value) => onResponseChange(q.id, value)}
          onOtherValueChange={(value) => onOtherResponseChange(q.id, value)}
        />
      ))}
      
      {showAdditionalFeedback && onAdditionalFeedbackChange && (
        <div className="mt-6">
          <Label htmlFor="additional-feedback" className="font-medium">
            Do you have any additional comments or suggestions for improvement?
          </Label>
          <Textarea
            id="additional-feedback"
            className="mt-2"
            placeholder="Share any additional thoughts here..."
            value={additionalFeedback}
            onChange={(e) => onAdditionalFeedbackChange(e.target.value)}
            rows={4}
          />
        </div>
      )}
    </div>
  );
};
