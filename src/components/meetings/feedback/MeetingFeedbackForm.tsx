
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// Define the question categories and their respective questions
const feedbackQuestions = {
  technical: [
    {
      id: "application",
      question: "Which application did you use to attend your meeting today?",
      options: [
        "Zoom", 
        "Google Meet", 
        "Microsoft Teams", 
        "TeamViewer",
        "SecureFiles AI (internal video call)",
        "Phone call (voice only)",
        "Other"
      ],
      allowOther: true
    },
    {
      id: "quality",
      question: "How was the video/audio quality during your meeting?",
      options: [
        "Excellent (clear video/audio, no interruptions)",
        "Good (minor issues, but didn't affect understanding)",
        "Fair (occasional issues, somewhat distracting)",
        "Poor (frequent disruptions, difficult to follow)"
      ]
    }
  ],
  clarity: [
    {
      id: "understanding",
      question: "Did you clearly understand the information provided in today's meeting?",
      options: [
        "Completely clear",
        "Mostly clear",
        "Somewhat unclear",
        "Completely unclear"
      ]
    },
    {
      id: "questions_answered",
      question: "Were your questions answered to your satisfaction?",
      options: [
        "Completely",
        "Mostly",
        "Somewhat",
        "Not at all"
      ]
    },
    {
      id: "next_steps",
      question: "Did you feel well-informed about the next steps after today's meeting?",
      options: [
        "Extremely informed",
        "Adequately informed",
        "Slightly informed",
        "Not informed at all"
      ]
    }
  ],
  comfort: [
    {
      id: "sensitive_issues",
      question: "Did you feel comfortable discussing sensitive issues today?",
      options: [
        "Very comfortable",
        "Moderately comfortable",
        "Slightly uncomfortable",
        "Very uncomfortable"
      ]
    },
    {
      id: "trust",
      question: "Do you trust the trustee to handle your case professionally?",
      options: [
        "Completely trust",
        "Mostly trust",
        "Somewhat doubt",
        "Completely doubt"
      ]
    },
    {
      id: "approachability",
      question: "How approachable and friendly was your trustee during the meeting?",
      options: [
        "Very approachable",
        "Approachable",
        "Neutral",
        "Unapproachable"
      ]
    }
  ],
  professionalism: [
    {
      id: "knowledge",
      question: "How satisfied were you with the trustee's professional knowledge?",
      options: [
        "Extremely satisfied",
        "Satisfied",
        "Neutral",
        "Dissatisfied"
      ]
    },
    {
      id: "communication",
      question: "Did the trustee communicate clearly and effectively?",
      options: [
        "Extremely effectively",
        "Effectively",
        "Somewhat effectively",
        "Ineffectively"
      ]
    },
    {
      id: "respect",
      question: "Did you feel your trustee respected your opinions and concerns?",
      options: [
        "Highly respected",
        "Generally respected",
        "Somewhat ignored",
        "Completely ignored"
      ]
    }
  ],
  future: [
    {
      id: "confidence",
      question: "Do you feel more confident about your financial situation after this meeting?",
      options: [
        "Much more confident",
        "Slightly more confident",
        "No change",
        "Less confident"
      ]
    }
  ]
};

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
    const questions = feedbackQuestions[category as keyof typeof feedbackQuestions];
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
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for your valuable feedback!",
      });
      
      // Wait a moment before redirecting or closing
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Submission failed",
        description: "Unable to submit your feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isCompleted) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex flex-col items-center justify-center text-center py-10">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-6">
            Your feedback has been submitted successfully and will help us improve our services.
          </p>
          <Button onClick={onComplete}>Close</Button>
        </CardContent>
      </Card>
    );
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
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 dark:bg-gray-700">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
        
        {Object.entries(feedbackQuestions).map(([category, questions]) => (
          <TabsContent key={category} value={category} className="m-0">
            <CardContent className="space-y-6 pt-2">
              {questions.map((q) => (
                <div key={q.id} className="space-y-4">
                  <h3 className="font-medium">{q.question}</h3>
                  <RadioGroup 
                    value={responses[q.id] || ""} 
                    onValueChange={(value) => handleResponseChange(q.id, value)}
                    className="space-y-2"
                  >
                    {q.options.map((option, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={option} 
                          id={`${q.id}-${i}`} 
                        />
                        <Label htmlFor={`${q.id}-${i}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  {q.allowOther && responses[q.id] === "Other" && (
                    <div className="mt-2 pl-6">
                      <Label htmlFor={`${q.id}-other`} className="text-sm text-muted-foreground mb-1 block">
                        Please specify:
                      </Label>
                      <Input
                        id={`${q.id}-other`}
                        value={otherResponses[q.id] || ""}
                        onChange={(e) => handleOtherResponseChange(q.id, e.target.value)}
                        placeholder="Enter your response"
                        className="max-w-md"
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {category === "future" && (
                <div className="mt-6">
                  <Label htmlFor="additional-feedback" className="font-medium">
                    Do you have any additional comments or suggestions for improvement?
                  </Label>
                  <Textarea
                    id="additional-feedback"
                    className="mt-2"
                    placeholder="Share any additional thoughts here..."
                    value={additionalFeedback}
                    onChange={(e) => setAdditionalFeedback(e.target.value)}
                    rows={4}
                  />
                </div>
              )}
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
