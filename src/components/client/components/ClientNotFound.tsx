
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientNotFoundProps {
  onBack: () => void;
}

export const ClientNotFound = ({ onBack }: ClientNotFoundProps) => {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <CardTitle>Client Not Found</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          The client information could not be found or might have been removed.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onBack}>Go Back</Button>
      </CardFooter>
    </Card>
  );
};
