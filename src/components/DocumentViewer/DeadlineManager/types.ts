
import { Deadline } from "../types";

export interface DeadlineManagerProps {
  documentId: string;
  deadlines?: Deadline[];
  isLoading?: boolean;
}

export interface AddDeadlineFormProps {
  onSubmit: (deadline: Omit<Deadline, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export interface DeadlineItemProps {
  deadline: Deadline;
  onStatusChange: (id: string, status: Deadline['status']) => void;
  onEdit: (deadline: Deadline) => void;
  onDelete: (id: string) => void;
  onRemove: () => void;  // Added this missing prop
}

export interface DeadlineListProps {
  deadlines: Deadline[];
  onRemove: (id: string) => void;
  onStatusChange: (id: string, status: Deadline['status']) => void;
  onEdit: (deadline: Deadline) => void;
}
