
import { LucideIcon } from "lucide-react";

export type NotificationCategory = 
  | 'file_activity'
  | 'client_update'
  | 'system_alert'
  | 'task_complete'
  | 'security'
  | 'task'
  | 'subscription'
  | 'reminder';

export interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export interface Notification {
  id: string;
  title: string;
  description?: string;
  message?: string; // For backwards compatibility
  type: string;
  created_at?: string; // For backwards compatibility
  createdAt?: string;
  read: boolean;
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
  action_url?: string; // For backwards compatibility
  icon?: string;
  metadata?: Record<string, any>;
  category?: NotificationCategory;
}
