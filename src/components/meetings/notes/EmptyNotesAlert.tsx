
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const EmptyNotesAlert = () => {
  return (
    <Alert className="bg-muted/50">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>No active transcription</AlertTitle>
      <AlertDescription>
        Start recording your meeting to generate transcriptions, summaries, and action items automatically.
      </AlertDescription>
    </Alert>
  );
};
