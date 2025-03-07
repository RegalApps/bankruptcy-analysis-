
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus } from "lucide-react";

interface ClientFilterSectionProps {
  onAddClient: () => void;
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filter: string) => void;
}

export const ClientFilterSection = ({ 
  onAddClient, 
  onSearch, 
  onFilterChange 
}: ClientFilterSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold">Clients</h2>
      
      <div className="flex items-center space-x-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        
        <Select onValueChange={onFilterChange} defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="high-engagement">High Engagement</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={onAddClient}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </Button>
      </div>
    </div>
  );
};
