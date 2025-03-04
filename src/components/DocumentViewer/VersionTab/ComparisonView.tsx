
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import type { VersionComparisonProps } from "./types";

export const ComparisonView: React.FC<VersionComparisonProps> = ({
  currentVersion,
  previousVersion,
}) => {
  const [isPrevLoaded, setIsPrevLoaded] = useState(false);
  const [isCurrentLoaded, setIsCurrentLoaded] = useState(false);

  useEffect(() => {
    // Reset loading state when versions change
    setIsPrevLoaded(false);
    setIsCurrentLoaded(false);
  }, [currentVersion, previousVersion]);

  if (!previousVersion) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          This is the first version of the document.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <div className="mb-2">
          <h4 className="text-sm font-medium">Previous Version</h4>
          <p className="text-xs text-muted-foreground">
            Version {previousVersion.version_number}
          </p>
        </div>
        <ScrollArea className="h-[600px] relative">
          {!isPrevLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}
          <iframe
            src={previousVersion.storage_path}
            className="w-full h-full"
            title={`Version ${previousVersion.version_number}`}
            onLoad={() => setIsPrevLoaded(true)}
          />
        </ScrollArea>
      </Card>
      <Card className="p-4">
        <div className="mb-2">
          <h4 className="text-sm font-medium">Current Version</h4>
          <p className="text-xs text-muted-foreground">
            Version {currentVersion.version_number}
          </p>
        </div>
        <ScrollArea className="h-[600px] relative">
          {!isCurrentLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}
          <iframe
            src={currentVersion.storage_path}
            className="w-full h-full"
            title={`Version ${currentVersion.version_number}`}
            onLoad={() => setIsCurrentLoaded(true)}
          />
        </ScrollArea>
      </Card>
    </div>
  );
};
