
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Save, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

interface RequestFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting: {
    id: string;
    title: string;
    date: string;
    clientName: string;
  } | null;
  onSubmit: (email: string) => void;
}

interface FeedbackQuestion {
  id: string;
  question: string;
  options: string[];
  allowOther?: boolean;
}

// Default feedback questions structure by category
const defaultFeedbackQuestions: Record<string, FeedbackQuestion[]> = {
  experience: [
    {
      id: "exp_1",
      question: "How would you rate your overall meeting experience?",
      options: ["Excellent", "Good", "Average", "Poor", "Very Poor"]
    },
    {
      id: "exp_2",
      question: "Was the meeting duration appropriate for your needs?",
      options: ["Yes, perfect", "Slightly too long", "Slightly too short", "Much too long", "Much too short"],
      allowOther: true
    }
  ],
  content: [
    {
      id: "cont_1",
      question: "Was the information provided clear and understandable?",
      options: ["Very clear", "Mostly clear", "Somewhat unclear", "Very unclear"]
    },
    {
      id: "cont_2",
      question: "Did we address all your questions and concerns?",
      options: ["Yes, completely", "Mostly yes", "Only partially", "No, not at all"],
      allowOther: true
    }
  ],
  followup: [
    {
      id: "follow_1",
      question: "Would you like to schedule a follow-up meeting?",
      options: ["Yes, as soon as possible", "Yes, in the next few weeks", "Not at this time", "No"]
    },
    {
      id: "follow_2",
      question: "How likely are you to recommend our services to others?",
      options: ["Very likely", "Somewhat likely", "Not likely", "Would not recommend"]
    }
  ]
};

export const RequestFeedbackDialog = ({
  open,
  onOpenChange,
  meeting,
  onSubmit
}: RequestFeedbackDialogProps) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sendReminder, setSendReminder] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [customFeedbackQuestions, setCustomFeedbackQuestions] = useState(defaultFeedbackQuestions);

  const handleSubmit = () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Save custom questions to localStorage for future use
    localStorage.setItem('customFeedbackQuestions', JSON.stringify(customFeedbackQuestions));
    
    onSubmit(email);
    // Reset form
    setEmail("");
    setMessage("");
    setSendReminder(false);
  };

  const handleAddQuestion = (category: string) => {
    const newId = `${category}_${Date.now()}`;
    const newQuestion: FeedbackQuestion = {
      id: newId,
      question: "New Question",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"]
    };

    setCustomFeedbackQuestions({
      ...customFeedbackQuestions,
      [category]: [...customFeedbackQuestions[category], newQuestion]
    });
  };

  const handleUpdateQuestion = (category: string, questionId: string, field: string, value: string | string[] | boolean) => {
    const updatedQuestions = {...customFeedbackQuestions};
    const questionIndex = updatedQuestions[category].findIndex(q => q.id === questionId);
    
    if (questionIndex !== -1) {
      updatedQuestions[category][questionIndex] = {
        ...updatedQuestions[category][questionIndex],
        [field]: value
      };
      setCustomFeedbackQuestions(updatedQuestions);
    }
  };

  const handleDeleteQuestion = (category: string, questionId: string) => {
    const updatedQuestions = {...customFeedbackQuestions};
    updatedQuestions[category] = updatedQuestions[category].filter(q => q.id !== questionId);
    setCustomFeedbackQuestions(updatedQuestions);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Request Meeting Feedback</DialogTitle>
            {activeTab === "customize" && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditMode(!isEditMode)}>
                {isEditMode ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                <span className="ml-1">{isEditMode ? "Save" : "Edit"}</span>
              </Button>
            )}
          </div>
          <DialogDescription>
            Send a feedback request for the meeting: {meeting?.title}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="customize">Customize Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient-email">Recipient Email</Label>
              <Input
                id="recipient-email"
                placeholder="client@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <p className="text-xs text-muted-foreground">
                This is usually the client's email address
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="feedback-message">Message (Optional)</Label>
              <Textarea
                id="feedback-message"
                placeholder="We'd love to hear your thoughts on our recent meeting..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="send-reminder" 
                checked={sendReminder}
                onCheckedChange={(checked) => setSendReminder(checked as boolean)}
              />
              <Label htmlFor="send-reminder" className="text-sm font-normal cursor-pointer">
                Send a reminder in 2 days if no response
              </Label>
            </div>
          </TabsContent>
          
          <TabsContent value="customize" className="space-y-4">
            <div className="space-y-4">
              {Object.entries(customFeedbackQuestions).map(([category, questions]) => (
                <div key={category} className="border rounded-md p-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium capitalize">{category}</h3>
                    {isEditMode && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleAddQuestion(category)}
                      >
                        Add Question
                      </Button>
                    )}
                  </div>
                  
                  {questions.map((question, index) => (
                    <div key={question.id} className="border-t pt-2">
                      {isEditMode ? (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Input 
                              value={question.question}
                              onChange={(e) => handleUpdateQuestion(category, question.id, 'question', e.target.value)}
                              className="text-sm"
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive" 
                              onClick={() => handleDeleteQuestion(category, question.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              </svg>
                            </Button>
                          </div>
                          <div className="text-xs">
                            Options (comma-separated):
                            <Textarea
                              value={question.options.join(', ')}
                              onChange={(e) => handleUpdateQuestion(
                                category, 
                                question.id, 
                                'options', 
                                e.target.value.split(',').map(o => o.trim())
                              )}
                              className="mt-1 resize-none"
                              rows={2}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`allow-other-${question.id}`}
                              checked={question.allowOther || false}
                              onCheckedChange={(checked) => handleUpdateQuestion(
                                category,
                                question.id,
                                'allowOther',
                                checked as boolean
                              )}
                            />
                            <Label htmlFor={`allow-other-${question.id}`} className="text-xs font-normal">
                              Allow "Other" option
                            </Label>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm">{index + 1}. {question.question}</p>
                          <div className="mt-1 text-xs text-muted-foreground flex flex-wrap gap-1">
                            {question.options.map((option, i) => (
                              <span key={i} className="bg-muted px-1.5 py-0.5 rounded-sm">
                                {option}
                              </span>
                            ))}
                            {question.allowOther && (
                              <span className="bg-muted px-1.5 py-0.5 rounded-sm italic">
                                Other...
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center pt-2">
          {activeTab === "customize" ? (
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => setActiveTab("basic")}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleSubmit}>
                Send Request
              </Button>
            </div>
          ) : (
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setActiveTab("customize")}>
                  Customize
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <Button onClick={handleSubmit}>
                  Send Request
                </Button>
              </div>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
