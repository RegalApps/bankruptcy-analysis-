
import { Clock, User, MapPin, Shield, FileText, AlertTriangle } from "lucide-react";
import { AuditEntry } from "./TimelineEntry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DetailPanelProps {
  entry: AuditEntry | null;
}

export const DetailPanel = ({ entry }: DetailPanelProps) => {
  if (!entry) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Audit Entry Selected</h3>
          <p className="text-muted-foreground">
            Select an entry from the timeline to view its details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full overflow-y-auto p-1">
      {/* Header with document info */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">{entry.documentName}</h2>
          <div className="flex items-center mt-1">
            <Badge variant="outline" className="mr-2">{entry.documentType}</Badge>
            <span className="text-sm text-muted-foreground">
              {entry.timestamp.toLocaleString(undefined, { 
                dateStyle: 'medium', 
                timeStyle: 'medium' 
              })}
            </span>
          </div>
        </div>
        {entry.actionType === 'risk_assessment' && (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Risk Assessment
          </Badge>
        )}
      </div>
      
      {/* User information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <User className="h-4 w-4 mr-2" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={entry.user.avatar} />
              <AvatarFallback>{entry.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{entry.user.name}</div>
              <div className="text-sm text-muted-foreground">{entry.user.role}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <Shield className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <span>IP: {entry.user.ip}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <span>{entry.user.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Action Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Action Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Timestamp (UTC)</div>
              <div className="font-mono text-xs">{entry.timestamp.toISOString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Action Description</div>
              <div>{entry.details}</div>
            </div>
            
            {/* Display additional metadata if available */}
            {entry.metadata && Object.keys(entry.metadata).length > 0 && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Additional Information</div>
                <pre className="bg-accent/10 p-3 rounded-md text-xs overflow-x-auto">
                  {JSON.stringify(entry.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Compliance Information - only show for certain actions */}
      {(entry.actionType === 'edit' || entry.actionType === 'delete' || entry.actionType === 'risk_assessment') && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Compliance Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Data Integrity Verified</div>
                  <div className="text-xs text-muted-foreground">All changes are cryptographically secured</div>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Regulatory Compliance</div>
                  <div className="text-xs text-muted-foreground">Meets OSB and BIA requirements</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
