
import { useState, useEffect, useMemo } from "react";
import { Document } from "@/components/DocumentList/types";
import { FolderStructure } from "@/types/folders";
import { useCreateFolderStructure } from "./hooks/useCreateFolderStructure";
import { Button } from "@/components/ui/button";
import { DocumentViewControls } from "./components/DocumentViewControls";
import { DocumentSearchFilter } from "./components/DocumentSearchFilter";
import { DocumentTree } from "./components/DocumentTree";
import { DocumentViewPanel } from "./components/DocumentViewPanel";
import { FolderTools } from "./components/FolderTools";
import { FileText, FolderOpen, UsersRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EnhancedFolderTabProps {
  documents: Document[];
  onDocumentOpen: (documentId: string) => void;
  onRefresh?: () => void;
  onClientSelect?: (clientId: string) => void;
  clients?: { id: string; name: string }[];
}

export const EnhancedFolderTab = ({
  documents,
  onDocumentOpen,
  onRefresh,
  onClientSelect,
  clients = []
}: EnhancedFolderTabProps) => {
  const { folders } = useCreateFolderStructure(documents);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);

  // Reset selection when documents change
  useEffect(() => {
    if (documents.length === 0) {
      setSelectedFolderId(undefined);
      setSelectedDocumentId(undefined);
    }
  }, [documents]);

  // Filter folders and documents based on search term
  const filteredFolders = useMemo(() => {
    if (!searchTerm) return folders;
    
    return folders.filter(folder => 
      folder.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [folders, searchTerm]);

  // Filter documents based on selected folder or search term
  const filteredDocuments = useMemo(() => {
    let filtered = documents;
    
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedFolderId) {
      filtered = filtered.filter(doc => 
        doc.parent_folder_id === selectedFolderId
      );
    } else if (selectedClientId) {
      filtered = filtered.filter(doc => 
        doc.metadata?.client_id === selectedClientId
      );
    }
    
    return filtered;
  }, [documents, searchTerm, selectedFolderId, selectedClientId]);

  // Identify Form 47 documents
  const form47Documents = useMemo(() => {
    return documents.filter(doc => 
      doc.type === 'form-47' || 
      (doc.title && doc.title.toLowerCase().includes('form 47')) ||
      (doc.title && doc.title.toLowerCase().includes('consumer proposal'))
    );
  }, [documents]);

  // Toggle folder expanded state
  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // Handle folder selection
  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(prev => prev === folderId ? undefined : folderId);
    setSelectedClientId(undefined);
    setSelectedDocumentId(undefined);
  };

  // Handle document selection
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(prev => prev === documentId ? undefined : documentId);
  };

  // Handle client selection
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(prev => prev === clientId ? undefined : clientId);
    setSelectedFolderId(undefined);
    setSelectedDocumentId(undefined);
    
    // If a client detail viewer callback is provided, use it
    if (clientId && onClientSelect) {
      onClientSelect(clientId);
    }
  };

  // Handle drag and drop
  const handleDragStart = (id: string, type: 'folder' | 'document') => {
    const event = new DragEvent('dragstart');
    (event as any).dataTransfer = {
      setData: jest.fn(),
      effectAllowed: 'move'
    };
    (event as any).dataTransfer.setData('text/plain', JSON.stringify({ id, type }));
  };

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFolder(folderId);
  };

  const handleDragLeave = () => {
    setDragOverFolder(null);
  };

  const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFolder(null);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      console.log('Dropped', data, 'into folder', targetFolderId);
      
      // In a real app, you would update the backend here
      // For now, just show a message
      // toast.success(`Moved ${data.type} to folder`);
    } catch (err) {
      console.error('Invalid drop data', err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Left sidebar - folders and clients */}
      <div className="col-span-1">
        {/* Client List */}
        {clients.length > 0 && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <UsersRound className="h-5 w-5 mr-2 text-primary" />
                Clients
              </h3>
              <div className="space-y-2">
                {clients.map(client => (
                  <div
                    key={client.id}
                    className={`
                      p-2 rounded cursor-pointer flex items-center
                      ${selectedClientId === client.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'}
                    `}
                    onClick={() => handleClientSelect(client.id)}
                  >
                    <UsersRound className="h-4 w-4 mr-2" />
                    <span className="truncate">{client.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Folders */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium flex items-center">
                <FolderOpen className="h-5 w-5 mr-2 text-primary" />
                Folders
              </h3>
              <FolderTools onRefresh={onRefresh} />
            </div>
            
            <DocumentSearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            
            <DocumentTree
              filteredFolders={filteredFolders}
              filteredDocuments={filteredDocuments}
              form47Documents={form47Documents}
              selectedFolderId={selectedFolderId}
              selectedClientId={selectedClientId}
              expandedFolders={expandedFolders}
              dragOverFolder={dragOverFolder}
              onFolderSelect={handleFolderSelect}
              onDocumentSelect={handleDocumentSelect}
              onDocumentOpen={onDocumentOpen}
              toggleFolder={toggleFolder}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Right content area - document grid/list */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Documents
                {selectedFolderId && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    in {folders.find(f => f.id === selectedFolderId)?.name}
                  </span>
                )}
                {selectedClientId && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    for {clients.find(c => c.id === selectedClientId)?.name}
                  </span>
                )}
              </h3>
              
              <DocumentViewControls
                displayMode={displayMode}
                setDisplayMode={setDisplayMode}
              />
            </div>
            
            <DocumentViewPanel
              documents={filteredDocuments}
              displayMode={displayMode}
              selectedDocumentId={selectedDocumentId}
              onDocumentSelect={handleDocumentSelect}
              onDocumentOpen={onDocumentOpen}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
