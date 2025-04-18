
import React from 'react';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentStatus } from '@/utils/documents/types';

interface ClientDocumentTreeProps {
  client: {
    id: string;
    name: string;
    documents: any[];
  };
  onDocumentSelect: (documentId: string) => void;
  selectedDocumentId?: string;
}

export const ClientDocumentTree: React.FC<ClientDocumentTreeProps> = ({
  client,
  onDocumentSelect,
  selectedDocumentId
}) => {
  const [expanded, setExpanded] = React.useState(true);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="mb-4">
      <div
        className="flex items-center gap-1 cursor-pointer py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1"
        onClick={toggleExpand}
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <Folder className="h-4 w-4 shrink-0 text-blue-500" />
        <span className="text-sm font-medium">{client.name}</span>
        <span className="text-xs text-muted-foreground ml-1">
          ({client.documents.length})
        </span>
      </div>
      
      {expanded && (
        <div className="ml-6 mt-1 space-y-1">
          {client.documents.map((doc) => (
            <div
              key={doc.id}
              className={cn(
                "flex items-center gap-2 py-1 px-2 rounded text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
                selectedDocumentId === doc.id && "bg-blue-100 dark:bg-blue-900/30"
              )}
              onClick={() => onDocumentSelect(doc.id)}
            >
              <File className="h-4 w-4 shrink-0 text-gray-500" />
              <span className="truncate">{doc.name}</span>
              <StatusBadge status={doc.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface StatusBadgeProps {
  status?: DocumentStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (!status) return null;

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
      case 'complete':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'processing':
      case 'uploading':
      case 'analyzing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'pending':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
      case 'complete':
        return 'Complete';
      case 'processing':
        return 'Processing';
      case 'uploading':
        return 'Uploading';
      case 'analyzing':
        return 'Analyzing';
      case 'error':
        return 'Error';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  return (
    <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusColor()}`}>
      {getStatusText()}
    </span>
  );
};
