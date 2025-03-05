
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ExcelErrorDisplayProps {
  error: string;
  onRefresh: () => void;
  publicUrl: string;
}

export const ExcelErrorDisplay = ({ error, onRefresh, publicUrl }: ExcelErrorDisplayProps) => {
  return (
    <Alert className="mb-4">
      <AlertDescription className="flex flex-col gap-4">
        <p>{error}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm" onClick={onRefresh}>
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
