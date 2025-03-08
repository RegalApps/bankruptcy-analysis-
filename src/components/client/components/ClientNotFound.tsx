
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, User } from "lucide-react";

interface ClientNotFoundProps {
  onBack: () => void;
}

export const ClientNotFound = ({ onBack }: ClientNotFoundProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex flex-col items-center justify-center py-12">
          <User className="h-16 w-16 text-muted-foreground mb-4" />
          <CardTitle className="text-xl mb-2">Client Not Found</CardTitle>
          <p className="text-muted-foreground">The client information could not be retrieved.</p>
        </div>
      </CardHeader>
    </Card>
  );
};
