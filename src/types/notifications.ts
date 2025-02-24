
import { LucideIcon } from "lucide-react";

export type NotificationCategory = 'file_activity' | 'security' | 'task' | 'subscription' | 'reminder';

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  created_at: string;
  read: boolean;
  priority: string;
  action_url?: string;
  icon?: string;
  metadata: Record<string, any>;
}

export interface DatabaseNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  read: boolean;
  user_id: string;
  category?: NotificationCategory;
  priority?: string;
  action_url?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

export interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}
