
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmartSchedulingCalendar } from "@/components/crm/SmartSchedulingCalendar";
import { SchedulingAnalytics } from "@/components/crm/scheduling/SchedulingAnalytics";

export const IntelligentScheduling = () => {
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="client">Client Self-Booking</TabsTrigger>
          <TabsTrigger value="analytics">Scheduling Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <SmartSchedulingCalendar />
        </TabsContent>
        
        <TabsContent value="client">
          <div className="p-6 text-center border rounded-md">
            <h3 className="text-lg font-medium">Client Self-Booking Portal</h3>
            <p className="text-sm text-muted-foreground mt-2">
              This feature is coming soon. It will allow clients to book their own appointments
              with AI-recommended time slots based on case priority and trustee availability.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <SchedulingAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
