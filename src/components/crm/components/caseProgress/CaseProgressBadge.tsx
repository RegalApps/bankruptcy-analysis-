
import { AlertCircle, Clock, ListChecks, Package, PackageCheck } from "lucide-react";

interface CaseProgressBadgeProps {
  progress: number;
}

export const CaseProgressBadge = ({ progress }: CaseProgressBadgeProps) => {
  const getProgressStatusColor = (progress: number) => {
    if (progress < 25) return 'text-slate-500 bg-slate-100';
    if (progress < 50) return 'text-blue-500 bg-blue-100';
    if (progress < 75) return 'text-amber-500 bg-amber-100';
    if (progress < 100) return 'text-purple-500 bg-purple-100';
    return 'text-green-500 bg-green-100';
  };
  
  const getProgressIcon = (progress: number) => {
    if (progress < 25) return <Clock className="h-4 w-4 mr-1" />;
    if (progress < 50) return <ListChecks className="h-4 w-4 mr-1" />;
    if (progress < 75) return <Package className="h-4 w-4 mr-1" />;
    if (progress < 100) return <AlertCircle className="h-4 w-4 mr-1" />;
    return <PackageCheck className="h-4 w-4 mr-1" />;
  };

  const getProgressStatus = (progress: number) => {
    if (progress < 25) return 'initial';
    if (progress < 50) return 'early';
    if (progress < 75) return 'mid';
    if (progress < 100) return 'late';
    return 'complete';
  };

  const progressStatus = getProgressStatus(progress);
  const progressStatusDisplay = {
    'initial': 'Initial Stage',
    'early': 'Early Processing',
    'mid': 'Mid Processing',
    'late': 'Final Review',
    'complete': 'Complete'
  }[progressStatus];

  return (
    <div className={`flex items-center px-2 py-0.5 rounded text-xs font-medium ${getProgressStatusColor(progress)}`}>
      {getProgressIcon(progress)}
      {progressStatusDisplay}
    </div>
  );
};
