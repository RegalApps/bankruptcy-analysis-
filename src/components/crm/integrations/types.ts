
export type IntegrationStatus = 'active' | 'inactive' | 'pending';

export interface APIIntegration {
  id: string;
  provider_name: string;
  status: IntegrationStatus;
  api_key: string;
  metadata: Record<string, any>;
  last_sync_at: string | null;
  settings: Record<string, any>;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface IntegrationProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'communication' | 'compliance' | 'legal' | 'marketing' | 'document' | 'productivity';
  requiredFields: {
    name: string;
    label: string;
    type: 'text' | 'password' | 'select';
    options?: string[];
  }[];
}

export type IntegrationAction = 
  | 'setup'
  | 'test'
  | 'sync'
  | 'delete'
  | 'update'
  | 'refresh'
  | 'validate';

export interface ProviderOperation {
  provider: string;
  action: IntegrationAction;
  integrationId: string;
  settings?: Record<string, any>;
}
