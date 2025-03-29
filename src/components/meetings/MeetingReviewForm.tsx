
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface MeetingReviewFormProps {
  meetingId: string;
  meetingTitle: string;
  onComplete: () => void;
}

export const MeetingReviewForm = ({ meetingId, meetingTitle, onComplete }: MeetingReviewFormProps) => {
  const [summary, setSummary] = useState("");
  const [followUps, setFollowUps] = useState("");
  const [duration, setDuration] = useState("45");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topics, setTopics] = useState<string[]>(["Consumer Proposal", "Financial Assessment"]);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Meeting review saved",
        description: "Your meeting review has been saved successfully",
      });
      
      onComplete();
    }, 1000);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Meeting Review: {meetingTitle}</DialogTitle>
        <DialogDescription>
          Complete this review to save meeting outcomes and follow-up items
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="meeting-duration">Meeting Duration (minutes)</Label>
          <Input
            id="meeting-duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Topics Discussed</Label>
          <div className="grid grid-cols-2 gap-2">
            {["Consumer Proposal", "Financial Assessment", "Debt Counseling", "Document Review", "Bankruptcy Options", "Credit Rebuilding"].map((topic) => (
              <div key={topic} className="flex items-center space-x-2">
                <Checkbox
                  id={`topic-${topic}`}
                  checked={topics.includes(topic)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setTopics([...topics, topic]);
                    } else {
                      setTopics(topics.filter(t => t !== topic));
                    }
                  }}
                />
                <Label htmlFor={`topic-${topic}`} className="text-sm">
                  {topic}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="meeting-summary">Meeting Summary</Label>
          <Textarea
            id="meeting-summary"
            placeholder="Summarize the key points discussed in the meeting..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="min-h-[100px]"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="follow-up-items">Follow-up Items</Label>
          <Textarea
            id="follow-up-items"
            placeholder="List any action items, follow-ups, or next steps..."
            value={followUps}
            onChange={(e) => setFollowUps(e.target.value)}
            className="min-h-[80px]"
            required
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onComplete}
          disabled={isSubmitting}
        >
          Skip
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Review"}
        </Button>
      </DialogFooter>
    </form>
  );
};
