
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FolderFilterToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
}

export const FolderFilterToolbar = ({
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
}: FolderFilterToolbarProps) => {
  return (
    <div className="flex space-x-2 mb-4">
      <Select
        value={filterCategory || "all"}
        onValueChange={(value) => setFilterCategory(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-40">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Documents</SelectItem>
          <SelectItem value="financial">Financial</SelectItem>
          <SelectItem value="uncategorized">Uncategorized</SelectItem>
        </SelectContent>
      </Select>
      
      <Button 
        variant="outline" 
        onClick={() => {
          setSearchQuery("");
          setFilterCategory(null);
        }}
      >
        Clear Filters
      </Button>
    </div>
  );
};
