
import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, FileText, Calendar, Filter, SortAsc, SortDesc, Grid, List } from "lucide-react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'table'>('table');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  
  // Get unique document types
  const documentTypes = useMemo(() => {
    const types = new Set<string>();
    documents.forEach(doc => {
      if (doc.type) types.add(doc.type);
    });
    return Array.from(types);
  }, [documents]);
  
  // Get unique document categories
  const documentCategories = useMemo(() => {
    const categories = new Set<string>();
    documents.forEach(doc => {
      if (doc.metadata?.category) categories.add(doc.metadata.category as string);
    });
    return Array.from(categories);
  }, [documents]);
  
  const getDocumentStatus = (doc: Document): 'complete' | 'pending' | 'review' => {
    return (doc.metadata?.status as any) || 'pending';
  };
  
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
    
    if (filterCategory) {
      filtered = filtered.filter(doc => doc.metadata?.category === filterCategory);
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
  }, [documents, searchTerm, filterType, filterCategory, sortBy, sortDirection]);
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  const getStatusBadge = (status: 'complete' | 'pending' | 'review') => {
    switch (status) {
      case 'complete':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Complete</Badge>;
      case 'review':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Review</Badge>;
      default:
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
    }
  };
  
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
        
        <div className="flex mt-3 gap-2 flex-wrap">
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
          
          {documentCategories.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <Filter className="h-3 w-3 mr-1" />
                  {filterCategory || "All Categories"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setFilterCategory(null)}>
                  All Categories
                </DropdownMenuItem>
                {documentCategories.map(category => (
                  <DropdownMenuItem key={category} onClick={() => setFilterCategory(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
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
          
          <div className="ml-auto flex gap-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {filteredDocuments.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              No documents found
            </div>
          ) : viewMode === 'table' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map(doc => (
                  <TableRow 
                    key={doc.id}
                    className={cn(
                      "cursor-pointer",
                      selectedDocumentId === doc.id ? "bg-primary/10" : ""
                    )}
                    onClick={() => onDocumentSelect(doc.id)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        {doc.title}
                      </div>
                    </TableCell>
                    <TableCell>{doc.type || '-'}</TableCell>
                    <TableCell>
                      {getStatusBadge(getDocumentStatus(doc))}
                    </TableCell>
                    <TableCell>
                      {format(new Date(doc.updated_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDocumentOpen(doc.id);
                        }}
                      >
                        Open
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className={cn(
              "grid gap-4 p-4",
              viewMode === 'grid' ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
            )}>
              {filteredDocuments.map(doc => (
                <div
                  key={doc.id}
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-colors hover:bg-accent/50",
                    selectedDocumentId === doc.id ? "ring-2 ring-primary" : ""
                  )}
                  onClick={() => onDocumentSelect(doc.id)}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-primary mr-2" />
                        <h4 className="font-medium text-sm line-clamp-1">{doc.title}</h4>
                      </div>
                      {getStatusBadge(getDocumentStatus(doc))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-2">
                      Type: {doc.type || 'Unknown'}
                    </div>
                    
                    <div className="mt-auto pt-2 flex items-center justify-between border-t">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(doc.updated_at), 'MMM d, yyyy')}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-xs h-6 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDocumentOpen(doc.id);
                        }}
                      >
                        Open
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
