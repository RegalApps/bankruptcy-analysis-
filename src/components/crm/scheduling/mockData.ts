
import { addDays } from "date-fns";
import { Appointment } from "./AppointmentsList";
import { AISuggestion } from "./AIRecommendations";
import { StaffAvailabilityItem } from "./StaffAvailability";
import { format } from "date-fns";

// Mock appointment data
export const appointments: Appointment[] = [
  {
    id: "1",
    clientName: "John Doe",
    type: "Bankruptcy Filing",
    time: "10:00 AM",
    date: addDays(new Date(), 1),
    priority: "high",
    status: "confirmed",
    documents: "incomplete",
    alert: "Court Filing for Form 78 (Deadline in 24 hours)",
    color: "bg-red-500"
  },
  {
    id: "2",
    clientName: "Sarah Johnson",
    type: "Consumer Proposal",
    time: "1:30 PM",
    date: addDays(new Date(), 2),
    priority: "medium",
    status: "confirmed",
    documents: "pending",
    alert: "Missing Tax Returns (AI Sent Reminder)",
    color: "bg-amber-500"
  },
  {
    id: "3",
    clientName: "Michael Brown",
    type: "Document Review",
    time: "9:00 AM",
    date: addDays(new Date(), 3),
    priority: "normal",
    status: "self-booked",
    documents: "complete",
    alert: null,
    color: "bg-blue-500"
  },
  {
    id: "4",
    clientName: "Emily Wilson",
    type: "Initial Consultation",
    time: "11:30 AM",
    date: new Date(),
    priority: "normal",
    status: "confirmed",
    documents: "complete",
    alert: null,
    color: "bg-green-500"
  },
  {
    id: "5",
    clientName: "David Thompson",
    type: "Follow-up Meeting",
    time: "3:00 PM",
    date: new Date(),
    priority: "medium",
    status: "confirmed",
    documents: "incomplete",
    alert: "Missing Form 47",
    color: "bg-amber-500"
  }
];

// Staff availability
export const staffAvailability: StaffAvailabilityItem[] = [
  {
    id: "1",
    name: "John Smith",
    role: "Licensed Insolvency Trustee",
    avatar: "/placeholder.svg",
    color: "bg-blue-500",
    schedule: [
      { day: format(new Date(), "EEE"), busy: ["09:00-10:30", "13:00-14:30"] },
      { day: format(addDays(new Date(), 1), "EEE"), busy: ["11:00-12:00", "15:00-16:30"] },
      { day: format(addDays(new Date(), 2), "EEE"), busy: ["10:00-11:30", "14:00-15:00"] }
    ]
  },
  {
    id: "2",
    name: "Sarah Johnson",
    role: "Financial Advisor",
    avatar: "/placeholder.svg",
    color: "bg-green-500",
    schedule: [
      { day: format(new Date(), "EEE"), busy: ["10:00-11:30", "14:00-15:30"] },
      { day: format(addDays(new Date(), 1), "EEE"), busy: ["09:00-10:00", "13:30-15:00"] },
      { day: format(addDays(new Date(), 2), "EEE"), busy: ["11:00-12:30", "16:00-17:00"] }
    ]
  }
];

// AI suggestions
export const aiSuggestions: AISuggestion[] = [
  {
    id: "1",
    message: "Reschedule John Doe's meeting—his documents are incomplete",
    priority: "high",
    actionable: true
  },
  {
    id: "2",
    message: "Your next available break is at 12:30 PM. Consider rescheduling the 11:45 AM client call to avoid fatigue",
    priority: "medium",
    actionable: true
  },
  {
    id: "3",
    message: "45% of clients rescheduled their first meeting. Consider improving intake scheduling prompts",
    priority: "low",
    actionable: false
  }
];
