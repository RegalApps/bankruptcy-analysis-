
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface SuccessScreenProps {
  onClose: () => void;
}

export const SuccessScreen = ({ onClose }: SuccessScreenProps) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6 flex flex-col items-center justify-center text-center py-10">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
        <p className="text-muted-foreground mb-6">
          Your feedback has been submitted successfully and will help us improve our services.
        </p>
        <Button onClick={onClose}>Close</Button>
      </CardContent>
    </Card>
  );
};
