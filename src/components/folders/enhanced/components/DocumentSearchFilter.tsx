
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface DocumentSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onFilterChange: (filter: string | null) => void;
  selectedFilter: string | null;
}

export const DocumentSearchFilter = ({
  searchQuery,
  setSearchQuery,
  onFilterChange,
  selectedFilter
}: DocumentSearchFilterProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-grow">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search folders and documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <Select value={selectedFilter || ''} onValueChange={(value) => onFilterChange(value || null)}>
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
    </div>
  );
};
