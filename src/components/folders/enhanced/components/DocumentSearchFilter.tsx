
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onFilterChange?: (filter: string | null) => void;
  selectedFilter?: string | null;
  clients?: { id: string; name: string }[];
  onClientSelect?: (clientId: string) => void;
}

export const DocumentSearchFilter = ({
  searchQuery,
  setSearchQuery,
  onFilterChange,
  selectedFilter,
  clients = [],
  onClientSelect
}: DocumentSearchFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <div className="relative flex-grow w-full">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search folders and documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 w-full"
        />
      </div>
      
      {onFilterChange && (
        <Select 
          value={selectedFilter || ''} 
          onValueChange={(value) => onFilterChange(value || null)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All types</SelectItem>
            <SelectItem value="application/pdf">PDF</SelectItem>
            <SelectItem value="image/jpeg">Images</SelectItem>
            <SelectItem value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">Excel</SelectItem>
            <SelectItem value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">Word</SelectItem>
          </SelectContent>
        </Select>
      )}

      {clients.length > 0 && onClientSelect && (
        <Select onValueChange={(value) => onClientSelect(value)}>
          <SelectTrigger className="w-[170px]">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span>Select Client</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {clients.map(client => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
