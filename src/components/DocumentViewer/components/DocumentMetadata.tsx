
import React from "react";
import { CalendarIcon, FileTextIcon, ClockIcon, AlertCircle, CheckCircle } from "lucide-react";
import { formatDistanceToNow, format, isAfter } from "date-fns";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DocumentDetails } from "../types";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DocumentMetadataProps {
  document: DocumentDetails;
}

export const DocumentMetadata: React.FC<DocumentMetadataProps> = ({ document }) => {
  if (!document) return null;

  const formatFileSize = (size?: number): string => {
    if (!size) return "Unknown";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusColor = (status?: string): string => {
    if (!status) return "bg-muted";
    
    switch(status.toLowerCase()) {
      case 'completed':
      case 'approved':
      case 'verified':
        return "bg-green-500";
      case 'in_progress':
      case 'processing':
      case 'pending':
        return "bg-yellow-500";
      case 'reviewing':
        return "bg-blue-500";
      case 'rejected':
      case 'error':
      case 'failed':
        return "bg-red-500";
      default:
        return "bg-muted";
    }
  };
  
  const processingStatus = document.status || "pending";
  
  const getDeadlineStatus = (deadline?: string): React.ReactNode => {
    if (!deadline) return null;
    
    try {
      const deadlineDate = new Date(deadline);
      const isOverdue = isAfter(new Date(), deadlineDate);
      
      return (
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={isOverdue ? "destructive" : "default"} className="flex items-center gap-1">
            {isOverdue ? <AlertCircle className="h-3 w-3" /> : <ClockIcon className="h-3 w-3" />}
            {isOverdue ? "Overdue" : "Upcoming"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {format(deadlineDate, "MMM d, yyyy")}
          </span>
        </div>
      );
    } catch (e) {
      return null;
    }
  };

  return (
    <Card className="shadow-none border-0">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-base">Document Details</CardTitle>
        <CardDescription>
          Information about the document and its status
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium">Processing Status</h4>
            <div className="mt-1 space-y-2">
              <div className="flex justify-between text-xs">
                <span>{processingStatus.charAt(0).toUpperCase() + processingStatus.slice(1).replace(/_/g, ' ')}</span>
              </div>
              <Progress 
                value={processingStatus === "completed" ? 100 : 
                       processingStatus === "failed" ? 100 : 
                       processingStatus === "processing" ? 50 : 25} 
                className={cn(
                  "h-1.5",
                  processingStatus === "completed" ? "bg-green-500" : 
                  processingStatus === "failed" ? "bg-red-500" : 
                  "bg-blue-500"
                )}
              />
            </div>
          </div>
          
          <Separator />
          
          {document.deadline && (
            <>
              <div>
                <h4 className="text-sm font-medium">Submission Deadline</h4>
                <div className="mt-1 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{format(new Date(document.deadline), "MMMM d, yyyy")}</span>
                </div>
                {getDeadlineStatus(document.deadline)}
              </div>
              
              <Separator />
            </>
          )}

          {document.deadlines && document.deadlines.length > 0 && (
            <div>
              <h4 className="text-sm font-medium">Upcoming Deadlines</h4>
              <div className="mt-1 space-y-2">
                {document.deadlines.slice(0, 2).map((deadline, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {deadline.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <ClockIcon className="h-4 w-4 text-amber-500" />
                      )}
                      <span>{deadline.title}</span>
                    </div>
                    <Badge 
                      variant={deadline.status === 'overdue' ? "destructive" : "outline"}
                      className="text-xs"
                    >
                      {format(new Date(deadline.due_date), "MMM d")}
                    </Badge>
                  </div>
                ))}
                {document.deadlines.length > 2 && (
                  <div className="text-xs text-muted-foreground text-right">
                    +{document.deadlines.length - 2} more deadlines
                  </div>
                )}
              </div>
              
              <Separator className="my-3" />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <h4 className="text-xs text-muted-foreground">Created</h4>
              <p className="text-sm">
                {document.created_at ? formatDistanceToNow(new Date(document.created_at), { addSuffix: true }) : 'Unknown'}
              </p>
            </div>
            
            <div>
              <h4 className="text-xs text-muted-foreground">Modified</h4>
              <p className="text-sm">
                {document.updated_at ? formatDistanceToNow(new Date(document.updated_at), { addSuffix: true }) : 'Unknown'}
              </p>
            </div>
            
            <div>
              <h4 className="text-xs text-muted-foreground">File Type</h4>
              <p className="text-sm">
                {document.type || 'Unknown'}
              </p>
            </div>
            
            <div>
              <h4 className="text-xs text-muted-foreground">Size</h4>
              <p className="text-sm">
                {document.size ? formatFileSize(document.size) : document.file_size || 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
