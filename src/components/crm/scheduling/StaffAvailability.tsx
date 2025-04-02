
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Staff availability type
export interface StaffAvailabilityItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  schedule: {
    day: string;
    busy: string[];
  }[];
}

interface StaffAvailabilityProps {
  staffList: StaffAvailabilityItem[];
}

export const StaffAvailability = ({ staffList }: StaffAvailabilityProps) => {
  return (
    <div className="space-y-3">
      {staffList.map((staff) => (
        <div key={staff.id} className="border rounded-md p-3">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={staff.avatar} alt={staff.name} />
              <AvatarFallback className={staff.color + " text-white"}>
                {staff.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">{staff.name}</div>
              <div className="text-xs text-gray-500">{staff.role}</div>
            </div>
          </div>
          <div className="space-y-1 mt-2">
            {staff.schedule.map((day, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="font-medium">{day.day}:</span>
                <span className="text-gray-500">
                  {day.busy.length > 0 ? 
                    `Busy: ${day.busy.join(', ')}` : 
                    'Fully Available'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
