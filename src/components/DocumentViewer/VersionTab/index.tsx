import React from 'react';
import { DocumentVersion } from '../types';
import { VersionList } from './VersionList';
import { ComparisonView } from './ComparisonView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface VersionTabProps {
  documentId: string;
  versions: DocumentVersion[];
}

export const VersionTab: React.FC<VersionTabProps> = ({ documentId, versions }) => {
  return (
    <div className="h-full">
      {versions.length > 0 ? (
        <div className="space-y-4">
          <VersionList versions={versions} documentId={documentId} />
          {/* Additional version-related functionality can be added here */}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-sm">No version history available</p>
        </div>
      )}
    </div>
  );
};
