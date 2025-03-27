
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface JoinWithIdFormProps {
  onJoin: () => void;
}

export const JoinWithIdForm = ({ onJoin }: JoinWithIdFormProps) => {
  const [meetingId, setMeetingId] = useState("");
  const [meetingPassword, setMeetingPassword] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleJoinWithId = () => {
    if (!meetingId) {
      toast({
        title: "Missing Information",
        description: "Please enter a meeting ID",
        variant: "destructive"
      });
      return;
    }
    
    if (!name) {
      toast({
        title: "Missing Information",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }
    
    let url: string;
    
    // Detect meeting service based on ID format
    if (meetingId.includes("-")) {
      // Likely Google Meet
      url = `https://meet.google.com/${meetingId}`;
    } else if (meetingId.length >= 9 && meetingId.length <= 11 && /^\d+$/.test(meetingId)) {
      // Likely Zoom
      url = `https://zoom.us/j/${meetingId}${meetingPassword ? `?pwd=${meetingPassword}` : ''}`;
    } else {
      // Generic format
      url = `https://zoom.us/j/${meetingId}${meetingPassword ? `?pwd=${meetingPassword}` : ''}`;
    }
    
    window.open(url, "_blank");
    
    toast({
      title: "Joining Meeting",
      description: "Opening the meeting in a new tab",
    });

    onJoin();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="meeting-id">Meeting ID</Label>
        <Input
          id="meeting-id"
          placeholder="123 456 7890 or abc-defg-hij"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="meeting-password">Password (Optional)</Label>
        <Input
          id="meeting-password"
          placeholder="Enter meeting password if required"
          value={meetingPassword}
          onChange={(e) => setMeetingPassword(e.target.value)}
        />
      </div>

      <Button onClick={handleJoinWithId} className="w-full sm:w-auto">
        Join Meeting
      </Button>
    </div>
  );
};
