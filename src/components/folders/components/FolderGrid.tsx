
import { Document } from "@/components/DocumentList/types";
import { FolderIcon } from "@/components/DocumentList/components/FolderIcon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface FolderGridProps {
  folders: Document[];
  documents: Document[];
  isDragging: boolean;
  selectedFolder: string | null;
  onFolderSelect: (folderId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, folderId: string) => void;
}

export const FolderGrid = ({
  folders,
  documents,
  isDragging,
  selectedFolder,
  onFolderSelect,
  onDragOver,
  onDragLeave,
  onDrop,
}: FolderGridProps) => {
  const navigate = useNavigate();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    console.log("FolderGrid render with folders:", folders.length);
    console.log("Documents:", documents.length);
    console.log("Selected folder:", selectedFolder);
    
    // When a folder is selected, automatically expand it
    if (selectedFolder) {
      setExpandedFolders(prev => {
        const newSet = new Set(prev);
        newSet.add(selectedFolder);
        return newSet;
      });
    }
  }, [folders, documents, selectedFolder]);

  const handleDocumentDoubleClick = (documentId: string) => {
    console.log("Document double-clicked:", documentId);
    navigate('/', { state: { selectedDocument: documentId } });
  };

  const handleDocumentClick = (documentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Document clicked:", documentId);
    // You could add selection highlighting here
  };

  // Toggle folder expansion
  const toggleFolderExpansion = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
    
    onFolderSelect(folderId);
  };

  // Get all documents for a specific folder
  const getFolderDocuments = (folderId: string) => {
    return documents.filter(doc => doc.parent_folder_id === folderId && !doc.is_folder);
  };

  // Get all subfolders for a specific folder
  const getSubFolders = (parentFolderId: string) => {
    return folders.filter(folder => folder.parent_folder_id === parentFolderId);
  };

  // Get top-level client folders without duplicates
  const getUniqueClientFolders = () => {
    // Get all client folders
    const allClientFolders = folders.filter(folder => 
      folder.folder_type === 'client' || (!folder.parent_folder_id && !folder.folder_type)
    );
    
    // Create a Map to deduplicate by title
    const uniqueFoldersByTitle = new Map();
    
    // For each client folder, keep the most recently updated one
    allClientFolders.forEach(folder => {
      const existingFolder = uniqueFoldersByTitle.get(folder.title);
      
      // If we don't have this folder title yet, or this folder is newer than the one we have
      if (!existingFolder || new Date(folder.updated_at) > new Date(existingFolder.updated_at)) {
        uniqueFoldersByTitle.set(folder.title, folder);
      }
    });
    
    // Convert Map values back to array
    return Array.from(uniqueFoldersByTitle.values());
  };

  const clientFolders = getUniqueClientFolders();
  console.log("Unique client folders:", clientFolders.map(f => f.title));

  return (
    <ScrollArea className="h-[400px]">
      <div 
        className={cn(
          "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
          isDragging && "ring-2 ring-primary/50 rounded-lg p-4"
        )}
      >
        {clientFolders.length > 0 ? (
          clientFolders.map((clientFolder) => {
            const isClientSelected = selectedFolder === clientFolder.id;
            const isClientExpanded = expandedFolders.has(clientFolder.id);
            
            // Get form folders that belong to this client folder
            const formFolders = getSubFolders(clientFolder.id);
            console.log(`Form folders for ${clientFolder.title}:`, formFolders.map(f => f.title));
            
            return (
              <div
                key={clientFolder.id}
                className="p-4 rounded-lg glass-panel hover:shadow-lg transition-all duration-200 card-highlight border border-muted"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, clientFolder.id)}
              >
                <div 
                  className={cn(
                    "flex items-center space-x-4 cursor-pointer p-2 rounded-md",
                    isClientSelected && "bg-muted/50"
                  )}
                  onClick={(e) => toggleFolderExpansion(clientFolder.id, e)}
                >
                  {isClientExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <FolderIcon 
                    variant="client" 
                    isActive={isClientSelected}
                    isOpen={isClientExpanded}
                  />
                  <div>
                    <h4 className="font-medium text-lg">{clientFolder.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formFolders.length} form {formFolders.length === 1 ? 'folder' : 'folders'}
                    </p>
                  </div>
                </div>
                
                {isClientExpanded && (
                  <div className="mt-2 pl-12 space-y-2 border-l-2 border-muted py-2">
                    {formFolders.length > 0 ? (
                      formFolders.map(formFolder => {
                        const formDocs = getFolderDocuments(formFolder.id);
                        console.log(`Documents for ${formFolder.title}:`, formDocs.map(d => d.title));
                        const isFormSelected = selectedFolder === formFolder.id;
                        const isFormExpanded = expandedFolders.has(formFolder.id);

                        return (
                          <div 
                            key={formFolder.id}
                            className="mb-3"
                          >
                            <div 
                              className={cn(
                                "flex items-center space-x-2 p-2 rounded-md cursor-pointer",
                                isFormSelected && "bg-muted/50"
                              )}
                              onClick={(e) => toggleFolderExpansion(formFolder.id, e)}
                            >
                              {isFormExpanded ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <FolderIcon 
                                variant="form"
                                isActive={isFormSelected}
                                isOpen={isFormExpanded}
                              />
                              <h5 className="font-medium">{formFolder.title}</h5>
                            </div>

                            {isFormExpanded && formDocs.length > 0 && (
                              <div className="ml-8 pl-4 mt-1 space-y-1 border-l-2 border-muted py-1">
                                {formDocs.map(doc => (
                                  <div 
                                    key={doc.id}
                                    className="flex items-center p-2 rounded hover:bg-muted cursor-pointer"
                                    onClick={(e) => handleDocumentClick(doc.id, e)}
                                    onDoubleClick={(e) => {
                                      e.stopPropagation();
                                      handleDocumentDoubleClick(doc.id);
                                    }}
                                  >
                                    <FileText className="h-4 w-4 mr-2 text-primary" />
                                    <div>
                                      <p className="text-sm font-medium">{doc.title}</p>
                                      {doc.metadata?.client_name && (
                                        <p className="text-xs text-muted-foreground">
                                          Client: {doc.metadata.client_name}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      // Show documents directly under client folder if no form folders exist
                      <div>
                        {getFolderDocuments(clientFolder.id).length > 0 ? (
                          getFolderDocuments(clientFolder.id).map(doc => (
                            <div 
                              key={doc.id}
                              className="flex items-center p-2 rounded hover:bg-muted cursor-pointer"
                              onClick={(e) => handleDocumentClick(doc.id, e)}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                handleDocumentDoubleClick(doc.id);
                              }}
                            >
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              <div>
                                <p className="text-sm font-medium">{doc.title}</p>
                                {doc.metadata?.client_name && (
                                  <p className="text-xs text-muted-foreground">
                                    Client: {doc.metadata.client_name}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground py-2">No documents yet</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-3 text-center py-6">
            <p className="text-muted-foreground">No folders found. Click "New Folder" to create one.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
