
import { FileUpload } from "@/components/FileUpload";
import { Header } from "./Header";
import { SearchBar } from "./SearchBar";
import { DocumentList } from "./DocumentList";
import { DocumentUploadButton } from "./DocumentUploadButton";
import { useDocuments } from "./hooks/useDocuments";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, File, Folder, Grid, List, Users } from "lucide-react";
import { DocumentNode } from "./types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DocumentManagementProps {
  onDocumentSelect: (id: string) => void;
}

export const DocumentManagement: React.FC<DocumentManagementProps> = ({ onDocumentSelect }) => {
  const { documents, treeData, isLoading, searchQuery, setSearchQuery } = useDocuments();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGridView, setIsGridView] = useState(true);

  const renderTreeNode = (node: DocumentNode) => {
    const hasChildren = node.children && node.children.length > 0;
    const [isExpanded, setIsExpanded] = useState(true);

    return (
      <div key={node.id} className="space-y-1">
        <div 
          className={cn(
            "group flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer",
            "transition-colors duration-200"
          )}
          onClick={() => hasChildren ? setIsExpanded(!isExpanded) : onDocumentSelect(node.id)}
        >
          {hasChildren ? (
            <ChevronRight 
              className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-90"
              )} 
            />
          ) : (
            <div className="w-4" />
          )}
          
          {node.type === 'client' ? (
            <Users className="h-4 w-4" />
          ) : node.type === 'category' ? (
            <Folder className="h-4 w-4" />
          ) : (
            <File className="h-4 w-4" />
          )}
          
          <span className={cn(
            "truncate",
            !isSidebarCollapsed && "transition-opacity duration-200",
            isSidebarCollapsed && "opacity-0 w-0"
          )}>
            {node.title}
          </span>

          {isSidebarCollapsed && (
            <Tooltip>
              <TooltipTrigger>
                <span className="sr-only">{node.title}</span>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{node.title}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4 border-l pl-2 space-y-1">
            {node.children.map(child => renderTreeNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className={cn(
          "border-r bg-background transition-all duration-300 ease-in-out relative",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}>
          {/* Sidebar Header */}
          <div className="p-4 border-b flex items-center justify-between">
            {!isSidebarCollapsed && (
              <h2 className="font-semibold">Documents</h2>
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

          {/* Search Bar (only visible when sidebar is expanded) */}
          {!isSidebarCollapsed && (
            <div className="p-4">
              <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          )}

          {/* Document Tree */}
          <div className="overflow-y-auto h-full p-4">
            {treeData.map(node => renderTreeNode(node))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
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
              </div>
              <DocumentUploadButton />
            </div>

            {/* Document List */}
            {isLoading ? (
              <div className={cn(
                "grid gap-4",
                isGridView ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i}
                    className="h-[120px] rounded-lg border bg-card animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <DocumentList 
                documents={documents}
                searchQuery={searchQuery}
                onDocumentSelect={onDocumentSelect}
                viewMode={isGridView ? "grid" : "list"}
              />
            )}
          </div>

          {/* Upload Panel */}
          <div className="fixed bottom-6 right-6">
            <div className="rounded-lg border bg-card p-4 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
              <FileUpload />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
