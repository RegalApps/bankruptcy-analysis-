
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmartSchedulingCalendar } from "@/components/crm/SmartSchedulingCalendar";
import { SchedulingAnalytics } from "@/components/crm/scheduling/SchedulingAnalytics";
import { ClientBookingPortal } from "@/components/crm/scheduling/ClientBookingPortal";
import { useSchedulingTabs } from "./hooks/useSchedulingTabs";

interface IntelligentSchedulingProps {
  clientId?: string;
  clientName?: string;
}

export const IntelligentScheduling = ({ clientId, clientName }: IntelligentSchedulingProps = {}) => {
  const { activeTab, setActiveTab } = useSchedulingTabs();

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="client">Client Self-Booking</TabsTrigger>
          <TabsTrigger value="analytics">Scheduling Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <SmartSchedulingCalendar clientId={clientId} clientName={clientName} />
        </TabsContent>
        
        <TabsContent value="client">
          <ClientBookingPortal clientId={clientId} clientName={clientName} />
        </TabsContent>
        
        <TabsContent value="analytics">
          <SchedulingAnalytics clientId={clientId} clientName={clientName} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
