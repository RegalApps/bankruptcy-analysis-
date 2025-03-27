
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface NotesHeaderProps {
  title: string;
  isStandalone: boolean;
}

export const NotesHeader = ({ title, isStandalone }: NotesHeaderProps) => {
  const { toast } = useToast();
  
  const openInNewWindow = () => {
    const features = 'width=800,height=700,resizable=yes,scrollbars=yes';
    const notesWindow = window.open('/meetings/notes-standalone', 'meetingNotes', features);
    
    if (notesWindow) {
      notesWindow.focus();
    } else {
      toast({
        title: "Popup Blocked",
        description: "Please allow popups for this site to open the notes in a new window.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold leading-tight">{title}</h2>
      
      {!isStandalone && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={openInNewWindow}
          className="flex items-center gap-1"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Open in New Window</span>
        </Button>
      )}
    </div>
  );
};
