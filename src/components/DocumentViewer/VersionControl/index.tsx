
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { VersionHistory } from './VersionHistory';
import { ComparisonView } from './ComparisonView';
import { supabase } from '@/lib/supabase';
import type { DocumentVersion } from './types';

interface VersionControlProps {
  documentId: string;
}

export const VersionControl: React.FC<VersionControlProps> = ({ documentId }) => {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<DocumentVersion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const { data: versionsData, error } = await supabase
          .from('document_versions')
          .select('*')
          .eq('document_id', documentId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const processedVersions = versionsData.map((version, index) => {
          if (index === versionsData.length - 1) {
            return version;
          }

          const nextVersion = versionsData[index + 1];
          const changes = compareVersions(version.content, nextVersion.content);
          return { ...version, changes };
        });

        setVersions(processedVersions);
        if (processedVersions.length > 0) {
          setCurrentVersion(processedVersions[0]);
        }
      } catch (error) {
        console.error('Error fetching versions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [documentId]);

  const compareVersions = (currentContent: string, previousContent: string) => {
    const currentLines = currentContent.split('\n');
    const previousLines = previousContent.split('\n');
    
    const added = currentLines.filter(line => !previousLines.includes(line));
    const removed = previousLines.filter(line => !currentLines.includes(line));
    const modified = currentLines.filter(line => 
      !added.includes(line) && 
      !removed.includes(line) && 
      line !== previousLines[currentLines.indexOf(line)]
    );

    return {
      added,
      removed,
      modified
    };
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </Card>
    );
  }

  const previousVersion = versions[versions.indexOf(currentVersion!) + 1];

  return (
    <div className="space-y-4">
      <ComparisonView
        currentVersion={currentVersion!}
        previousVersion={previousVersion}
      />
      <VersionHistory
        versions={versions}
        currentVersionId={currentVersion?.id!}
        onVersionSelect={setCurrentVersion}
      />
    </div>
  );
};
