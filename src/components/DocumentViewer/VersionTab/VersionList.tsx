
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, History } from "lucide-react";

import type { VersionListProps } from "./types";

export const VersionList: React.FC<VersionListProps> = ({
  versions,
  currentVersionId,
  onVersionSelect,
}) => {
  return (
    <ScrollArea className="h-[400px] rounded-md border p-4">
      <div className="space-y-4">
        {versions.map((version) => (
          <div
            key={version.id}
            className={`flex items-start space-x-4 p-3 rounded-lg cursor-pointer transition-colors ${
              version.id === currentVersionId
                ? "bg-primary/10"
                : "hover:bg-muted"
            }`}
            onClick={() => onVersionSelect(version)}
          >
            <div className="flex-shrink-0">
              {version.is_current ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <History className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                Version {version.version_number}
                {version.is_current && " (Current)"}
              </p>
              {version.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {version.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(version.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
