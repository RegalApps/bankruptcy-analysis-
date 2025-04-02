
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  availability: 'available' | 'busy' | 'away' | 'vacation';
}

interface StaffAvailabilityProps {
  staffList: StaffMember[];
}

export const StaffAvailability: React.FC<StaffAvailabilityProps> = ({ staffList }) => {
  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">Available</Badge>;
      case 'busy':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-200">Busy</Badge>;
      case 'away':
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-200">Away</Badge>;
      case 'vacation':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-200">Vacation</Badge>;
      default:
        return null;
    }
  };

  const getAvatarFallback = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-3">
      {staffList.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No staff members available
        </div>
      ) : (
        staffList.map((staff) => (
          <div
            key={staff.id}
            className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={staff.avatar} alt={staff.name} />
                <AvatarFallback>{getAvatarFallback(staff.name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{staff.name}</div>
                <div className="text-xs text-muted-foreground">{staff.role}</div>
              </div>
            </div>
            {getAvailabilityBadge(staff.availability)}
          </div>
        ))
      )}
    </div>
  );
};
