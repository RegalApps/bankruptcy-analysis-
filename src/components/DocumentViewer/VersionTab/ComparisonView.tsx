
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { VersionComparisonProps } from "./types";

export const ComparisonView: React.FC<VersionComparisonProps> = ({
  currentVersion,
  previousVersion,
}) => {
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
        <ScrollArea className="h-[600px]">
          <iframe
            src={previousVersion.storage_path}
            className="w-full h-full"
            title={`Version ${previousVersion.version_number}`}
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
        <ScrollArea className="h-[600px]">
          <iframe
            src={currentVersion.storage_path}
            className="w-full h-full"
            title={`Version ${currentVersion.version_number}`}
          />
        </ScrollArea>
      </Card>
    </div>
  );
};
