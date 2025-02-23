
import { Button } from "@/components/ui/button";
import { SearchBar } from "../SearchBar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Filter, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  groupedByClient: Record<string, {
    documents: any[];
    lastUpdated: Date | null;
    types: Set<string>;
  }>;
  selectedFolder: string | null;
  setSelectedFolder: (value: string | null) => void;
}

export const Sidebar = ({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  searchQuery,
  setSearchQuery,
  groupedByClient,
  selectedFolder,
  setSelectedFolder
}: SidebarProps) => {
  return (
    <aside className={cn(
      "border-r bg-background transition-all duration-300 ease-in-out relative",
      isSidebarCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b flex items-center justify-between">
        {!isSidebarCollapsed && (
          <h2 className="font-semibold">Folders</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="ml-auto"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="p-4 border-b space-y-4">
        {!isSidebarCollapsed && (
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            {!isSidebarCollapsed && "Filter"}
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto h-full p-4">
        <div className="space-y-2">
          {Object.entries(groupedByClient).map(([clientName, folderData]) => (
            isSidebarCollapsed ? (
              <Tooltip key={clientName}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-full justify-start",
                      selectedFolder === clientName && "bg-accent"
                    )}
                    onClick={() => setSelectedFolder(clientName)}
                  >
                    <Folder className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{clientName}</p>
                  <p className="text-xs text-muted-foreground">
                    {folderData.documents.length} documents
                  </p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                key={clientName}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  selectedFolder === clientName && "bg-accent"
                )}
                onClick={() => setSelectedFolder(clientName)}
              >
                <Folder className="h-4 w-4 mr-2" />
                <span className="truncate">{clientName}</span>
              </Button>
            )
          ))}
        </div>
      </div>
    </aside>
  );
};
