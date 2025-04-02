
interface ClientBookingPortalProps {
  clientId?: string;
  clientName?: string;
}

export const ClientBookingPortal = ({ clientId, clientName }: ClientBookingPortalProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Client Self-Booking Portal</h2>
      <p className="text-sm text-muted-foreground">
        {clientName ? `Configure booking options for ${clientName}` : "Configure global client booking options"}
      </p>
      
      <div className="h-[400px] border rounded-lg bg-background/50 flex items-center justify-center">
        <p className="text-muted-foreground">Client booking settings will be displayed here</p>
      </div>
    </div>
  );
};
