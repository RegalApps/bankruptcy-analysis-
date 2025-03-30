
import { Mic, MicOff, FileText, Save, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotesControlsProps {
  isRecording: boolean;
  toggleRecording: () => void;
  hasTranscription: boolean;
  onExportNotes: () => void;
  onSaveNotes: () => void;
  onPrintNotes: () => void;
  onExportPdf: () => void;
}

export const NotesControls = ({ 
  isRecording, 
  toggleRecording, 
  hasTranscription, 
  onExportNotes,
  onSaveNotes,
  onPrintNotes,
  onExportPdf
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
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onSaveNotes}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Notes
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onPrintNotes}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onExportPdf}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onExportNotes}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export Text
          </Button>
        </div>
      )}
    </div>
  );
};
