
import React from "react";
import { Button } from "@/components/ui/button";
import { DocumentVersion } from "../types";
import { ExternalLink, HistoryIcon, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface DocumentVersionsProps {
  documentId: string;
  documentVersions?: DocumentVersion[];
  currentDocumentId?: string;
  isLoading?: boolean;
}

export const DocumentVersions: React.FC<DocumentVersionsProps> = ({
  documentId,
  documentVersions = [],
  currentDocumentId = documentId,
  isLoading = false
}) => {
  // Sort versions by created_at, most recent first
  const sortedVersions = [...documentVersions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const handleOpenVersion = (versionId: string) => {
    // Open the version in a new tab or navigate to it
    window.open(`/document/${versionId}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading versions...</p>
      </div>
    );
  }

  if (!documentVersions || documentVersions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <HistoryIcon className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-medium">No Version History</h3>
        <p className="text-sm text-muted-foreground mt-1">
          This document doesn't have any previous versions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center">
        <HistoryIcon className="mr-2 h-5 w-5" />
        Version History
      </h3>

      <div className="space-y-3">
        {sortedVersions.map((version) => (
          <div
            key={version.id}
            className={`p-3 rounded-md border ${
              version.id === currentDocumentId ? "bg-primary/5 border-primary/30" : "bg-card hover:bg-muted/50"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium">
                    {version.version_name || "Version " + version.version_number}
                  </h4>
                  {version.is_current && (
                    <Badge variant="outline" className="ml-2">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(new Date(version.created_at), {
                    addSuffix: true,
                  })}
                </p>
                {version.changes_summary && (
                  <p className="text-sm mt-2">{version.changes_summary}</p>
                )}
              </div>
              {version.id !== currentDocumentId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenVersion(version.id)}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
