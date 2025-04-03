
import { AISuggestion } from "../AIRecommendations";

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
