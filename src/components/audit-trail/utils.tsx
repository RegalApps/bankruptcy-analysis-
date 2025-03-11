
import { 
  Upload, 
  Pencil, 
  Trash, 
  Download, 
  Eye, 
  Share, 
  Shield, 
  CheckSquare,
  Pen, 
  FileOutput,
  LucideIcon
} from "lucide-react";
import { ActionType } from "./types";

export const getActionIcon = (action: ActionType): LucideIcon => {
  switch (action) {
    case 'upload':
      return Upload;
    case 'edit':
      return Pencil;
    case 'delete':
      return Trash;
    case 'download':
      return Download;
    case 'view':
      return Eye;
    case 'share':
      return Share;
    case 'risk_assessment':
      return Shield;
    case 'task_assignment':
      return CheckSquare;
    case 'signature':
      return Pen;
    case 'export':
      return FileOutput;
    default:
      return Eye;
  }
};

export const getActionColor = (action: ActionType): string => {
  switch (action) {
    case 'upload':
      return 'green';
    case 'edit':
      return 'blue';
    case 'delete':
      return 'red';
    case 'download':
      return 'purple';
    case 'view':
      return 'gray';
    case 'share':
      return 'cyan';
    case 'risk_assessment':
      return 'amber';
    case 'task_assignment':
      return 'indigo';
    case 'signature':
      return 'teal';
    case 'export':
      return 'violet';
    default:
      return 'gray';
  }
};
