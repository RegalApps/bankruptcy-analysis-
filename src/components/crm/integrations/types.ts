
export type IntegrationStatus = 'active' | 'inactive' | 'pending';

export interface APIIntegration {
  id: string;
  provider_name: string;
  status: IntegrationStatus;
  api_key: string;
  metadata: Record<string, any>;
  last_sync_at: string | null;
  settings: Record<string, any>;
}

export interface IntegrationProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'communication' | 'compliance' | 'legal' | 'marketing';
  requiredFields: {
    name: string;
    label: string;
    type: 'text' | 'password' | 'select';
    options?: string[];
  }[];
}
