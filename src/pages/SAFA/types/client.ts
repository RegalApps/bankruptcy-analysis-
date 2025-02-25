
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  engagement_score: number;
  last_interaction?: Date;
  created_at: Date;
  metadata: Record<string, any>;
}

export interface ClientInteraction {
  id: string;
  client_id: string;
  type: string;
  content: string;
  sentiment_score?: number;
  created_at: Date;
  metadata: Record<string, any>;
}

export interface ClientTask {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  due_date?: Date;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  created_by: string;
}
