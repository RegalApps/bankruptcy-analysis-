
export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  module: 'document' | 'legal' | 'help' | 'client';
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
  last_interaction?: string;
  case_type?: 'bankruptcy' | 'consumer_proposal' | 'corporate_insolvency';
  risk_level?: 'low' | 'medium' | 'high';
}

export interface Conversation {
  id: string;
  client_id: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
  status: 'active' | 'closed' | 'archived';
}

export interface ConversationHistoryItem {
  id: string;
  client_id: string;
  client_name: string;
  last_message: string;
  timestamp: string;
  unread: boolean;
}

export interface VoiceTranscription {
  id: string;
  client_id: string;
  transcript: string;
  duration: number;
  call_date: string;
  summary: string;
  action_items: string[];
}
