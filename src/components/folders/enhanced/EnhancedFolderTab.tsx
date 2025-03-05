
import { useState, useEffect } from "react";
import { Folder, FolderSearch, Plus, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderNavigation } from "./FolderNavigation";
import { FolderRecommendation } from "./FolderRecommendation";
import { folderService } from "@/services/folderService";
import { useToast } from "@/hooks/use-toast";
import { Document } from "@/components/DocumentList/types";
import { FolderStructure, FolderPermissionRule, UserRole, FolderPermission } from "@/types/folders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UncategorizedGrid } from "../../folders/components/UncategorizedGrid";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface EnhancedFolderTabProps {
  documents: Document[];
  onDocumentOpen: (documentId: string) => void;
  onRefresh?: () => void;
}

export function EnhancedFolderTab({ documents, onDocumentOpen, onRefresh }: EnhancedFolderTabProps) {
  // States
  const [folders, setFolders] = useState<FolderStructure[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderType, setNewFolderType] = useState<'client' | 'form' | 'financial' | 'general'>('client');
  const [folderPermissions, setFolderPermissions] = useState<FolderPermissionRule[]>([]);
  const [userRole, setUserRole] = useState<UserRole>('admin'); // Default to admin for demo
  const [activeTab, setActiveTab] = useState("folders");
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [documentForRecommendation, setDocumentForRecommendation] = useState<Document | null>(null);
  
  const { toast } = useToast();

  // Fetch folders and permissions on mount
  useEffect(() => {
    fetchFolders();
    fetchPermissions();
  }, []);

  const fetchFolders = async () => {
    const folderData = await folderService.getFolders();
    setFolders(folderData);
    
    // Auto-expand top-level folders
    if (folderData.length > 0) {
      const expanded: Record<string, boolean> = {};
      folderData.forEach(folder => {
        expanded[folder.id] = true;
      });
      setExpandedFolders(expanded);
    }
  };

  const fetchPermissions = async () => {
    const userId = "current-user-id"; // In a real app, get this from auth context
    const permissions = await folderService.getFolderPermissions(userId);
    setFolderPermissions(permissions);
  };

  // Filter folders and documents based on search
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const uncategorizedDocuments = filteredDocuments.filter(
    doc => !doc.is_folder && !doc.parent_folder_id
  );

  // Handlers
  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(folderId);
    setSelectedDocumentId(undefined);
  };

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };

  const handleNewFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const folderId = await folderService.createFolder(
      newFolderName,
      newFolderType,
      selectedFolderId
    );

    if (folderId) {
      setIsNewFolderDialogOpen(false);
      setNewFolderName("");
      fetchFolders();
      if (onRefresh) onRefresh();
    }
  };

  const handleMoveDocument = async (documentId: string, folderId: string) => {
    const success = await folderService.moveDocumentToFolder(documentId, folderId);
    if (success) {
      toast({
        title: "Success",
        description: "Document moved successfully"
      });
      if (onRefresh) onRefresh();
      setShowRecommendation(false);
      setDocumentForRecommendation(null);
    }
  };

  // Check if user can perform an action
  const canPerformAction = (folderId: string, action: 'view' | 'edit' | 'delete'): boolean => {
    return folderService.hasPermission(folderId, action, userRole, folderPermissions);
  };

  const handleDragStart = (e: React.DragEvent, documentId: string) => {
    e.dataTransfer.setData('documentId', documentId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    const documentId = e.dataTransfer.getData('documentId');
    if (documentId && folderId) {
      await handleMoveDocument(documentId, folderId);
    }
  };

  const handleShowRecommendation = (document: Document) => {
    setDocumentForRecommendation(document);
    setShowRecommendation(true);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* Folder Navigation Panel */}
      <Card className="w-full md:w-1/4 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Folders
            </CardTitle>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsNewFolderDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
          
          {/* Search input */}
          <div className="relative mt-2">
            <FolderSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search folders..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-2">
          <FolderNavigation
            folders={folders}
            documents={filteredDocuments}
            onFolderSelect={handleFolderSelect}
            onDocumentSelect={handleDocumentSelect}
            onDocumentOpen={onDocumentOpen}
            selectedFolderId={selectedFolderId}
            expandedFolders={expandedFolders}
            setExpandedFolders={setExpandedFolders}
          />
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="folders">Folders</TabsTrigger>
            <TabsTrigger value="uncategorized">
              Uncategorized 
              {uncategorizedDocuments.length > 0 && 
                <span className="ml-1 bg-primary/20 text-xs rounded-full px-2">
                  {uncategorizedDocuments.length}
                </span>
              }
            </TabsTrigger>
          </TabsList>

          <TabsContent value="folders">
            {/* Folder content - empty state or folder info */}
            <Card>
              <CardContent className="p-6">
                {selectedFolderId ? (
                  <div>
                    {/* Selected folder details would go here */}
                    <h3 className="text-lg font-medium mb-4">
                      {folders.find(f => f.id === selectedFolderId)?.name}
                    </h3>
                    
                    {/* Upload button for this folder */}
                    <div className="flex justify-end mb-4">
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload to this folder
                      </Button>
                    </div>
                    
                    {/* Documents in this folder */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredDocuments
                        .filter(doc => !doc.is_folder && doc.parent_folder_id === selectedFolderId)
                        .map(doc => (
                          <Card 
                            key={doc.id} 
                            className={`cursor-pointer hover:border-primary/50 transition-colors ${
                              selectedDocumentId === doc.id ? 'border-primary' : ''
                            }`}
                            onClick={() => handleDocumentSelect(doc.id)}
                            onDoubleClick={() => onDocumentOpen(doc.id)}
                          >
                            <CardContent className="p-4">
                              <div className="truncate font-medium">{doc.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(doc.created_at).toLocaleDateString()}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No folder selected</h3>
                    <p className="text-muted-foreground">
                      Select a folder from the left panel to view its contents
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="uncategorized">
            {/* Show AI recommendation if available */}
            {showRecommendation && documentForRecommendation && (
              <FolderRecommendation
                document={documentForRecommendation}
                onAccept={(folderId) => handleMoveDocument(documentForRecommendation.id, folderId)}
                onReject={() => setShowRecommendation(false)}
              />
            )}

            {/* Uncategorized documents */}
            <Card>
              <CardHeader>
                <CardTitle>Uncategorized Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {uncategorizedDocuments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No uncategorized documents</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uncategorizedDocuments.map(doc => (
                      <Card 
                        key={doc.id} 
                        className="cursor-pointer hover:border-primary/50 transition-colors"
                        draggable
                        onDragStart={(e) => handleDragStart(e, doc.id)}
                      >
                        <CardContent className="p-4">
                          <div className="truncate font-medium">{doc.title}</div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onDocumentOpen(doc.id)}
                            >
                              Open
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost">Organize</Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleShowRecommendation(doc)}>
                                  AI Recommendation
                                </DropdownMenuItem>
                                {folders
                                  .filter(folder => canPerformAction(folder.id, 'edit'))
                                  .map(folder => (
                                    <DropdownMenuItem 
                                      key={folder.id}
                                      onClick={() => handleMoveDocument(doc.id, folder.id)}
                                    >
                                      Move to: {folder.name}
                                    </DropdownMenuItem>
                                  ))
                                }
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Folder Dialog */}
      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Folder Name
              </label>
              <Input
                id="name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Folder Type
              </label>
              <select
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newFolderType}
                onChange={(e) => setNewFolderType(e.target.value as any)}
              >
                <option value="client">Client</option>
                <option value="form">Forms</option>
                <option value="financial">Financial</option>
                <option value="general">General</option>
              </select>
            </div>
            {selectedFolderId && (
              <div className="text-sm text-muted-foreground">
                Will be created inside: {folders.find(f => f.id === selectedFolderId)?.name}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleNewFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
