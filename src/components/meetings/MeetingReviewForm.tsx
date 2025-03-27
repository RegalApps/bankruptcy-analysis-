
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

interface MeetingReviewFormProps {
  meetingId: string;
  meetingTitle: string;
  onComplete: () => void;
}

export const MeetingReviewForm = ({ meetingId, meetingTitle, onComplete }: MeetingReviewFormProps) => {
  const [overallRating, setOverallRating] = useState<number>(4);
  const [timeEfficiency, setTimeEfficiency] = useState<number>(80);
  const [technicalIssues, setTechnicalIssues] = useState<"none" | "minor" | "major">("none");
  const [comments, setComments] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const analytics = useEnhancedAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Track the meeting review submission
      analytics.trackInteraction("MeetingReview", "Submit", "Submission", {
        meetingId,
        rating: overallRating,
        timeEfficiency,
        technicalIssues,
        hasComments: comments.length > 0
      });

      // In a real app, you would submit this to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsComplete(true);
      toast({
        title: "Meeting review submitted",
        description: "Thank you for your feedback!",
      });

      // Wait a moment before closing to show confirmation
      setTimeout(() => {
        onComplete();
      }, 1500);
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

  return (
    <Card className="w-full max-w-lg mx-auto">
      {isComplete ? (
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium">Review Submitted!</h3>
            <p className="text-muted-foreground mt-2">
              Thank you for providing your feedback. This helps us improve future meetings.
            </p>
          </div>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Meeting Review</CardTitle>
            <CardDescription>
              Please share your feedback about "{meetingTitle}"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Rating */}
            <div className="space-y-2">
              <Label htmlFor="overall-rating">Overall Rating</Label>
              <div className="flex items-center justify-between gap-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setOverallRating(rating)}
                      className="p-1 focus:outline-none"
                      aria-label={`${rating} stars`}
                    >
                      <Star 
                        className={`h-6 w-6 ${rating <= overallRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm font-medium">{overallRating}/5</span>
              </div>
            </div>

            {/* Time Efficiency */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="time-efficiency">Time Efficiency</Label>
                <span className="text-sm font-medium">{timeEfficiency}%</span>
              </div>
              <Slider
                id="time-efficiency"
                defaultValue={[80]}
                max={100}
                step={5}
                onValueChange={(values) => setTimeEfficiency(values[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Technical Issues */}
            <div className="space-y-2">
              <Label>Technical Issues</Label>
              <RadioGroup defaultValue="none" onValueChange={(value) => setTechnicalIssues(value as "none" | "minor" | "major")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none">No issues</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minor" id="minor" />
                  <Label htmlFor="minor">Minor issues (didn't affect the meeting)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="major" id="major" />
                  <Label htmlFor="major">Major issues (affected the meeting)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <Label htmlFor="comments">Additional Comments</Label>
              <Textarea
                id="comments"
                placeholder="Share any other feedback about the meeting..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onComplete} type="button">
              Skip
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
};
