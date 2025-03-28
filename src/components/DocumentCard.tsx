
import { File, MoreVertical, Clock } from 'lucide-react';
import { cn } from "@/lib/utils";

interface DocumentCardProps {
  title: string;
  type: string;
  date: string;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
  onOpen?: () => void;
}

export const DocumentCard = ({ title, type, date, className, selected, onClick, onOpen }: DocumentCardProps) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative p-4 rounded-lg border bg-card transition-all duration-200 cursor-pointer",
        "hover:shadow-lg hover:scale-[1.02]",
        selected && "ring-2 ring-primary",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-md bg-primary/10">
            <File className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground">{type}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {onOpen && (
            <button 
              className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-primary hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
            >
              Open
            </button>
          )}
          <button 
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              // Handle menu click
            }}
          >
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs text-muted-foreground">
        <Clock className="h-3 w-3 mr-1" />
        <span>{date}</span>
      </div>
    </div>
  );
};
