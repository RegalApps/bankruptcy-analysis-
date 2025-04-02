
interface SmartSchedulingCalendarProps {
  clientId?: string;
  clientName?: string;
}

export const SmartSchedulingCalendar = ({ clientId, clientName }: SmartSchedulingCalendarProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Intelligent Scheduling Calendar</h2>
      <p className="text-sm text-muted-foreground">
        {clientName ? `View and manage appointments for ${clientName}` : "View and manage all appointments"}
      </p>
      
      <div className="h-[400px] border rounded-lg bg-background/50 flex items-center justify-center">
        <p className="text-muted-foreground">Calendar view will be displayed here</p>
      </div>
    </div>
  );
};
