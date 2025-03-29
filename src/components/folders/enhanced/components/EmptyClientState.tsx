
import React from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface EmptyClientStateProps {
  onUploadDocument?: () => void;
}

export const EmptyClientState = ({ onUploadDocument }: EmptyClientStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 h-[300px] text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <Users className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Documents for this Client</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        This client doesn't have any documents yet. Upload a document to get started.
      </p>
      {onUploadDocument && (
        <Button onClick={onUploadDocument}>
          Upload Document
        </Button>
      )}
    </div>
  );
};
