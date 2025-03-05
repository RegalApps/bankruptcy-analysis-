
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExcelPreviewErrorProps {
  error: string;
  publicUrl: string;
  onRetry: () => void;
}

export const ExcelPreviewError: React.FC<ExcelPreviewErrorProps> = ({ 
  error, 
  publicUrl, 
  onRetry 
}) => {
  return (
    <Alert className="mb-4">
      <AlertDescription className="flex flex-col gap-4">
        <p>{error}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try Again
          </Button>
          <Button variant="default" size="sm" asChild>
            <a 
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Original Excel File
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
