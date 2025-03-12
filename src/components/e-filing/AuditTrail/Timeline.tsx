
import { useState } from "react";
import { TimelineEntry, AuditEntry } from "./TimelineEntry";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TimelineProps {
  entries: AuditEntry[];
  onEntrySelect: (entry: AuditEntry) => void;
  selectedEntryId?: string;
}

export const Timeline = ({ entries, onEntrySelect, selectedEntryId }: TimelineProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredEntries = entries.filter(entry => 
    entry.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.details.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="h-full flex flex-col">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search audit entries..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="overflow-y-auto flex-1 pr-2">
        {filteredEntries.length > 0 ? (
          filteredEntries.map(entry => (
            <TimelineEntry
              key={entry.id}
              entry={entry}
              isSelected={entry.id === selectedEntryId}
              onSelect={onEntrySelect}
            />
          ))
        ) : (
          <div className="text-center p-6 text-muted-foreground">
            No audit entries found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};
