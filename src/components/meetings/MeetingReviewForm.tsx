
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedAnalytics } from "@/hooks/useEnhancedAnalytics";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

interface MeetingReviewFormProps {
  meetingId: string;
  meetingTitle: string;
  onComplete: () => void;
}

type Rating = 1 | 2 | 3 | 4 | 5;
type YesNo = "yes" | "no";

interface ReviewFormData {
  generalSatisfaction: Rating;
  clarityExplanation: Rating;
  questionsAnswered: YesNo;
  questionsDetails: string;
  trusteeKnowledge: Rating;
  maintainedProfessionalism: YesNo;
  professionalismDetails: string;
  trusteeEmpathy: Rating;
  trusteeEngagement: Rating;
  meetingEffectiveness: Rating;
  nextStepsOutlined: YesNo;
  nextStepsUncertainties: string;
  emotionalState: Rating;
  emotionalImprovement: string;
  actionItemsCommunicated: YesNo;
  actionItemsDetails: string;
  adequatelyPrepared: YesNo;
  preparedConcerns: string;
  platformExperience: Rating;
  platformRecommendations: string;
  likelyToRecommend: Rating;
  willProvideTestimonial: YesNo;
  testimonialText: string;
  additionalFeedback: string;
}

export const MeetingReviewForm = ({ meetingId, meetingTitle, onComplete }: MeetingReviewFormProps) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const analytics = useEnhancedAnalytics();
  
  const [formData, setFormData] = useState<ReviewFormData>({
    generalSatisfaction: 4,
    clarityExplanation: 4,
    questionsAnswered: "yes",
    questionsDetails: "",
    trusteeKnowledge: 4,
    maintainedProfessionalism: "yes",
    professionalismDetails: "",
    trusteeEmpathy: 4,
    trusteeEngagement: 4,
    meetingEffectiveness: 4,
    nextStepsOutlined: "yes",
    nextStepsUncertainties: "",
    emotionalState: 4,
    emotionalImprovement: "",
    actionItemsCommunicated: "yes",
    actionItemsDetails: "",
    adequatelyPrepared: "yes",
    preparedConcerns: "",
    platformExperience: 4,
    platformRecommendations: "",
    likelyToRecommend: 4,
    willProvideTestimonial: "no",
    testimonialText: "",
    additionalFeedback: ""
  });

  const totalSteps = 5;

  const handleInputChange = (
    field: keyof ReviewFormData, 
    value: string | number | Rating | YesNo
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Track the meeting review submission
      analytics.trackInteraction("MeetingReview", "Submit", "Submission", {
        meetingId,
        formData
      });

      // In a real app, you would submit this to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsComplete(true);
      toast({
        title: "Meeting review submitted",
        description: "Thank you for your valuable feedback!",
      });

      // Wait a moment before closing to show confirmation
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was a problem submitting your review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index} 
            className={`h-2 w-2 rounded-full mx-1 ${
              index + 1 === currentStep ? 'bg-primary scale-125' : 
              index + 1 < currentStep ? 'bg-primary/70' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingOptions = (
    field: keyof ReviewFormData, 
    value: number, 
    labels: [string, string, string, string, string]
  ) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{value}/5</span>
        </div>
        <Slider
          defaultValue={[value]}
          max={5}
          min={1}
          step={1}
          onValueChange={(values) => handleInputChange(field, values[0] as Rating)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
          <span>{labels[2]}</span>
          <span>{labels[3]}</span>
          <span>{labels[4]}</span>
        </div>
      </div>
    );
  };

  const renderYesNoOptions = (
    field: keyof ReviewFormData, 
    value: YesNo,
    showDetailsField: boolean = false,
    detailsField?: keyof ReviewFormData
  ) => {
    return (
      <div className="space-y-3">
        <RadioGroup 
          defaultValue={value}
          onValueChange={(val) => handleInputChange(field, val as YesNo)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id={`${field}-yes`} />
            <Label htmlFor={`${field}-yes`}>Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id={`${field}-no`} />
            <Label htmlFor={`${field}-no`}>No</Label>
          </div>
        </RadioGroup>
        
        {showDetailsField && value === "no" && detailsField && (
          <div className="mt-3">
            <Label htmlFor={detailsField.toString()}>Please provide details:</Label>
            <Textarea
              id={detailsField.toString()}
              value={formData[detailsField] as string}
              onChange={(e) => handleInputChange(detailsField, e.target.value)}
              placeholder="Please provide more information..."
              className="mt-1"
            />
          </div>
        )}
      </div>
    );
  };

  if (isComplete) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium">Review Submitted!</h3>
            <p className="text-muted-foreground mt-2">
              Thank you for providing your comprehensive feedback. This helps us improve our services and client experiences.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Client Consultation Review</CardTitle>
          <CardDescription>
            Please share your feedback about your consultation with our Licensed Insolvency Trustee regarding "{meetingTitle}"
          </CardDescription>
          {renderStepIndicator()}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>1. Overall, how satisfied were you with your consultation with the Licensed Insolvency Trustee (LIT)?</Label>
                {renderRatingOptions(
                  "generalSatisfaction", 
                  formData.generalSatisfaction,
                  ["Very Unsatisfied", "Unsatisfied", "Neutral", "Satisfied", "Very Satisfied"]
                )}
              </div>
              
              <div className="space-y-3">
                <Label>2. Did the LIT clearly explain insolvency processes, options, and potential outcomes?</Label>
                {renderRatingOptions(
                  "clarityExplanation", 
                  formData.clarityExplanation,
                  ["Not clear at all", "Slightly clear", "Moderately clear", "Very clear", "Extremely clear"]
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Were all your questions about your financial situation and possible solutions adequately answered?</Label>
                {renderYesNoOptions("questionsAnswered", formData.questionsAnswered, true, "questionsDetails")}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>3. How would you rate the trustee's knowledge about insolvency laws, processes, and options?</Label>
                {renderRatingOptions(
                  "trusteeKnowledge", 
                  formData.trusteeKnowledge,
                  ["Not knowledgeable", "Slightly knowledgeable", "Moderately knowledgeable", "Very knowledgeable", "Extremely knowledgeable"]
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Did you feel the trustee maintained professionalism and confidentiality throughout your consultation?</Label>
                {renderYesNoOptions("maintainedProfessionalism", formData.maintainedProfessionalism, true, "professionalismDetails")}
              </div>
              
              <div className="space-y-3">
                <Label>4. Did the trustee show genuine empathy and understanding of your financial situation?</Label>
                {renderRatingOptions(
                  "trusteeEmpathy", 
                  formData.trusteeEmpathy,
                  ["Not empathetic", "Slightly empathetic", "Moderately empathetic", "Very empathetic", "Extremely empathetic"]
                )}
              </div>
              
              <div className="space-y-3">
                <Label>How engaging was the trustee during your consultation?</Label>
                {renderRatingOptions(
                  "trusteeEngagement", 
                  formData.trusteeEngagement,
                  ["Not engaging", "Slightly engaging", "Moderately engaging", "Very engaging", "Extremely engaging"]
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>5. Was the meeting effective in addressing your insolvency concerns?</Label>
                {renderRatingOptions(
                  "meetingEffectiveness", 
                  formData.meetingEffectiveness,
                  ["Not effective", "Slightly effective", "Moderately effective", "Very effective", "Extremely effective"]
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Did the trustee clearly outline your next steps and any required actions?</Label>
                {renderYesNoOptions("nextStepsOutlined", formData.nextStepsOutlined, true, "nextStepsUncertainties")}
              </div>
              
              <div className="space-y-3">
                <Label>6. How did you feel emotionally after the meeting regarding your financial situation?</Label>
                {renderRatingOptions(
                  "emotionalState", 
                  formData.emotionalState,
                  ["Much worse", "Worse", "No change", "Better", "Much better"]
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emotionalImprovement">Could anything have improved your emotional or overall experience?</Label>
                <Textarea
                  id="emotionalImprovement"
                  value={formData.emotionalImprovement}
                  onChange={(e) => handleInputChange("emotionalImprovement", e.target.value)}
                  placeholder="Share your thoughts here..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>7. Were specific action items and responsibilities clearly communicated to you?</Label>
                {renderYesNoOptions("actionItemsCommunicated", formData.actionItemsCommunicated, true, "actionItemsDetails")}
              </div>
              
              <div className="space-y-2">
                <Label>Do you feel adequately prepared and informed for the next steps in the insolvency process?</Label>
                {renderYesNoOptions("adequatelyPrepared", formData.adequatelyPrepared, true, "preparedConcerns")}
              </div>
              
              <div className="space-y-3">
                <Label>8. Rate your experience with the SecureFiles AI meeting platform:</Label>
                {renderRatingOptions(
                  "platformExperience", 
                  formData.platformExperience,
                  ["Poor", "Fair", "Good", "Very Good", "Excellent"]
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platformRecommendations">Do you have any recommendations for improving the SecureFiles AI platform specifically for insolvency consultations?</Label>
                <Textarea
                  id="platformRecommendations"
                  value={formData.platformRecommendations}
                  onChange={(e) => handleInputChange("platformRecommendations", e.target.value)}
                  placeholder="Suggestions for platform improvements..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>9. Based on this experience, how likely are you to recommend our trustee services to others facing financial difficulties?</Label>
                {renderRatingOptions(
                  "likelyToRecommend", 
                  formData.likelyToRecommend,
                  ["Very unlikely", "Unlikely", "Neutral", "Likely", "Very likely"]
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="willProvideTestimonial" 
                    checked={formData.willProvideTestimonial === "yes"}
                    onCheckedChange={(checked) => {
                      handleInputChange("willProvideTestimonial", checked ? "yes" : "no");
                    }}
                  />
                  <Label htmlFor="willProvideTestimonial">
                    Would you like to provide a testimonial that we can share with others facing similar financial challenges?
                  </Label>
                </div>
                
                {formData.willProvideTestimonial === "yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="testimonialText">Your testimonial:</Label>
                    <Textarea
                      id="testimonialText"
                      value={formData.testimonialText}
                      onChange={(e) => handleInputChange("testimonialText", e.target.value)}
                      placeholder="Write your testimonial here..."
                      rows={3}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalFeedback">10. Please provide any other feedback, insights, or suggestions to help us enhance our insolvency consultation services:</Label>
                <Textarea
                  id="additionalFeedback"
                  value={formData.additionalFeedback}
                  onChange={(e) => handleInputChange("additionalFeedback", e.target.value)}
                  placeholder="Any additional thoughts or feedback..."
                  rows={4}
                />
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {currentStep === 1 ? (
            <Button variant="outline" onClick={onComplete} type="button">
              Skip
            </Button>
          ) : (
            <Button variant="outline" onClick={prevStep} type="button">
              Previous
            </Button>
          )}
          
          {currentStep < totalSteps ? (
            <Button type="button" onClick={nextStep}>
              Continue
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};
