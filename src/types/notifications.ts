
export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent"
}

export enum NotificationCategory {
  SYSTEM = "system",
  DOCUMENT = "document",
  MEETING = "meeting",
  TASK = "task",
  CLIENT = "client",
  SECURITY = "security",
  FORM = "form",
  DEADLINE = "deadline",
  OTHER = "other"
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string; // ISO date string
  read: boolean;
  priority: NotificationPriority;
  action_url?: string;
  icon?: string;
  metadata?: Record<string, any>;
  category?: NotificationCategory;
}

export interface CategoryConfig {
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationFilters {
  read?: boolean;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  dateFrom?: Date;
  dateTo?: Date;
}
