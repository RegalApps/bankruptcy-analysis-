
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Utility functions for severity-based styling and icons
export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-50 border-red-200';
    case 'medium':
      return 'bg-amber-50 border-amber-200';
    case 'low':
      return 'bg-yellow-50 border-yellow-200';
    default:
      return 'bg-muted border-muted-foreground';
  }
};

export const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'high':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'medium':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'low':
      return <Info className="h-4 w-4 text-yellow-500" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

export const getSeverityText = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'text-red-700';
    case 'medium':
      return 'text-amber-700';
    case 'low':
      return 'text-yellow-700';
    default:
      return 'text-muted-foreground';
  }
};
