import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Upload, Trash2, Eye, Edit, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

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

export const TimelineEntry = ({ entry, isSelected = false, onSelect, dense = false }: TimelineEntryProps & { dense?: boolean }) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    onSelect(entry);
    setExpanded((e) => !e);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-2 group cursor-pointer py-2 px-3 border-l-4 transition-all",
        isSelected ? "border-primary bg-primary/5" : "border-transparent hover:bg-accent/40",
        dense && "py-1 px-1"
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
    >
      <div className={cn(
        "flex flex-col items-center mr-2 w-6",
        isSelected && "text-primary"
      )}>
        <span className={cn(
          "rounded-full border-2 box-content border-border bg-white transition-colors w-4 h-4 flex items-center justify-center shadow",
          isSelected ? "border-primary bg-primary/90" : "bg-accent"
        )}>{actionIcons[entry.actionType]}</span>
        <div className="flex-1 w-px min-h-[12px] bg-muted/40 mx-auto" />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-baseline justify-between pr-2">
          <div className="font-medium truncate text-sm">{entry.documentName}</div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDistanceToNow(entry.timestamp, { addSuffix: true })}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <Badge variant="outline" className="text-xs capitalize">{entry.actionType.replace("_", "")}</Badge>
          <span className="text-[11px] text-muted-foreground">{entry.user.name}</span>
          {entry.details && <span className="text-[11px] text-muted-foreground ml-2 truncate">{entry.details}</span>}
        </div>
        {expanded && (
          <div className="ml-1 mt-1 border-l-2 border-primary/30 pl-4 animate-fade-in">
            <div className="text-xs text-muted-foreground">{entry.details}</div>
          </div>
        )}
      </div>
      <button
        className="ml-auto"
        tabIndex={-1}
        aria-label={expanded ? "Hide details" : "Show details"}
        onClick={e => {e.stopPropagation(); setExpanded((v) => !v)}}
      >
        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>
    </div>
  );
};
