
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
