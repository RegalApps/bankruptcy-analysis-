
import { Appointment } from "./AppointmentsList";

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
export const staffAvailability = [
  {
    id: "1",
    name: "John Doe",
    title: "Licensed Insolvency Trustee",
    status: "available",
    nextAvailable: "Today, 2:00 PM",
    avatar: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Jane Smith",
    title: "Financial Counselor",
    status: "busy",
    nextAvailable: "Tomorrow, 9:30 AM",
    avatar: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Robert Johnson",
    title: "Bankruptcy Specialist",
    status: "away",
    nextAvailable: "Monday, 11:00 AM",
    avatar: "/placeholder.svg"
  },
  {
    id: "4",
    name: "Sarah Williams",
    title: "Client Intake Specialist",
    status: "available",
    nextAvailable: "Today, 3:30 PM",
    avatar: "/placeholder.svg"
  }
];

// AI suggestions
export const aiSuggestions = [
  {
    id: "1",
    type: "scheduling",
    title: "Client rescheduling risk",
    description: "John Smith has rescheduled 3 times in the past. Consider calling to confirm today's appointment.",
    priority: "high",
    action: "Call Client"
  },
  {
    id: "2",
    type: "document",
    title: "Missing documentation",
    description: "Michael Williams hasn't submitted his tax returns. Request before tomorrow's meeting.",
    priority: "medium",
    action: "Send Reminder"
  },
  {
    id: "3",
    type: "optimization",
    title: "Schedule optimization",
    description: "You have 3 clients in the same area on Thursday. Consider grouping appointments for efficiency.",
    priority: "low",
    action: "View Details"
  },
  {
    id: "4",
    type: "booking",
    title: "Low booking rate",
    description: "Your afternoon slots are underutilized. Consider opening these for self-booking.",
    priority: "medium",
    action: "Update Settings"
  }
];
