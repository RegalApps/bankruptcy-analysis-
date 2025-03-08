import { useState } from "react";
import { FolderNavigation } from "./FolderNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Document } from "@/components/DocumentList/types";
import { useCreateFolderStructure } from "./hooks/useCreateFolderStructure";
import { useFolderPermissions } from "./hooks/useFolderPermissions";
import { useFolderRecommendations } from "./hooks/useFolderRecommendations";
import { FolderOperations } from "./components/FolderOperations";
import { FolderManagementTools } from "./FolderManagementTools";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, FileQuestion } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ClientTab } from "./components/ClientTab";
import { UncategorizedTab } from "./components/UncategorizedTab";
import { FolderRecommendationSection } from "./components/FolderRecommendationSection";

interface EnhancedFolderTabProps {
  documents: Document[];
  onDocumentOpen: (documentId: string) => void;
  onRefresh: () => void;
}

export const EnhancedFolderTab = ({ 
  documents, 
  onDocumentOpen,
  onRefresh
}: EnhancedFolderTabProps) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>("folders");
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();
  const [viewingClientId, setViewingClientId] = useState<string | undefined>();
  const { toast } = useToast();
  
  const { folders, isLoading: foldersLoading } = useCreateFolderStructure(documents);
  const { userRole, folderPermissions } = useFolderPermissions();
  const { 
    showRecommendation, 
    recommendation, 
    setShowRecommendation,
    dismissRecommendation
  } = useFolderRecommendations(documents, folders);

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(folderId);
    setSelectedDocumentId(undefined);
  };

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    setSelectedFolderId(undefined);
    setSelectedDocumentId(undefined);
    setActiveTab("folders");
  };

  const handleClientViewerAccess = async (clientId: string) => {
    try {
      console.log("Accessing client viewer for ID:", clientId);
      
      await supabase
        .from('document_access_history')
        .insert({
          document_id: clientId,
          accessed_at: new Date().toISOString(),
          access_source: 'client_viewer'
        });
      
      setViewingClientId(clientId);
      setSelectedFolderId(undefined);
      setSelectedDocumentId(undefined);
      setActiveTab("folders");
    } catch (error) {
      console.error('Error logging client access:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access client information"
      });
      
      setViewingClientId(clientId);
    }
  };

  const handleAcceptRecommendation = async () => {
    setShowRecommendation(false);
    dismissRecommendation();
    
    onRefresh();
  };

  if (viewingClientId) {
    return (
      <ClientTab 
        clientId={viewingClientId} 
        onBack={() => setViewingClientId(undefined)}
        onDocumentOpen={onDocumentOpen}
      />
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full">
        <FolderManagementTools 
          documents={documents}
          onRefresh={onRefresh}
          selectedFolderId={selectedFolderId}
        />
        
        <FolderRecommendationSection
          showRecommendation={showRecommendation}
          recommendation={recommendation}
          onAcceptRecommendation={handleAcceptRecommendation}
          onDismissRecommendation={dismissRecommendation}
        />
        
        <FolderOperations
          showRecommendation={showRecommendation}
          recommendation={recommendation}
          onAcceptRecommendation={handleAcceptRecommendation}
          onDismissRecommendation={dismissRecommendation}
          onRefresh={onRefresh}
          setExpandedFolders={setExpandedFolders}
        />
        
        <Tabs 
          defaultValue="folders" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="folders" className="flex items-center">
              <Folder className="mr-2 h-4 w-4" />
              Folders
            </TabsTrigger>
            <TabsTrigger value="uncategorized" className="flex items-center">
              <FileQuestion className="mr-2 h-4 w-4" />
              Uncategorized
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="folders" className="mt-4 space-y-4">
            <FolderNavigation 
              folders={folders}
              documents={documents}
              onFolderSelect={handleFolderSelect}
              onDocumentSelect={handleDocumentSelect}
              onDocumentOpen={onDocumentOpen}
              onClientSelect={handleClientSelect}
              onClientViewerAccess={handleClientViewerAccess}
              selectedFolderId={selectedFolderId}
              selectedClientId={selectedClientId}
              expandedFolders={expandedFolders}
              setExpandedFolders={setExpandedFolders}
            />
          </TabsContent>
          
          <TabsContent value="uncategorized" className="mt-4 space-y-4">
            <UncategorizedTab 
              documents={documents}
              onDocumentOpen={onDocumentOpen}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
