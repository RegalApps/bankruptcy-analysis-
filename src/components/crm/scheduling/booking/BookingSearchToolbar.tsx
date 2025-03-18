
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BookingSearchToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const BookingSearchToolbar = ({ 
  searchQuery, 
  setSearchQuery 
}: BookingSearchToolbarProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          type="search" 
          placeholder="Search requests by client name, email or case number" 
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button variant="outline">Filter</Button>
      <Button variant="outline">Sort</Button>
    </div>
  );
};
