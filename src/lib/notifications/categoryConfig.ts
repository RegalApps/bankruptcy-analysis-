
import { FileText, Shield, MessageCircle, Timer, Calendar, Upload, Lock, Users, CheckCircle, UserCircle, AlertCircle, Bell } from "lucide-react";
import type { CategoryConfig, NotificationCategory } from "@/types/notifications";

export const categoryConfig: Record<NotificationCategory, CategoryConfig> = {
  file_activity: {
    label: "File Activity",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  client_update: {
    label: "Client Updates",
    icon: UserCircle,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  system_alert: {
    label: "System Alerts",
    icon: AlertCircle,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  task_complete: {
    label: "Completed Tasks",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  security: {
    label: "Security",
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  task: {
    label: "Tasks & Comments",
    icon: MessageCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  subscription: {
    label: "Subscription",
    icon: Timer,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  reminder: {
    label: "Reminders",
    icon: Calendar,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
};

export const getIconForNotification = (category: NotificationCategory, type?: string) => {
  const specificIcons = {
    upload: Upload,
    access: Lock,
    mention: Users,
    completed: CheckCircle,
  };

  if (type && specificIcons[type as keyof typeof specificIcons]) {
    return specificIcons[type as keyof typeof specificIcons];
  }

  return categoryConfig[category].icon;
};
