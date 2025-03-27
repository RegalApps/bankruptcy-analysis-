
import { CardFooter } from "@/components/ui/card";

interface RecordingIndicatorProps {
  isRecording: boolean;
}

export const RecordingIndicator = ({ isRecording }: RecordingIndicatorProps) => {
  if (!isRecording) return null;
  
  return (
    <CardFooter className="flex justify-between pt-3">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
        <span className="text-sm text-muted-foreground">Recording in progress</span>
      </div>
    </CardFooter>
  );
};
