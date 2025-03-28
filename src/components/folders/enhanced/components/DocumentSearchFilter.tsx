
import { useState } from "react";
import { Search, Building, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clients?: { id: string; name: string }[];
  onClientSelect?: (clientId: string) => void;
}

export const DocumentSearchFilter = ({
  searchQuery,
  setSearchQuery,
  clients = [],
  onClientSelect
}: DocumentSearchFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-3 border-b space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search folders & documents..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {clients && clients.length > 0 && (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Building className="mr-2 h-4 w-4" />
              <span className="flex-1 text-left">Select Client</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            {clients.map((client) => (
              <DropdownMenuItem
                key={client.id}
                onClick={() => {
                  if (onClientSelect) {
                    onClientSelect(client.id);
                  }
                  setIsOpen(false);
                }}
              >
                {client.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
