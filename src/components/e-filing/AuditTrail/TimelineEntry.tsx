
import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Upload, Trash2, Eye, Edit, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

// Define action types and their properties
const actionIcons = {
  upload: <Upload className="h-4 w-4" />,
  view: <Eye className="h-4 w-4" />,
  edit: <Edit className="h-4 w-4" />,
  delete: <Trash2 className="h-4 w-4" />,
  risk_assessment: <AlertTriangle className="h-4 w-4" />,
};

const actionColors = {
  upload: "bg-green-100 text-green-600",
  view: "bg-blue-100 text-blue-600",
  edit: "bg-yellow-100 text-yellow-600",
  delete: "bg-red-100 text-red-600",
  risk_assessment: "bg-purple-100 text-purple-600",
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
      className={`border rounded-md mb-2 transition-all ${isSelected ? 'border-primary ring-1 ring-primary' : 'hover:border-gray-400'}`}
      onClick={handleSelect}
    >
      <div className={`flex items-center p-3 cursor-pointer ${expanded ? 'border-b' : ''}`}>
        <button 
          onClick={toggleExpand}
          className="mr-2 p-1 rounded-full hover:bg-gray-100"
          aria-label={expanded ? "Collapse details" : "Expand details"}
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        
        <div className={`flex items-center justify-center h-8 w-8 rounded-full mr-3 ${actionColors[entry.actionType]}`}>
          {actionIcons[entry.actionType]}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <span className="font-medium truncate">{entry.documentName}</span>
            <Badge variant="outline" className="ml-2">{entry.documentType}</Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
          </div>
        </div>
        
        <div className="flex items-center ml-4">
          <Avatar className="h-7 w-7 mr-2">
            <AvatarImage src={entry.user.avatar} />
            <AvatarFallback>{entry.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-sm">{entry.user.name}</div>
        </div>
      </div>
      
      {expanded && (
        <div className="p-3 bg-accent/5 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">User Details</div>
              <div><span className="font-medium">Role:</span> {entry.user.role}</div>
              <div><span className="font-medium">IP Address:</span> {entry.user.ip}</div>
              <div><span className="font-medium">Location:</span> {entry.user.location}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Action Details</div>
              <div><span className="font-medium">Timestamp:</span> {entry.timestamp.toISOString()}</div>
              <div><span className="font-medium">Action Type:</span> {entry.actionType.replace('_', ' ')}</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs text-muted-foreground mb-1">Details</div>
            <p>{entry.details}</p>
          </div>
        </div>
      )}
    </div>
  );
};
