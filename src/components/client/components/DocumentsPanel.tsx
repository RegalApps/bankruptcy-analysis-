
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, Grid2X2, List, Filter, ArrowDownUp, Search } from "lucide-react";
import { DocumentList } from "./DocumentList";
import { ActivityHistoryTab } from "./ActivityHistoryTab";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Document } from "../types";

interface DocumentsPanelProps {
  documents: Document[];
  activeTab: string;
  setActiveTab: (value: string) => void;
  onDocumentOpen: (documentId: string) => void;
  onDocumentSelect: (documentId: string) => void;
  selectedDocumentId: string | null;
}

export const DocumentsPanel = ({ 
  documents, 
  activeTab, 
  setActiveTab, 
  onDocumentOpen,
  onDocumentSelect,
  selectedDocumentId
}: DocumentsPanelProps) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  
  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Client Files</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setSortBy('date')}>
              Sort by Date
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortBy('name')}>
              Sort by Name
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="outline" size="icon">
          <ArrowDownUp className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mb-4">
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-1.5" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-1.5" />
            Activity History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="mt-0 flex-1">
          <DocumentList 
            documents={sortedDocuments} 
            onDocumentOpen={onDocumentOpen} 
            onDocumentSelect={onDocumentSelect}
            selectedDocumentId={selectedDocumentId}
            viewMode={viewMode}
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-0 flex-1">
          <ActivityHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
