
import { Document } from "../../types";

interface ActivityTabProps {
  document: Document;
}

export const ActivityTab: React.FC<ActivityTabProps> = ({ document }) => {
  return (
    <div className="space-y-4">
      <div className="text-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
            U
          </div>
          <div>
            <p className="font-medium">User opened this document</p>
            <p className="text-xs text-muted-foreground">Today at {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
            S
          </div>
          <div>
            <p className="font-medium">System updated document metadata</p>
            <p className="text-xs text-muted-foreground">{new Date(document.updated_at).toLocaleDateString()} at {new Date(document.updated_at).toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
