import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AuditEntry } from "./TimelineEntry";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertCircle, Clock, File, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailPanelProps {
  entry: AuditEntry | null;
  compact?: boolean;
}

export const DetailPanel = ({ entry, compact = false }: DetailPanelProps) => {
  if (!entry) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
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
    <div className={compact ? "h-full py-6 space-y-4 max-w-2xl mx-auto overflow-y-auto" : "h-full overflow-y-auto space-y-6"}>
      <section className="sticky top-0 z-10 bg-card/90 py-3 border-b mb-2">
        <div className="flex flex-row items-center gap-4">
          <Badge variant="outline" className={cn("capitalize text-xs px-2", getBadgeStyle())}>
            {entry.actionType.replace('_', ' ')}
          </Badge>
          <div>
            <span className="font-semibold">{entry.documentName}</span>
            <span className="ml-2 text-xs text-muted-foreground">{entry.documentType}</span>
          </div>
        </div>
        <div className="flex flex-row items-center text-xs text-muted-foreground gap-3 mt-1">
          <span>
            User: <span className="text-foreground">{entry.user.name}</span>
          </span>
          <span>
            Time: <span className="font-mono">{entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <File className="h-4 w-4" /> Document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-sm font-medium">{entry.documentName}</div>
            <div className="text-xs text-muted-foreground">{entry.documentType}</div>
            <div className="mt-2 text-xs">Details: {entry.details}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">{entry.user.name}</div>
            <div className="text-xs text-muted-foreground">{entry.user.role}</div>
            <div className="text-xs mt-2">IP: <span className="bg-muted font-mono rounded px-1">{entry.user.ip}</span></div>
            <div className="text-xs text-muted-foreground">Loc: {entry.user.location}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" /> Timestamp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-muted-foreground">Local</div>
              <div className="font-mono text-sm">{entry.timestamp.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">UTC</div>
              <div className="font-mono text-sm">{entry.timestamp.toUTCString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {entry.metadata && Object.keys(entry.metadata).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Metadata</CardTitle>
            <CardDescription>Technical details</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
              {JSON.stringify(entry.metadata, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {entry.actionType === 'risk_assessment' && entry.metadata?.issues && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Risk Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs">
              Risk score: <span className="font-medium">{entry.metadata.riskScore}</span>
              <br />
              Status: <span className="font-medium capitalize">{entry.metadata.complianceStatus}</span>
            </div>
            {Array.isArray(entry.metadata.issues) && entry.metadata.issues.length > 0 && (
              <div className="mt-2">
                <div className="font-medium text-xs">Issues:</div>
                <ul className="list-disc pl-5 text-xs">
                  {entry.metadata.issues.map((issue: string, index: number) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
