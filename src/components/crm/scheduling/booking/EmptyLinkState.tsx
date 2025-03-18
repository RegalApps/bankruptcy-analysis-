
import { Users } from "lucide-react";

export const EmptyLinkState = () => {
  return (
    <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center h-full">
      <Users className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Client Self-Booking</h3>
      <p className="text-sm text-center text-muted-foreground mb-4">
        Generate a unique booking link for your client. The system will automatically recommend appointment slots based on case priority and trustee availability.
      </p>
      <div className="text-xs text-muted-foreground">
        Enter client details on the left to begin
      </div>
    </div>
  );
};
