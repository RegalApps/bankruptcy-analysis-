
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";

interface UploadProgressProps {
  message: string;
  progress: number;
  onCancel: () => void;
}

export const UploadProgress = ({ message, progress, onCancel }: UploadProgressProps) => {
  return (
    <div className="w-full space-y-4 p-4 border-2 border-dashed rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Progress value={progress} className="w-full" />
      <p className="text-xs text-muted-foreground text-center">{Math.round(progress)}% complete</p>
    </div>
  );
};
