
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User2 } from "lucide-react";

export const NoClientSelected = () => {
  return (
    <Card className="py-12">
      <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
        <User2 className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">No Client Selected</h3>
        <p className="text-muted-foreground max-w-md">
          Please select a client above to begin entering financial data.
        </p>
      </CardContent>
    </Card>
  );
};
