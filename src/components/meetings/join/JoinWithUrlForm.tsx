
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface JoinWithUrlFormProps {
  onJoin: () => void;
}

export const JoinWithUrlForm = ({ onJoin }: JoinWithUrlFormProps) => {
  const [meetingUrl, setMeetingUrl] = useState("");
  const { toast } = useToast();

  const handleJoinWithUrl = () => {
    if (!meetingUrl) {
      toast({
        title: "Missing Information",
        description: "Please enter a meeting URL",
        variant: "destructive"
      });
      return;
    }
    
    // Validate URL format
    try {
      new URL(meetingUrl);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid meeting URL",
        variant: "destructive"
      });
      return;
    }
    
    // Open the meeting URL in a new tab
    window.open(meetingUrl, "_blank");
    
    toast({
      title: "Joining Meeting",
      description: "Opening the meeting link in a new tab",
    });

    onJoin();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="meeting-url">Meeting URL</Label>
        <Input
          id="meeting-url"
          placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-xyz-123"
          value={meetingUrl}
          onChange={(e) => setMeetingUrl(e.target.value)}
        />
      </div>
      
      <Button onClick={handleJoinWithUrl} className="w-full sm:w-auto">
        Join Meeting
      </Button>
    </div>
  );
};
