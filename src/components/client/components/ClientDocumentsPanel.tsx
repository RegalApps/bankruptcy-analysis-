
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, FileText, FileSpreadsheet, ImageIcon, FileEdit, Trash } from "lucide-react";
import { formatDate } from "@/utils/formatDate";

interface ClientDocument {
  id: string;
  title: string;
  type: string;
  status: 'complete' | 'pending-review' | 'needs-signature' | 'draft';
  category: string;
  dateModified: string;
  fileType: string;
  fileSize: string;
}

interface ClientDocumentsPanelProps {
  documents: ClientDocument[];
  onDocumentSelect: (documentId: string) => void;
  selectedDocumentId: string | null;
}

export const ClientDocumentsPanel: React.FC<ClientDocumentsPanelProps> = ({ 
  documents, 
  onDocumentSelect,
  selectedDocumentId 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Filter documents based on search query and category filter
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for filtering
  const categories = Array.from(new Set(documents.map(doc => doc.category)));
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-800">Complete</Badge>;
      case 'pending-review':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'needs-signature':
        return <Badge className="bg-blue-100 text-blue-800">Needs Signature</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      case 'jpg':
      case 'png':
      case 'gif':
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button size="sm">Upload Document</Button>
      </div>
      
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all" onClick={() => setCategoryFilter(null)}>All</TabsTrigger>
            <TabsTrigger value="forms" onClick={() => setCategoryFilter("Forms")}>Forms</TabsTrigger>
            <TabsTrigger value="financial" onClick={() => setCategoryFilter("Financial")}>Financial</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-2">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map(doc => (
              <Card 
                key={doc.id} 
                className={`p-3 cursor-pointer transition-colors hover:bg-accent/20 ${selectedDocumentId === doc.id ? 'bg-accent/30 border-accent' : ''}`}
                onClick={() => onDocumentSelect(doc.id)}
              >
                <div className="flex items-start">
                  <div className="bg-muted rounded-md p-2 mr-3">
                    {getFileIcon(doc.fileType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium truncate">{doc.title}</h3>
                      {getStatusBadge(doc.status)}
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground mb-1">
                      <span className="truncate">{doc.type}</span>
                      <span className="mx-1">•</span>
                      <span>{doc.fileSize}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(doc.dateModified)}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <FileEdit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500">
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No documents found matching your search criteria.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
