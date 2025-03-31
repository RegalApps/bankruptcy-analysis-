
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

// Import refactored components
import { FeedbackCategory } from "./components/FeedbackCategory";
import { ProgressBar } from "./components/ProgressBar";
import { SuccessScreen } from "./components/SuccessScreen";
import { useFeedbackForm } from "./hooks/useFeedbackForm";
import { feedbackQuestions } from "./data/feedbackQuestions";

interface MeetingFeedbackFormProps {
  meetingId: string;
  meetingTitle: string;
  clientName?: string;
  onComplete?: () => void;
}

export const MeetingFeedbackForm = ({ 
  meetingId, 
  meetingTitle, 
  clientName = "Client", 
  onComplete 
}: MeetingFeedbackFormProps) => {
  const navigate = useNavigate();
  
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
    feedbackQuestions
  });
  
  if (isCompleted) {
    return <SuccessScreen onClose={onComplete || (() => {})} />;
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Meeting Feedback</CardTitle>
        <CardDescription>
          Please share your thoughts on your meeting{clientName ? ` with ${clientName}` : ''}: {meetingTitle}
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
          
          {/* Progress bar */}
          <ProgressBar percentage={calculateProgress()} />
        </div>
        
        {Object.entries(feedbackQuestions).map(([category, questions]) => (
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
        ))}
      </Tabs>
      
      <CardFooter className="flex justify-between">
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
      </CardFooter>
    </Card>
  );
};
