
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VersionList } from "./VersionList";
import { ComparisonView } from "./ComparisonView";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { DocumentVersion } from "./types";

interface VersionTabProps {
  documentId: string;
}

export const VersionTab: React.FC<VersionTabProps> = ({ documentId }) => {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVersions = async () => {
    try {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('version_number', { ascending: false });

      if (error) throw error;

      setVersions(data);
      if (data.length > 0) {
        setSelectedVersion(data.find(v => v.is_current) || data[0]);
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load document versions"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();

    const channel = supabase
      .channel(`versions_${documentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_versions',
          filter: `document_id=eq.${documentId}`
        },
        () => fetchVersions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No versions available</p>
      </div>
    );
  }

  const previousVersion = selectedVersion 
    ? versions.find(v => v.version_number === selectedVersion.version_number - 1)
    : undefined;

  return (
    <Tabs defaultValue="history" className="w-full">
      <TabsList>
        <TabsTrigger value="history">Version History</TabsTrigger>
        <TabsTrigger value="compare">Compare</TabsTrigger>
      </TabsList>
      <TabsContent value="history">
        <VersionList
          versions={versions}
          currentVersionId={selectedVersion?.id || ''}
          onVersionSelect={setSelectedVersion}
        />
      </TabsContent>
      <TabsContent value="compare">
        {selectedVersion && (
          <ComparisonView
            currentVersion={selectedVersion}
            previousVersion={previousVersion}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};
