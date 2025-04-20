import { useState } from "react";
import { TimelineEntry, AuditEntry } from "./TimelineEntry";

interface TimelineProps {
  entries: AuditEntry[];
  onEntrySelect: (entry: AuditEntry) => void;
  selectedEntryId?: string;
  dense?: boolean;
}

export const Timeline = ({ entries, onEntrySelect, selectedEntryId, dense = false }: TimelineProps) => {
  return (
    <div className={dense ? "overflow-y-auto h-full p-2" : "h-full flex flex-col"}>
      {entries.length > 0 ? (
        entries.map(entry => (
          <TimelineEntry
            key={entry.id}
            entry={entry}
            isSelected={entry.id === selectedEntryId}
            onSelect={onEntrySelect}
            dense={dense}
          />
        ))
      ) : (
        <div className="text-center p-6 text-muted-foreground">
          No audit entries found.
        </div>
      )}
    </div>
  );
};
