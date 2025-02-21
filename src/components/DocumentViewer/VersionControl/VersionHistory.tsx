
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import type { DocumentVersion } from './types';

interface VersionHistoryProps {
  versions: DocumentVersion[];
  currentVersionId: string;
  onVersionSelect: (version: DocumentVersion) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  versions,
  currentVersionId,
  onVersionSelect
}) => {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2 p-2">
        {versions.map((version) => (
          <Button
            key={version.id}
            variant={version.id === currentVersionId ? "secondary" : "ghost"}
            className="w-full justify-start text-left"
            onClick={() => onVersionSelect(version)}
          >
            <Clock className="h-4 w-4 mr-2" />
            <div className="flex-1">
              <div className="text-sm">
                Version from {new Date(version.createdAt).toLocaleDateString()}
              </div>
              {version.changes && (
                <div className="text-xs text-muted-foreground">
                  {version.changes.added.length > 0 && (
                    <span className="text-green-600 mr-2">
                      +{version.changes.added.length}
                    </span>
                  )}
                  {version.changes.removed.length > 0 && (
                    <span className="text-red-600 mr-2">
                      -{version.changes.removed.length}
                    </span>
                  )}
                  {version.changes.modified.length > 0 && (
                    <span className="text-blue-600">
                      ~{version.changes.modified.length}
                    </span>
                  )}
                </div>
              )}
            </div>
            {version.id === currentVersionId && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Current
              </span>
            )}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};
