
import { StaffAvailabilityItem } from "../StaffAvailability";

// Staff availability data
export const staffAvailability: StaffAvailabilityItem[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Licensed Insolvency Trustee",
    avatar: "/placeholder.svg",
    color: "bg-blue-500",
    schedule: [
      {
        day: "Monday",
        busy: ["9:00 - 10:30", "2:00 - 3:30"]
      },
      {
        day: "Tuesday",
        busy: ["11:00 - 12:30"]
      },
      {
        day: "Wednesday",
        busy: []
      },
      {
        day: "Thursday",
        busy: ["3:00 - 4:30"]
      },
      {
        day: "Friday",
        busy: ["9:00 - 10:30", "1:00 - 2:30"]
      }
    ]
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Financial Counselor",
    avatar: "/placeholder.svg",
    color: "bg-green-500",
    schedule: [
      {
        day: "Monday",
        busy: ["11:00 - 1:00"]
      },
      {
        day: "Tuesday",
        busy: ["9:00 - 11:30", "2:00 - 3:30"]
      },
      {
        day: "Wednesday",
        busy: ["10:00 - 11:30"]
      },
      {
        day: "Thursday",
        busy: []
      },
      {
        day: "Friday",
        busy: ["2:00 - 4:30"]
      }
    ]
  },
  {
    id: "3",
    name: "Robert Johnson",
    role: "Bankruptcy Specialist",
    avatar: "/placeholder.svg",
    color: "bg-purple-500",
    schedule: [
      {
        day: "Monday",
        busy: ["9:00 - 11:00", "3:00 - 4:30"]
      },
      {
        day: "Tuesday",
        busy: []
      },
      {
        day: "Wednesday",
        busy: ["1:00 - 3:30"]
      },
      {
        day: "Thursday",
        busy: ["10:00 - 11:30", "2:00 - 3:30"]
      },
      {
        day: "Friday",
        busy: ["9:00 - 10:30"]
      }
    ]
  },
  {
    id: "4",
    name: "Sarah Williams",
    role: "Client Intake Specialist",
    avatar: "/placeholder.svg",
    color: "bg-teal-500",
    schedule: [
      {
        day: "Monday",
        busy: []
      },
      {
        day: "Tuesday",
        busy: ["10:00 - 11:30"]
      },
      {
        day: "Wednesday",
        busy: ["9:00 - 10:30", "2:00 - 3:30"]
      },
      {
        day: "Thursday",
        busy: ["1:00 - 2:30"]
      },
      {
        day: "Friday",
        busy: ["11:00 - 12:30", "3:00 - 4:30"]
      }
    ]
  }
];
