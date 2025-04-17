
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface HistoryPanelProps {
  documentId: string;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ documentId }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium">Document Activity</h3>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p className="text-center py-6">No activity history available for this document yet.</p>
          </div>
          
          {/* Placeholder for future implementation of document activity timeline */}
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground text-center">
              Activity tracking will show document views, comments, and modifications.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
