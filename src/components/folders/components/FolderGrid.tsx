
import { Document } from "@/components/DocumentList/types";
import { FolderIcon } from "@/components/DocumentList/components/FolderIcon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

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

  const handleDocumentDoubleClick = (documentId: string) => {
    navigate('/', { state: { selectedDocument: documentId } });
  };

  const getSubFolders = (parentFolderId: string) => {
    return folders.filter(folder => folder.parent_folder_id === parentFolderId);
  };

  const getFolderDocuments = (folderId: string) => {
    return documents.filter(doc => doc.parent_folder_id === folderId && !doc.is_folder);
  };

  // Get top-level client folders (those without a parent)
  const clientFolders = folders.filter(folder => !folder.parent_folder_id);

  return (
    <ScrollArea className="h-[400px]">
      <div 
        className={cn(
          "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
          isDragging && "ring-2 ring-primary/50 rounded-lg p-4"
        )}
      >
        {clientFolders.map((clientFolder) => {
          const isClientSelected = selectedFolder === clientFolder.id;
          const formFolders = getSubFolders(clientFolder.id);
          
          return (
            <div
              key={clientFolder.id}
              className={cn(
                "p-4 rounded-lg glass-panel hover:shadow-lg transition-all duration-200 card-highlight",
                isClientSelected && "ring-2 ring-primary"
              )}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, clientFolder.id)}
              onClick={() => onFolderSelect(clientFolder.id)}
            >
              <div className="flex items-center space-x-4">
                <FolderIcon 
                  variant="client" 
                  isActive={isClientSelected}
                  isOpen={isClientSelected}
                />
                <div>
                  <h4 className="font-medium text-lg">{clientFolder.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formFolders.length} form folders
                  </p>
                </div>
              </div>
              
              {isClientSelected && formFolders.length > 0 && (
                <div className="mt-4 pl-8 space-y-4 border-l-2 border-muted">
                  {formFolders.map(formFolder => {
                    const formDocs = getFolderDocuments(formFolder.id);
                    const isFormSelected = selectedFolder === formFolder.id;

                    return (
                      <div 
                        key={formFolder.id}
                        className={cn(
                          "p-3 rounded-lg hover:bg-muted/50 cursor-pointer",
                          isFormSelected && "bg-muted"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onFolderSelect(formFolder.id);
                        }}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <FolderIcon 
                            variant="form"
                            isActive={isFormSelected}
                            isOpen={isFormSelected}
                          />
                          <h5 className="font-medium">{formFolder.title}</h5>
                        </div>

                        {isFormSelected && formDocs.length > 0 && (
                          <div className="ml-6 mt-2 space-y-2">
                            {formDocs.map(doc => (
                              <div 
                                key={doc.id}
                                className="flex items-center p-2 rounded hover:bg-muted cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
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
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
