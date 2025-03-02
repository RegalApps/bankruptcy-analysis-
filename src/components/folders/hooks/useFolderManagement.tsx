
import { useState } from "react";
import { Document } from "@/components/DocumentList/types";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface UseFolderManagementProps {
  documents: Document[];
  onRefresh?: () => void;
  onItemSelect: (id: string, type: "folder" | "file") => void;
}

export const useFolderManagement = ({ 
  documents, 
  onRefresh, 
  onItemSelect 
}: UseFolderManagementProps) => {
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [activeView, setActiveView] = useState<"all" | "uncategorized" | "folders">("all");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [mergeableClientFolders, setMergeableClientFolders] = useState<Record<string, string[]>>({});
  const [highlightMergeTargets, setHighlightMergeTargets] = useState(false);

  const getFilteredDocuments = () => {
    switch (activeView) {
      case "folders":
        return documents.filter(doc => doc.is_folder);
      case "uncategorized":
        return documents.filter(doc => !doc.is_folder && !doc.parent_folder_id);
      case "all":
      default:
        return documents;
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([
          {
            title: newFolderName,
            is_folder: true,
            folder_type: 'client',
          }
        ]);

      if (error) throw error;
      
      setShowFolderDialog(false);
      setNewFolderName("");
      toast.success("Folder created successfully");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error("Failed to create folder");
    }
  };

  const handleDocumentDrop = async (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    const documentId = e.dataTransfer.getData('documentId');
    if (!documentId) return;

    try {
      const { error } = await supabase
        .from('documents')
        .update({ parent_folder_id: folderId })
        .eq('id', documentId);

      if (error) throw error;
      toast.success("Document moved successfully");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error moving document:', error);
      toast.error("Failed to move document");
    }
    setIsDragging(false);
  };

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
    onItemSelect(folderId, "folder");
  };

  const updateMergeableClientFolders = (mergeables: Record<string, string[]>) => {
    setMergeableClientFolders(mergeables);
  };

  const updateHighlightMergeTargets = (highlight: boolean) => {
    setHighlightMergeTargets(highlight);
  };

  const folders = documents.filter(doc => doc.is_folder);
  const uncategorizedDocuments = documents.filter(doc => !doc.is_folder && !doc.parent_folder_id);

  return {
    showFolderDialog,
    setShowFolderDialog,
    newFolderName,
    setNewFolderName,
    isDragging,
    setIsDragging,
    activeView,
    setActiveView,
    selectedFolder,
    handleCreateFolder,
    handleDocumentDrop,
    handleFolderSelect,
    mergeableClientFolders,
    updateMergeableClientFolders,
    highlightMergeTargets,
    updateHighlightMergeTargets,
    folders,
    uncategorizedDocuments
  };
};
