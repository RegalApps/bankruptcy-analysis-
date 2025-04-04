
import { Bell, FileText, AlertTriangle, CalendarClock, ShieldAlert, CheckCircle, CreditCard, Clock } from "lucide-react";
import type { CategoryConfig, NotificationCategory } from "@/types/notifications";

export const categoryConfig: Record<NotificationCategory, CategoryConfig> = {
  file_activity: {
    label: "File Activity",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-100"
  },
  client_update: {
    label: "Client Updates",
    icon: Bell,
    color: "text-purple-500",
    bgColor: "bg-purple-100"
  },
  system_alert: {
    label: "System Alerts",
    icon: AlertTriangle,
    color: "text-orange-500",
    bgColor: "bg-orange-100"
  },
  task_complete: {
    label: "Completed Tasks",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-100"
  },
  security: {
    label: "Security",
    icon: ShieldAlert,
    color: "text-red-500",
    bgColor: "bg-red-100"
  },
  task: {
    label: "Tasks",
    icon: CalendarClock,
    color: "text-amber-500",
    bgColor: "bg-amber-100"
  },
  subscription: {
    label: "Subscription",
    icon: CreditCard,
    color: "text-indigo-500",
    bgColor: "bg-indigo-100"
  },
  reminder: {
    label: "Reminders",
    icon: Clock,
    color: "text-teal-500",
    bgColor: "bg-teal-100"
  }
};
