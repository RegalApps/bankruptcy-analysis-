
import { Appointment } from "./AppointmentsList";
import { AISuggestion } from "./AIRecommendations";
import { StaffAvailabilityItem } from "./StaffAvailability";

// Mock appointment data
export const appointments: Appointment[] = [
  {
    id: "1",
    clientName: "John Smith",
    type: "Initial Consultation",
    time: "09:00",
    date: new Date(new Date().setDate(new Date().getDate())), // Today
    priority: "high",
    status: "confirmed",
    documents: "incomplete",
    alert: "Missing financial statements",
    color: "bg-red-500"
  },
  {
    id: "2",
    clientName: "Sarah Johnson",
    type: "Follow-up Meeting",
    time: "11:30",
    date: new Date(new Date().setDate(new Date().getDate())), // Today
    priority: "medium",
    status: "confirmed",
    documents: "complete",
    alert: null,
    color: "bg-amber-500"
  },
  {
    id: "3",
    clientName: "Michael Williams",
    type: "Document Review",
    time: "14:00",
    date: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    priority: "normal",
    status: "confirmed",
    documents: "incomplete",
    alert: "Need to review Form 47",
    color: "bg-green-500"
  },
  {
    id: "4",
    clientName: "Jessica Brown",
    type: "Initial Consultation",
    time: "10:00",
    date: new Date(new Date().setDate(new Date().getDate() + 2)), // Day after tomorrow
    priority: "high",
    status: "pending",
    documents: "pending",
    alert: null,
    color: "bg-red-500"
  },
  {
    id: "5",
    clientName: "David Miller",
    type: "Financial Assessment",
    time: "13:30",
    date: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
    priority: "medium",
    status: "confirmed",
    documents: "complete",
    alert: null,
    color: "bg-amber-500"
  },
  {
    id: "6",
    clientName: "Jennifer Wilson",
    type: "Budget Planning",
    time: "15:45",
    date: new Date(new Date().setDate(new Date().getDate() + 4)), // 4 days from now
    priority: "normal",
    status: "self-booked",
    documents: "incomplete",
    alert: "Missing proof of income",
    color: "bg-blue-500"
  },
  {
    id: "7",
    clientName: "Robert Taylor",
    type: "Initial Consultation",
    time: "09:30",
    date: new Date(new Date().setDate(new Date().getDate() + 7)), // Week from now
    priority: "high",
    status: "confirmed",
    documents: "pending",
    alert: null,
    color: "bg-red-500"
  },
  {
    id: "8",
    clientName: "Amanda Anderson",
    type: "Debt Settlement Review",
    time: "14:15",
    date: new Date(new Date().setDate(new Date().getDate() + 7)), // Week from now
    priority: "medium",
    status: "confirmed",
    documents: "complete",
    alert: null,
    color: "bg-amber-500"
  },
  {
    id: "9",
    clientName: "Mark Thomas",
    type: "Creditor Negotiation",
    time: "11:00",
    date: new Date(new Date().setDate(new Date().getDate() + 14)), // Two weeks from now
    priority: "high",
    status: "pending",
    documents: "incomplete",
    alert: "Need creditor statements",
    color: "bg-red-500"
  },
  {
    id: "10",
    clientName: "Lisa Martinez",
    type: "Follow-up Meeting",
    time: "16:00",
    date: new Date(new Date().setDate(new Date().getDate() + 14)), // Two weeks from now
    priority: "normal",
    status: "self-booked",
    documents: "complete",
    alert: null,
    color: "bg-blue-500"
  }
];

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

// AI suggestions
export const aiSuggestions: AISuggestion[] = [
  {
    id: "1",
    message: "John Smith has rescheduled 3 times in the past. Consider calling to confirm today's appointment.",
    priority: "high",
    actionable: true
  },
  {
    id: "2",
    message: "Michael Williams hasn't submitted his tax returns. Request before tomorrow's meeting.",
    priority: "medium",
    actionable: true
  },
  {
    id: "3",
    message: "You have 3 clients in the same area on Thursday. Consider grouping appointments for efficiency.",
    priority: "low",
    actionable: true
  },
  {
    id: "4",
    message: "Your afternoon slots are underutilized. Consider opening these for self-booking.",
    priority: "medium",
    actionable: true
  }
];
