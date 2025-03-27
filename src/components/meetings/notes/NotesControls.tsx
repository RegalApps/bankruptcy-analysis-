
import { Mic, MicOff, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotesControlsProps {
  isRecording: boolean;
  toggleRecording: () => void;
  hasTranscription: boolean;
  onExportNotes: () => void;
}

export const NotesControls = ({ 
  isRecording, 
  toggleRecording, 
  hasTranscription, 
  onExportNotes 
}: NotesControlsProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button 
        onClick={toggleRecording}
        variant={isRecording ? "destructive" : "default"}
        className="flex items-center gap-2"
      >
        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      
      {hasTranscription && (
        <Button 
          variant="outline" 
          onClick={onExportNotes}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Export Notes
        </Button>
      )}
    </div>
  );
};
