
import { MessageSquare } from 'lucide-react';

export const CommentsHeader = () => {
  return (
    <div className="flex items-center space-x-2">
      <MessageSquare className="h-5 w-5 text-muted-foreground" />
      <h3 className="font-medium">Comments & Collaboration</h3>
    </div>
  );
};
