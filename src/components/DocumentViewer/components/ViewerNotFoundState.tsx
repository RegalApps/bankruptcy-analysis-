
import { FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ViewerNotFoundState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <FileX className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-bold mb-2">Document Not Found</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        The document you're looking for doesn't exist or you don't have access to it.
      </p>
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Button 
          onClick={() => navigate('/documents')}
        >
          Browse Documents
        </Button>
      </div>
    </div>
  );
};
