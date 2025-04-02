
import { Button } from "@/components/ui/button";
import { 
  CalendarIcon,
  Clock3,
  BellRing
} from "lucide-react";

export const QuickActions = () => {
  return (
    <div className="flex flex-col gap-2">
      <Button className="w-full justify-start gap-2" size="sm">
        <CalendarIcon className="h-4 w-4" />
        Schedule a New Meeting
      </Button>
      <Button variant="outline" className="w-full justify-start gap-2" size="sm">
        <Clock3 className="h-4 w-4" />
        Find Earliest Available Slot
      </Button>
      <Button variant="outline" className="w-full justify-start gap-2" size="sm">
        <BellRing className="h-4 w-4" />
        Send Appointment Reminders
      </Button>
    </div>
  );
};
