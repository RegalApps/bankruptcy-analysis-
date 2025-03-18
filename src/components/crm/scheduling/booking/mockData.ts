
import { BookingRequest } from "./types";

// Sample booking request data - in a real app this would come from a database
export const SAMPLE_BOOKING_REQUESTS: BookingRequest[] = [
  {
    id: "br-001",
    clientName: "Michael Johnson",
    clientEmail: "michael.johnson@example.com",
    caseType: "Consumer Proposal",
    requestDate: "2023-06-15T10:30:00Z",
    status: "pending",
    preferredDates: ["2023-06-20", "2023-06-22", "2023-06-24"],
    caseNumber: "CP-2023-078",
    urgency: "medium"
  },
  {
    id: "br-002",
    clientName: "Jennifer Williams",
    clientEmail: "j.williams@example.com",
    caseType: "Bankruptcy",
    requestDate: "2023-06-14T14:45:00Z",
    status: "confirmed",
    preferredDates: ["2023-06-19"],
    caseNumber: "BK-2023-142",
    urgency: "high",
    confirmedSlot: {
      date: "2023-06-19",
      time: "10:00 AM",
      trustee: "John Smith"
    }
  },
  {
    id: "br-003",
    clientName: "Robert Davis",
    clientEmail: "robert.d@example.com",
    caseType: "Financial Assessment",
    requestDate: "2023-06-13T09:15:00Z",
    status: "pending",
    preferredDates: ["2023-06-21", "2023-06-23"],
    urgency: "low"
  }
];
