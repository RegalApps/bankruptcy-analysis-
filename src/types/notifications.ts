
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
  type: string; // Added to match database schema
}

export interface DatabaseNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  created_at: string;
  read: boolean;
  user_id: string;
  priority?: string;
  action_url?: string;
  icon?: string;
  metadata?: Record<string, any>;
  type: string; // Added to match database schema
}

export interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}
