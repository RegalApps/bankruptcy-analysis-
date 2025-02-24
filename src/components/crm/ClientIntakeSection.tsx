
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoiceCommand } from "lucide-react";

export const ClientIntakeSection = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>New Client Intake</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Start a new client intake process or continue an existing one.
            </p>
            <Button className="gap-2">
              <VoiceCommand className="h-4 w-4" />
              Start Voice Input
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
