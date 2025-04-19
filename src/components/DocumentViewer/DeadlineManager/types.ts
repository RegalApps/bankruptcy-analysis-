
import { DocumentDetails, Deadline } from '../types';

export interface DeadlineManagerProps {
  document: DocumentDetails;
  onDeadlineUpdated: () => void;
}

export interface AddDeadlineFormProps {
  onAdd: (deadline: Deadline) => Promise<void>;
  onCancel: () => void;
}

export interface DeadlineListProps {
  deadlines: Deadline[];
  onRemove: (index: number) => Promise<void>;
}

export interface DeadlineItemProps {
  deadline: Deadline;
  onRemove: () => Promise<void>;
}
