
import React from "react";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ViewerNotFoundState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="py-12 text-center flex flex-col items-center justify-center h-full gap-4">
      <div className="rounded-full bg-muted p-6">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium">Document Not Found</h3>
      <p className="text-muted-foreground mt-2 max-w-md mx-auto">
        The requested document could not be found or has been deleted.
        You can return to the documents page to view available documents.
      </p>
      <Button 
        onClick={() => navigate('/documents')}
        className="mt-4"
      >
        Browse Documents
      </Button>
    </div>
  );
};
