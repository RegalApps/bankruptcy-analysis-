
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AuditEntry } from "./TimelineEntry";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertCircle, Clock, File, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailPanelProps {
  entry: AuditEntry | null;
}

export const DetailPanel = ({ entry }: DetailPanelProps) => {
  if (!entry) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Info className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Select an entry</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Select an audit trail entry from the timeline to view detailed information
        </p>
      </div>
    );
  }
  
  // Determine status badge appearance
  const getBadgeStyle = () => {
    switch (entry.actionType) {
      case "upload":
        return "bg-green-100 text-green-700 border-green-200";
      case "view":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "edit":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "delete":
        return "bg-red-100 text-red-700 border-red-200";
      case "risk_assessment":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 bg-card z-10 pb-3">
        <div className="flex items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold leading-none tracking-tight">Audit Entry Details</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Complete information about the selected activity
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Document Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <File className="h-4 w-4 mr-2" />
              Document Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium">{entry.documentName}</div>
                <div className="text-xs text-muted-foreground mt-1">{entry.documentType}</div>
              </div>
              
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                <div className="text-sm font-medium">Action:</div>
                <div>
                  <Badge variant="outline" className={cn("capitalize", getBadgeStyle())}>
                    {entry.actionType.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="text-sm font-medium">Details:</div>
                <div className="text-sm">{entry.details}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="font-medium">{entry.user.name}</div>
              <div className="text-sm text-muted-foreground">{entry.user.role}</div>
              
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">IP Address</div>
                  <div className="text-sm font-mono bg-muted py-0.5 px-1.5 rounded-sm">
                    {entry.user.ip}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Location</div>
                  <div className="text-sm flex items-center">
                    <MapPin className="h-3 w-3 mr-1" /> {entry.user.location}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timestamp */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Timestamp Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <div className="text-xs text-muted-foreground">Local Time</div>
                <div className="font-medium">{entry.timestamp.toLocaleString()}</div>
              </div>
              <div className="text-sm">
                <div className="text-xs text-muted-foreground">UTC Time</div>
                <div className="font-medium">{entry.timestamp.toUTCString()}</div>
              </div>
              <div className="text-sm">
                <div className="text-xs text-muted-foreground">ISO Format</div>
                <div className="font-mono text-xs bg-muted p-1 rounded mt-1 overflow-x-auto">
                  {entry.timestamp.toISOString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Metadata If Available */}
        {entry.metadata && Object.keys(entry.metadata).length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Additional Metadata</CardTitle>
              <CardDescription>Technical details about this event</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                {JSON.stringify(entry.metadata, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
        
        {/* Risk Assessment Alert (only for risk_assessment type) */}
        {entry.actionType === 'risk_assessment' && entry.metadata?.issues && (
          <Alert variant={entry.metadata.complianceStatus === 'compliant' ? 'default' : 'destructive'}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2">
              Risk score: <span className="font-medium">{entry.metadata.riskScore}</span>
              <br />
              Status: <span className="font-medium capitalize">{entry.metadata.complianceStatus}</span>
              
              {Array.isArray(entry.metadata.issues) && entry.metadata.issues.length > 0 && (
                <div className="mt-2">
                  <div className="font-medium">Issues detected:</div>
                  <ul className="list-disc pl-5 text-sm">
                    {entry.metadata.issues.map((issue: string, index: number) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};
