
import { AlertCircle } from 'lucide-react';

interface CommentsErrorDisplayProps {
  error: string;
}

export const CommentsErrorDisplay = ({ error }: CommentsErrorDisplayProps) => {
  return (
    <div className="p-4 bg-destructive/10 rounded-md">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <p>Error loading comments: {error}</p>
      </div>
    </div>
  );
};
