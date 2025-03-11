
export type ActionType = 
  | 'upload'
  | 'edit'
  | 'delete'
  | 'download'
  | 'view'
  | 'share'
  | 'risk_assessment'
  | 'task_assignment'
  | 'signature'
  | 'export';

export type ChangeType = 'added' | 'modified' | 'removed';

export interface User {
  id: string;
  name: string;
  role: string;
  ipAddress: string;
  location: string;
  avatarUrl?: string;
}

export interface DocumentInfo {
  id: string;
  name: string;
  type: string;
  version: string;
}

export interface Change {
  field: string;
  type: ChangeType;
  previousValue?: string;
  newValue?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: User;
  action: ActionType;
  document: DocumentInfo;
  changes?: Change[];
  critical: boolean;
  hash: string;
  regulatoryFramework?: string;
  clientId?: string;
  clientName?: string;
}

export interface Client {
  id: string;
  name: string;
}

export interface AuditFilter {
  dateRange?: {
    from: Date;
    to: Date;
  };
  users?: string[];
  actions?: ActionType[];
  critical?: boolean;
  clientId?: string;
  searchTerm?: string;
}
