
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchFilterProps {
  onSearchChange: (search: string) => void;
  placeholder?: string;
}

export const SearchFilter = ({ onSearchChange, placeholder = "Search documents or folders..." }: SearchFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearchChange("");
  };

  return (
    <div className="relative">
      <div className="absolute left-2.5 top-2.5 text-gray-400">
        <Search className="h-4 w-4" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearchChange}
        className="pl-9 pr-8 h-10"
      />
      {searchQuery && (
        <button 
          onClick={clearSearch}
          className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
