
export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low':
      return 'text-green-500';
    case 'medium':
      return 'text-yellow-500';
    case 'high':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const getSeverityBg = (severity: string) => {
  switch (severity) {
    case 'low':
      return 'bg-green-50 dark:bg-green-950/50';
    case 'medium':
      return 'bg-yellow-50 dark:bg-yellow-950/50';
    case 'high':
      return 'bg-red-50 dark:bg-red-950/50';
    default:
      return 'bg-gray-50 dark:bg-gray-950/50';
  }
};

export const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'low':
      return 'CheckCircle';
    case 'medium':
      return 'AlertTriangle';
    case 'high':
      return 'AlertOctagon';
    default:
      return 'Info';
  }
};
