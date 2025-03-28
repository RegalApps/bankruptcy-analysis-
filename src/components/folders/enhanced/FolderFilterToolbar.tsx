
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
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
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search folders and documents..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
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
          {/* Changed empty string to "all" */}
          <SelectItem value="all">All Documents</SelectItem>
          <SelectItem value="client">Client Folders</SelectItem>
          <SelectItem value="form">Forms</SelectItem>
          <SelectItem value="financial">Financial</SelectItem>
          <SelectItem value="uncategorized">Uncategorized</SelectItem>
        </SelectContent>
      </Select>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => {
          setSearchQuery("");
          setFilterCategory(null);
        }}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};
