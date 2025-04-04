
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
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  type: 'document' | 'meeting' | 'task' | 'system' | 'message' | string;
  metadata?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  // Additional fields needed by NotificationBell.tsx
  message?: string;
  created_at?: string;
  action_url?: string;
  icon?: string;
  category?: NotificationCategory;
}
