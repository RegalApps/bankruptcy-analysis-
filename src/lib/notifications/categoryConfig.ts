
import { NotificationCategory, CategoryConfig } from "@/types/notifications";

export const notificationCategories: Record<NotificationCategory, CategoryConfig> = {
  [NotificationCategory.SYSTEM]: {
    name: "System",
    icon: "settings",
    color: "blue",
    description: "System-wide updates and maintenance notifications"
  },
  [NotificationCategory.DOCUMENT]: {
    name: "Documents",
    icon: "file",
    color: "green",
    description: "Document uploads, processing, and sharing"
  },
  [NotificationCategory.MEETING]: {
    name: "Meetings",
    icon: "calendar",
    color: "purple",
    description: "Meeting reminders and updates"
  },
  [NotificationCategory.TASK]: {
    name: "Tasks",
    icon: "check-square",
    color: "amber",
    description: "Tasks assigned to you or completed by others"
  },
  [NotificationCategory.CLIENT]: {
    name: "Clients",
    icon: "users",
    color: "indigo",
    description: "Client updates and interactions"
  },
  [NotificationCategory.SECURITY]: {
    name: "Security",
    icon: "shield",
    color: "red",
    description: "Security alerts and login notifications"
  },
  [NotificationCategory.FORM]: {
    name: "Forms",
    icon: "clipboard",
    color: "cyan",
    description: "Form submissions and updates"
  },
  [NotificationCategory.DEADLINE]: {
    name: "Deadlines",
    icon: "clock",
    color: "orange",
    description: "Upcoming and missed deadlines"
  },
  [NotificationCategory.OTHER]: {
    name: "Other",
    icon: "bell",
    color: "gray",
    description: "Miscellaneous notifications"
  }
};
