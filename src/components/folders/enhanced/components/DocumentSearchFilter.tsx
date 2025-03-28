
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export interface DocumentSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clients?: { id: string; name: string }[];
  onClientSelect?: (clientId: string) => void;
}

export const DocumentSearchFilter: React.FC<DocumentSearchFilterProps> = ({
  searchQuery,
  setSearchQuery,
  clients = [],
  onClientSelect
}) => {
  return (
    <div className="pb-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search documents..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {clients && clients.length > 0 && onClientSelect && (
        <>
          <Separator className="my-4" />
          <div className="mb-2">
            <h4 className="text-sm font-medium mb-2">Clients</h4>
            <ScrollArea className="h-[120px]">
              <div className="space-y-1">
                {clients.map((client) => (
                  <Button
                    key={client.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => onClientSelect(client.id)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {client.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
};
