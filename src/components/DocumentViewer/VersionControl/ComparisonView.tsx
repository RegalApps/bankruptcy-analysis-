
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { VersionComparisonProps } from './types';

export const ComparisonView: React.FC<VersionComparisonProps> = ({
  currentVersion,
  previousVersion
}) => {
  if (!previousVersion) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground text-sm">This is the first version</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Changes from previous version</h3>
        <span className="text-xs text-muted-foreground">
          {new Date(previousVersion.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <ScrollArea className="h-[200px]">
        {currentVersion.changes && (
          <div className="space-y-2">
            {currentVersion.changes.added.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-green-600">Added</h4>
                <ul className="text-sm space-y-1">
                  {currentVersion.changes.added.map((item, i) => (
                    <li key={i} className="text-green-600">+ {item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {currentVersion.changes.removed.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-600">Removed</h4>
                <ul className="text-sm space-y-1">
                  {currentVersion.changes.removed.map((item, i) => (
                    <li key={i} className="text-red-600">- {item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {currentVersion.changes.modified.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-blue-600">Modified</h4>
                <ul className="text-sm space-y-1">
                  {currentVersion.changes.modified.map((item, i) => (
                    <li key={i} className="text-blue-600">~ {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {currentVersion.changes && 
       (currentVersion.changes.added.length > 0 || 
        currentVersion.changes.removed.length > 0 || 
        currentVersion.changes.modified.length > 0) && (
        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-md">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <p className="text-sm text-yellow-600">
            Important changes detected that may affect compliance
          </p>
        </div>
      )}
    </Card>
  );
};
