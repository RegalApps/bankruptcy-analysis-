
import { format } from "date-fns";
import { Globe, User, Clock, Shield, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AuditEntry } from "./types";
import { getActionIcon, getActionColor } from "./utils";
import { ChangeHighlight } from "./ChangeHighlight";
import { AuditComplianceInfo } from "./AuditComplianceInfo";

interface AuditDetailPanelProps {
  selectedEntry: AuditEntry | null;
}

export const AuditDetailPanel = ({ selectedEntry }: AuditDetailPanelProps) => {
  if (!selectedEntry) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center">
        <div>
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-medium">No Event Selected</h3>
          <p className="text-muted-foreground mt-1">
            Select an event from the timeline to view details
          </p>
        </div>
      </div>
    );
  }

  const ActionIcon = getActionIcon(selectedEntry.action);
  const actionColor = getActionColor(selectedEntry.action);

  return (
    <div className="p-4">
      <div className="flex gap-3 items-start mb-4">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-${actionColor}-100 text-${actionColor}-700`}>
          <ActionIcon className="h-5 w-5" />
        </div>
        <div>
          <div className="font-medium">{selectedEntry.action.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</div>
          <div className="text-sm text-muted-foreground">
            {format(new Date(selectedEntry.timestamp), "MMMM d, yyyy 'at' h:mm:ss.SSS a")}
          </div>
        </div>
      </div>

      {selectedEntry.critical && (
        <Card className="bg-destructive/10 mb-4">
          <CardContent className="p-3">
            <div className="flex gap-2 items-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium">Critical Action</span>
            </div>
            <p className="text-xs mt-1">This action requires special attention and has been flagged for compliance review.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {/* User Information */}
        <div>
          <h3 className="text-sm font-medium flex items-center mb-2">
            <User className="h-4 w-4 mr-1" /> User Information
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex gap-2 items-center col-span-2">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                {selectedEntry.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div>{selectedEntry.user.name}</div>
                <div className="text-xs text-muted-foreground">{selectedEntry.user.role}</div>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">IP Address</div>
              <div>{selectedEntry.user.ipAddress}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Location</div>
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {selectedEntry.user.location}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Document Information */}
        <div>
          <h3 className="text-sm font-medium flex items-center mb-2">
            <FileText className="h-4 w-4 mr-1" /> Document Information
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Document Name</div>
              <div>{selectedEntry.document.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-muted-foreground">Type</div>
                <div>{selectedEntry.document.type}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Version</div>
                <div>{selectedEntry.document.version}</div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Changes */}
        {selectedEntry.changes && (
          <>
            <div>
              <h3 className="text-sm font-medium flex items-center mb-2">
                <Clock className="h-4 w-4 mr-1" /> Changes Made
              </h3>
              <ChangeHighlight changes={selectedEntry.changes} />
            </div>
            <Separator />
          </>
        )}

        {/* Compliance Information */}
        <AuditComplianceInfo entry={selectedEntry} />
      </div>
    </div>
  );
};
