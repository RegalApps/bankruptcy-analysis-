
import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Upload, Trash2, Eye, Edit, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

// Define action types and their properties
const actionIcons = {
  upload: <Upload className="h-4 w-4" />,
  view: <Eye className="h-4 w-4" />,
  edit: <Edit className="h-4 w-4" />,
  delete: <Trash2 className="h-4 w-4" />,
  risk_assessment: <AlertTriangle className="h-4 w-4" />,
};

const actionColors = {
  upload: "bg-green-100 text-green-600 border-green-200",
  view: "bg-blue-100 text-blue-600 border-blue-200",
  edit: "bg-amber-100 text-amber-600 border-amber-200",
  delete: "bg-red-100 text-red-600 border-red-200",
  risk_assessment: "bg-purple-100 text-purple-600 border-purple-200",
};

export interface AuditEntry {
  id: string;
  timestamp: Date;
  user: {
    name: string;
    role: string;
    avatar?: string;
    ip: string;
    location: string;
  };
  actionType: keyof typeof actionIcons;
  documentName: string;
  documentType: string;
  details: string;
  metadata?: Record<string, any>;
}

interface TimelineEntryProps {
  entry: AuditEntry;
  isSelected?: boolean;
  onSelect: (entry: AuditEntry) => void;
}

export const TimelineEntry = ({ entry, isSelected = false, onSelect }: TimelineEntryProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  
  const handleSelect = () => {
    onSelect(entry);
  };
  
  return (
    <div 
      className={cn(
        "border rounded-lg mb-3 transition-all shadow-sm",
        isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-gray-300 hover:bg-accent/5",
        expanded && "shadow"
      )}
      onClick={handleSelect}
    >
      <div className={`flex items-center p-3 cursor-pointer ${expanded ? 'border-b' : ''}`}>
        <button 
          onClick={toggleExpand}
          className="mr-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label={expanded ? "Collapse details" : "Expand details"}
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        
        <div className={`flex items-center justify-center h-9 w-9 rounded-full mr-3 ${actionColors[entry.actionType]}`}>
          {actionIcons[entry.actionType]}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <span className="font-medium truncate">{entry.documentName}</span>
            <Badge variant="outline" className="ml-2 text-xs">{entry.documentType}</Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
          </div>
        </div>
        
        <div className="flex items-center ml-4">
          <Avatar className="h-7 w-7 mr-2 border">
            <AvatarImage src={entry.user.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {entry.user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm hidden sm:block">{entry.user.name}</div>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 bg-accent/5 text-sm rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs uppercase font-semibold text-muted-foreground">User Details</div>
              <div className="grid grid-cols-[100px_1fr] gap-1">
                <span className="text-muted-foreground">Role:</span> 
                <span>{entry.user.role}</span>
                
                <span className="text-muted-foreground">IP Address:</span> 
                <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">{entry.user.ip}</span>
                
                <span className="text-muted-foreground">Location:</span> 
                <span>{entry.user.location}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs uppercase font-semibold text-muted-foreground">Action Details</div>
              <div className="grid grid-cols-[100px_1fr] gap-1">
                <span className="text-muted-foreground">Time:</span>
                <span title={entry.timestamp.toISOString()}>
                  {entry.timestamp.toLocaleString()}
                </span>
                
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="outline" className={cn("capitalize w-fit", actionColors[entry.actionType])}>
                  {entry.actionType.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs uppercase font-semibold text-muted-foreground mb-2">Details</div>
            <div className="p-2 bg-muted rounded-md">{entry.details}</div>
          </div>
        </div>
      )}
    </div>
  );
};
