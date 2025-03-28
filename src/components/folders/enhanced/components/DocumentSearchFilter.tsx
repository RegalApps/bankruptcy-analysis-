
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onFilterChange?: (filter: string | null) => void;
  availableFilters?: string[];
  selectedFilter?: string | null;
}

export const DocumentSearchFilter = ({
  searchQuery,
  setSearchQuery,
  onFilterChange,
  availableFilters = ['PDF', 'Word', 'Excel', 'Image'],
  selectedFilter
}: DocumentSearchFilterProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search documents..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {onFilterChange && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              {selectedFilter ? `Filter: ${selectedFilter}` : 'Filter'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onFilterChange(null)}>
              All Types
            </DropdownMenuItem>
            {availableFilters.map((filter) => (
              <DropdownMenuItem 
                key={filter}
                onClick={() => onFilterChange(filter)}
              >
                {filter}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
