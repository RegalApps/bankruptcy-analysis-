
export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  module?: 'document' | 'legal' | 'help' | 'client';
}
