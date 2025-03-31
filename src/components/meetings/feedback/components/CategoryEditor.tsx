
import React from "react";
import { Button } from "@/components/ui/button";
import { QuestionEditor } from "./QuestionEditor";
import { PlusCircle } from "lucide-react";
import { FeedbackQuestion } from "../hooks/useFeedbackForm";

interface CategoryEditorProps {
  category: string;
  questions: FeedbackQuestion[];
  onUpdateQuestion: (questionId: string, updatedQuestion: FeedbackQuestion) => void;
  onDeleteQuestion: (questionId: string) => void;
  onAddQuestion: (category: string) => void;
}

export const CategoryEditor: React.FC<CategoryEditorProps> = ({
  category,
  questions,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddQuestion,
}) => {
  const getCategoryTitle = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{getCategoryTitle(category)} Questions</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddQuestion(category)}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Question
        </Button>
      </div>
      
      <div className="space-y-4">
        {questions.map((question) => (
          <QuestionEditor
            key={question.id}
            question={question}
            onUpdate={(updatedQuestion) => onUpdateQuestion(question.id, updatedQuestion)}
            onDelete={() => onDeleteQuestion(question.id)}
          />
        ))}
        
        {questions.length === 0 && (
          <div className="text-center p-4 border border-dashed rounded-md">
            <p className="text-muted-foreground">No questions in this category.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddQuestion(category)}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
