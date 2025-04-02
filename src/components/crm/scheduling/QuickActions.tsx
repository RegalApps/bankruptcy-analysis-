
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  CalendarPlus, 
  UserPlus, 
  Clock, 
  Users
} from "lucide-react";

export const QuickActions: React.FC = () => {
  const actions = [
    { 
      icon: <CalendarPlus className="h-4 w-4" />, 
      label: "Schedule Meeting" 
    },
    { 
      icon: <UserPlus className="h-4 w-4" />, 
      label: "Add Client" 
    },
    { 
      icon: <Clock className="h-4 w-4" />, 
      label: "Block Time Slot" 
    },
    { 
      icon: <Users className="h-4 w-4" />, 
      label: "Team Availability" 
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          className="justify-start"
          size="sm"
        >
          <span className="mr-2">{action.icon}</span>
          {action.label}
        </Button>
      ))}
    </div>
  );
};
