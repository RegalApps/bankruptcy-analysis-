import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, FileText, Calendar, Filter, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Document } from "../types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DocumentsPanelProps {
  documents: Document[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<string | null>(null);
  
  const documentTypes = useMemo(() => {
    const types = new Set<string>();
    documents.forEach(doc => {
      if (doc.type) types.add(doc.type);
    });
    return Array.from(types);
  }, [documents]);
  
  const filteredDocuments = useMemo(() => {
    let filtered = documents;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(term) ||
        (doc.type && doc.type.toLowerCase().includes(term))
      );
    }
    
    if (filterType) {
      filtered = filtered.filter(doc => doc.type === filterType);
    }
    
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.updated_at).getTime();
        const dateB = new Date(b.updated_at).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortDirection === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });
    
    return filtered;
  }, [documents, searchTerm, filterType, sortBy, sortDirection]);
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  const documentsByDate = useMemo(() => {
    const grouped: Record<string, Document[]> = {};
    
    filteredDocuments.forEach(doc => {
      const date = new Date(doc.updated_at);
      const key = format(date, 'MMMM yyyy');
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      
      grouped[key].push(doc);
    });
    
    return grouped;
  }, [filteredDocuments]);
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex mt-3 gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Filter className="h-3 w-3 mr-1" />
                {filterType || "All Types"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setFilterType(null)}>
                All Types
              </DropdownMenuItem>
              {documentTypes.map(type => (
                <DropdownMenuItem key={type} onClick={() => setFilterType(type)}>
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <SortAsc className="h-3 w-3 mr-1" />
                Sort: {sortBy === 'date' ? 'Date' : 'Name'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Name
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={toggleSortDirection}
          >
            {sortDirection === 'asc' ? (
              <SortAsc className="h-3 w-3" />
            ) : (
              <SortDesc className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 border-b">
          <TabsList className="w-full">
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="flex-1 overflow-hidden p-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-2">
              {filteredDocuments.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                  No documents found
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredDocuments.map((doc) => (
                    <div 
                      key={doc.id}
                      className={cn(
                        "p-3 rounded-md cursor-pointer hover:bg-accent/50 transition-colors",
                        selectedDocumentId === doc.id ? "bg-accent" : ""
                      )}
                      onClick={() => onDocumentSelect(doc.id)}
                      onDoubleClick={() => onDocumentOpen(doc.id)}
                    >
                      <div className="flex items-start">
                        <div className="bg-muted rounded-md p-1.5 mr-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate">{doc.title}</h4>
                            <span className="text-xs text-muted-foreground ml-2 shrink-0">
                              {format(new Date(doc.updated_at), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-muted-foreground">{doc.type || 'Document'}</span>
                            <button 
                              className="text-xs text-primary ml-auto hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDocumentOpen(doc.id);
                              }}
                            >
                              Open
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="timeline" className="flex-1 overflow-hidden p-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              {Object.keys(documentsByDate).length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                  No documents found
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(documentsByDate).map(([dateGroup, docs]) => (
                    <div key={dateGroup}>
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <h3 className="font-medium">{dateGroup}</h3>
                      </div>
                      <div className="space-y-2 pl-6 border-l">
                        {docs.map(doc => (
                          <div 
                            key={doc.id}
                            className={cn(
                              "p-3 rounded-md cursor-pointer hover:bg-accent/50 transition-colors",
                              selectedDocumentId === doc.id ? "bg-accent" : ""
                            )}
                            onClick={() => onDocumentSelect(doc.id)}
                            onDoubleClick={() => onDocumentOpen(doc.id)}
                          >
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              <div className="flex-1">
                                <h4 className="text-sm font-medium">{doc.title}</h4>
                                <div className="flex justify-between mt-1">
                                  <span className="text-xs text-muted-foreground">{doc.type || 'Document'}</span>
                                  <button 
                                    className="text-xs text-primary hover:underline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDocumentOpen(doc.id);
                                    }}
                                  >
                                    Open
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
