
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmartSchedulingCalendar } from "@/components/crm/SmartSchedulingCalendar";
import { SchedulingAnalytics } from "@/components/crm/scheduling/SchedulingAnalytics";
import { ClientBookingPortal } from "@/components/crm/scheduling/ClientBookingPortal";

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
          <ClientBookingPortal />
        </TabsContent>
        
        <TabsContent value="analytics">
          <SchedulingAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
