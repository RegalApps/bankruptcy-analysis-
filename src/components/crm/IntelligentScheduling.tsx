
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useState } from "react";

export const IntelligentScheduling = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Smart Scheduling</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-4">Select Date</h3>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">AI Recommended Slots</h3>
              <div className="space-y-2">
                {["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"].map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    {time}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                These times are intelligently suggested based on your availability
                and client preferences.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
