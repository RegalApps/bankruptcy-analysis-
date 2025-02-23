
import { FileUpload } from "@/components/FileUpload";
import { Header } from "./Header";
import { SearchBar } from "./SearchBar";
import { DocumentList } from "./DocumentList";
import { DocumentUploadButton } from "./DocumentUploadButton";
import { useDocuments } from "./hooks/useDocuments";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ChevronLeft, 
  ChevronRight, 
  File, 
  Folder, 
  Grid, 
  List, 
  Users,
  Filter,
  SlidersHorizontal,
  Plus
} from "lucide-react";
import { DocumentNode } from "./types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DocumentManagementProps {
  onDocumentSelect: (id: string) => void;
}

export const DocumentManagement: React.FC<DocumentManagementProps> = ({ onDocumentSelect }) => {
  const { documents, treeData, isLoading, searchQuery, setSearchQuery } = useDocuments();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // Group documents by client
  const groupedByClient = documents.reduce((acc, doc) => {
    const clientName = doc.metadata?.client_name || 'Uncategorized';
    if (!acc[clientName]) {
      acc[clientName] = {
        documents: [],
        lastUpdated: null as Date | null,
        types: new Set<string>()
      };
    }
    acc[clientName].documents.push(doc);
    acc[clientName].types.add(doc.type || 'Other');
    const updatedAt = new Date(doc.updated_at);
    if (!acc[clientName].lastUpdated || updatedAt > acc[clientName].lastUpdated) {
      acc[clientName].lastUpdated = updatedAt;
    }
    return acc;
  }, {} as Record<string, { 
    documents: typeof documents, 
    lastUpdated: Date | null,
    types: Set<string>
  }>);

  const renderFolderCard = (clientName: string, folderData: {
    documents: typeof documents,
    lastUpdated: Date | null,
    types: Set<string>
  }) => {
    const isSelected = selectedFolder === clientName;

    return (
      <div 
        key={clientName}
        className={cn(
          "p-4 rounded-lg border bg-card cursor-pointer transition-all",
          "hover:shadow-md hover:border-primary/50",
          isSelected && "border-primary shadow-md",
          isGridView ? "h-[200px]" : "h-auto"
        )}
        onClick={() => setSelectedFolder(clientName)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-md",
              isSelected ? "bg-primary/20" : "bg-primary/10"
            )}>
              <Folder className={cn(
                "h-6 w-6",
                isSelected ? "text-primary" : "text-primary/70"
              )} />
            </div>
            <div>
              <h3 className="font-medium">{clientName}</h3>
              <p className="text-sm text-muted-foreground">
                {folderData.documents.length} document{folderData.documents.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="h-4 w-4 mr-2" />
                Share Folder
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete Folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap gap-2">
            {Array.from(folderData.types).map(type => (
              <span 
                key={type}
                className="inline-flex items-center px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs"
              >
                {type}
              </span>
            ))}
          </div>
          {folderData.lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Last updated: {folderData.lastUpdated.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Folder List Sidebar */}
        <aside className={cn(
          "border-r bg-background transition-all duration-300 ease-in-out relative",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}>
          {/* Sidebar Header */}
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

          {/* Search and Filter */}
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

          {/* Folder Tree */}
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

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {selectedFolder || "All Documents"}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsGridView(true)}
                  className={cn(isGridView && "bg-accent")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsGridView(false)}
                  className={cn(!isGridView && "bg-accent")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <DocumentUploadButton />
              </div>
            </div>

            {/* Folder Grid/List */}
            {isLoading ? (
              <div className={cn(
                "grid gap-4",
                isGridView ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i}
                    className="h-[200px] rounded-lg border bg-card animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className={cn(
                "grid gap-4",
                isGridView ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {Object.entries(groupedByClient)
                  .filter(([clientName]) => 
                    !searchQuery || 
                    clientName.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(([clientName, folderData]) => 
                    renderFolderCard(clientName, folderData)
                  )}
              </div>
            )}
          </div>
        </main>

        {/* Upload Panel */}
        <div className="fixed bottom-6 right-6">
          <div className="rounded-lg border bg-card p-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
            <FileUpload />
          </div>
        </div>
      </div>
    </>
  );
};
