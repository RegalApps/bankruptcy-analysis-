
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState as BaseLoadingState } from "@/components/DocumentViewer/LoadingState";

interface LoadingStateProps {
  clientName: string;
}

export const LoadingState = ({ clientName }: LoadingStateProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-8">
          <BaseLoadingState 
            size="medium" 
            message={`Loading financial data for ${clientName}...`} 
            className="h-24"
          />
        </CardContent>
      </Card>
    </div>
  );
};
