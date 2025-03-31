
import { useState } from "react";
import { toast } from "sonner";

export interface FeedbackQuestion {
  id: string;
  question: string;
  options: string[];
  allowOther?: boolean;
}

export interface FeedbackCategory {
  [key: string]: FeedbackQuestion[];
}

interface UseFeedbackFormProps {
  meetingId: string;
  onComplete?: () => void;
  feedbackQuestions: FeedbackCategory;
}

export const useFeedbackForm = ({ meetingId, onComplete, feedbackQuestions }: UseFeedbackFormProps) => {
  const [activeTab, setActiveTab] = useState("technical");
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [otherResponses, setOtherResponses] = useState<Record<string, string>>({});
  const [additionalFeedback, setAdditionalFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const categories = Object.keys(feedbackQuestions);
  const currentCategoryIndex = categories.indexOf(activeTab);
  
  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleOtherResponseChange = (questionId: string, value: string) => {
    setOtherResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const nextCategory = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setActiveTab(categories[currentCategoryIndex + 1]);
    }
  };
  
  const previousCategory = () => {
    if (currentCategoryIndex > 0) {
      setActiveTab(categories[currentCategoryIndex - 1]);
    }
  };
  
  // Check if current category is complete
  const isCategoryComplete = (category: string) => {
    const questions = feedbackQuestions[category];
    return questions.every(q => responses[q.id] !== undefined);
  };
  
  // Progress calculation
  const calculateProgress = () => {
    const totalQuestions = Object.values(feedbackQuestions).flat().length;
    const answeredQuestions = Object.keys(responses).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare the data for submission
      const feedbackData = {
        meetingId,
        responses,
        otherResponses,
        additionalFeedback,
        submittedAt: new Date().toISOString()
      };
      
      // This is where you would normally post to your backend
      console.log("Submitting feedback:", feedbackData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsCompleted(true);
      
      toast("Thank you for your valuable feedback!");
      
      // Wait a moment before redirecting or closing
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast("Unable to submit your feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};
