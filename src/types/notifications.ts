
import { LucideIcon } from "lucide-react";

export type NotificationCategory = 'file_activity' | 'client_update' | 'system_alert' | 'task_complete' | 'security' | 'task' | 'subscription' | 'reminder';

// UI-side notification with category field
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string; // Required to match database schema
  created_at: string;
  read: boolean;
  priority: string;
  action_url?: string;
  icon?: string;
  metadata: Record<string, any>;
  category: NotificationCategory; // Category for UI organization
}

// Database-side notification structure
export interface DatabaseNotification {
  id: string;
  title: string;
  message: string;
  type: string; // Required to match database schema
  created_at: string;
  read: boolean;
  user_id: string;
  priority?: string;
  action_url?: string;
  icon?: string;
  metadata?: Record<string, any>; // Category is stored here
}

export interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}
