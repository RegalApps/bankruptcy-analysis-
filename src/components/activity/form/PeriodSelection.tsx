
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PeriodSelectionProps {
  selectedPeriod: 'current' | 'previous';
  handlePeriodChange: (value: 'current' | 'previous') => void;
}

export const PeriodSelection = ({ selectedPeriod, handlePeriodChange }: PeriodSelectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Period</CardTitle>
        <CardDescription>Choose which month you want to record data for</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          defaultValue="current" 
          value={selectedPeriod}
          onValueChange={(value) => handlePeriodChange(value as 'current' | 'previous')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="current" id="current" />
            <Label htmlFor="current">Current Month</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="previous" id="previous" />
            <Label htmlFor="previous">Previous Month</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
