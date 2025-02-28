
import { Card, CardContent } from "@/components/ui/card";

interface LoadingStateProps {
  clientName: string;
}

export const LoadingState = ({ clientName }: LoadingStateProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center items-center h-24">
            <p>Loading financial data for {clientName}...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
