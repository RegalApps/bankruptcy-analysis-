
import React, { useState } from 'react';
import { DocumentVersion } from './types';
import { VersionList } from './VersionList';
import { ComparisonView } from './ComparisonView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface VersionTabProps {
  documentId: string;
  versions: DocumentVersion[];
}

export const VersionTab: React.FC<VersionTabProps> = ({ documentId, versions }) => {
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(
    versions.length > 0 ? versions[0] : null
  );

  return (
    <div className="h-full">
      {versions.length > 0 ? (
        <div className="space-y-4">
          <VersionList 
            versions={versions} 
            currentVersionId={selectedVersion?.id || ''} 
            onVersionSelect={(version) => setSelectedVersion(version)}
          />
          {selectedVersion && (
            <ComparisonView 
              currentVersion={selectedVersion}
              previousVersion={versions.find(v => 
                v.version_number === selectedVersion.version_number - 1
              )}
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-sm">No version history available</p>
        </div>
      )}
    </div>
  );
};
