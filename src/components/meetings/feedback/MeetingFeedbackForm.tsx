
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Send, Save } from "lucide-react";
import { toast } from "sonner";

// Import refactored components
import { FeedbackCategory } from "./components/FeedbackCategory";
import { ProgressBar } from "./components/ProgressBar";
import { SuccessScreen } from "./components/SuccessScreen";
import { CategoryEditor } from "./components/CategoryEditor";
import { useFeedbackForm } from "./hooks/useFeedbackForm";
import { feedbackQuestions } from "./data/feedbackQuestions";

interface MeetingFeedbackFormProps {
  meetingId: string;
  meetingTitle: string;
  clientName?: string;
  onComplete?: () => void;
  editMode?: boolean;
}

export const MeetingFeedbackForm = ({ 
  meetingId, 
  meetingTitle, 
  clientName = "Client", 
  onComplete,
  editMode = false
}: MeetingFeedbackFormProps) => {
  const navigate = useNavigate();
  const [customQuestions, setCustomQuestions] = useState(() => feedbackQuestions);
  
  const {
    activeTab,
    setActiveTab,
    responses,
    otherResponses,
    additionalFeedback,
    setAdditionalFeedback,
    isSubmitting,
    isCompleted,
    categories,
    currentCategoryIndex,
    handleResponseChange,
    handleOtherResponseChange,
    nextCategory,
    previousCategory,
    isCategoryComplete,
    calculateProgress,
    handleSubmit
  } = useFeedbackForm({
    meetingId,
    onComplete,
    feedbackQuestions: customQuestions
  });
  
  const handleUpdateQuestion = (category: string, questionId: string, updatedQuestion: any) => {
    setCustomQuestions(prev => {
      const newQuestions = { ...prev };
      const questionIndex = newQuestions[category].findIndex(q => q.id === questionId);
      
      if (questionIndex !== -1) {
        newQuestions[category] = [
          ...newQuestions[category].slice(0, questionIndex),
          updatedQuestion,
          ...newQuestions[category].slice(questionIndex + 1)
        ];
      }
      
      return newQuestions;
    });
  };
  
  const handleDeleteQuestion = (category: string, questionId: string) => {
    setCustomQuestions(prev => {
      const newQuestions = { ...prev };
      newQuestions[category] = newQuestions[category].filter(q => q.id !== questionId);
      
      return newQuestions;
    });
  };
  
  const handleAddQuestion = (category: string) => {
    setCustomQuestions(prev => {
      const newQuestions = { ...prev };
      const newId = `question_${Date.now()}`;
      
      newQuestions[category] = [
        ...newQuestions[category],
        {
          id: newId,
          question: "New Question",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          allowOther: false
        }
      ];
      
      return newQuestions;
    });
  };
  
  const handleSaveCustomQuestions = () => {
    // In a real application, you would save the customQuestions to a database
    // For now, we'll just show a toast message
    toast("Custom questions saved successfully");
  };
  
  if (isCompleted) {
    return <SuccessScreen onClose={onComplete || (() => {})} />;
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Meeting Feedback</CardTitle>
        <CardDescription>
          {editMode 
            ? "Customize the feedback questions for your client" 
            : `Please share your thoughts on your meeting${clientName ? ` with ${clientName}` : ''}: ${meetingTitle}`}
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="clarity">Clarity</TabsTrigger>
            <TabsTrigger value="comfort">Comfort</TabsTrigger>
            <TabsTrigger value="professionalism">Professionalism</TabsTrigger>
            <TabsTrigger value="future">Confidence</TabsTrigger>
          </TabsList>
          
          {!editMode && <ProgressBar percentage={calculateProgress()} />}
        </div>
        
        {editMode ? (
          // Edit mode - show question editors for each category
          Object.entries(customQuestions).map(([category, questions]) => (
            <TabsContent key={category} value={category} className="m-0">
              <CardContent className="pt-2">
                <CategoryEditor
                  category={category}
                  questions={questions}
                  onUpdateQuestion={(questionId, updatedQuestion) => 
                    handleUpdateQuestion(category, questionId, updatedQuestion)
                  }
                  onDeleteQuestion={(questionId) => 
                    handleDeleteQuestion(category, questionId)
                  }
                  onAddQuestion={() => handleAddQuestion(category)}
                />
              </CardContent>
            </TabsContent>
          ))
        ) : (
          // Normal mode - show feedback form
          Object.entries(customQuestions).map(([category, questions]) => (
            <TabsContent key={category} value={category} className="m-0">
              <CardContent className="space-y-6 pt-2">
                <FeedbackCategory
                  category={category}
                  questions={questions}
                  responses={responses}
                  otherResponses={otherResponses}
                  onResponseChange={handleResponseChange}
                  onOtherResponseChange={handleOtherResponseChange}
                  additionalFeedback={additionalFeedback}
                  onAdditionalFeedbackChange={setAdditionalFeedback}
                  showAdditionalFeedback={category === "future"}
                />
              </CardContent>
            </TabsContent>
          ))
        )}
      </Tabs>
      
      <CardFooter className="flex justify-between">
        {editMode ? (
          // Edit mode footer
          <>
            <Button variant="outline" onClick={() => setActiveTab(categories[Math.max(0, currentCategoryIndex - 1)])}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <Button onClick={handleSaveCustomQuestions}>
              <Save className="mr-2 h-4 w-4" />
              Save Questions
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setActiveTab(categories[Math.min(categories.length - 1, currentCategoryIndex + 1)])}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : (
          // Normal mode footer
          <>
            <Button
              variant="outline"
              onClick={previousCategory}
              disabled={currentCategoryIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            {currentCategoryIndex < categories.length - 1 ? (
              <Button
                onClick={nextCategory}
                disabled={!isCategoryComplete(activeTab)}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !isCategoryComplete(activeTab)}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};
