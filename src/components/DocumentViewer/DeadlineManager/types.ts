
import { Deadline } from '../types';

export interface DeadlineManagerProps {
  documentId: string;
  deadlines?: Deadline[];
  isLoading?: boolean;
  onDeadlineUpdated?: () => void;
}

export interface DeadlineListProps {
  deadlines: Deadline[];
  onRemove: (id: string) => void;
  onStatusChange: (id: string, status: 'pending' | 'completed' | 'overdue') => void;
  onEdit: (deadline: Deadline) => void;
  onDelete: (id: string) => void;
}

export interface AddDeadlineFormProps {
  onSubmit: (newDeadline: Omit<Deadline, 'id' | 'created_at'>) => Promise<void>;
  onCancel: () => void;
}

export interface EditDeadlineFormProps {
  deadline: Deadline;
  onUpdate: (updatedDeadline: Deadline) => Promise<void>;
  onCancel: () => void;
}

export interface DeadlineItemProps {
  deadline: Deadline;
  onRemove: (id: string) => void;
  onStatusChange: (id: string, status: 'pending' | 'completed' | 'overdue') => void;
  onEdit: (deadline: Deadline) => void;
  onDelete: (id: string) => void;
}
