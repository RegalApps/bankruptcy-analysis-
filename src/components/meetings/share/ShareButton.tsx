
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { ShareMeetingDialog } from "./ShareMeetingDialog";

interface ShareButtonProps {
  meetingId: string;
  meetingTitle: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const ShareButton = ({ 
  meetingId, 
  meetingTitle, 
  variant = "outline", 
  size = "sm",
  className = ""
}: ShareButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        onClick={() => setIsDialogOpen(true)}
        className={`flex items-center gap-1 ${className}`}
      >
        <Share className="h-4 w-4" />
        <span>Share</span>
      </Button>
      
      <ShareMeetingDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        meetingId={meetingId}
        meetingTitle={meetingTitle}
      />
    </>
  );
};
