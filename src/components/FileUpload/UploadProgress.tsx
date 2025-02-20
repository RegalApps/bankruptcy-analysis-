
import { Progress } from "@/components/ui/progress";
import { Loader2 } from 'lucide-react';

interface UploadProgressProps {
  message: string;
  progress: number;
  onCancel: () => void;
}

export const UploadProgress = ({ message, progress, onCancel }: UploadProgressProps) => {
  return (
    <div className="space-y-4 rounded-lg border-2 border-dashed p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          <p className="text-sm font-medium text-gray-600">{message}</p>
        </div>
        <button
          onClick={onCancel}
          className="text-sm text-destructive hover:text-destructive/90"
        >
          Cancel
        </button>
      </div>
      <div className="space-y-2">
        <Progress value={progress} className="h-2 w-full" />
        <p className="text-xs text-gray-500 text-right">{Math.round(progress)}%</p>
      </div>
    </div>
  );
};
