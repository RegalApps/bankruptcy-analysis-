
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
}
