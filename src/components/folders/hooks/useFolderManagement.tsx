
import { useState, useEffect } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // Extract all unique tags from documents
  const allTags = Array.from(
    new Set(
      documents
        .filter(doc => doc.metadata?.tags)
        .flatMap(doc => doc.metadata?.tags || [])
    )
  );

  const getFilteredDocuments = () => {
    let filtered = documents;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query)
      );
    }
    
    // Filter by current folder
    if (currentFolderId) {
      filtered = filtered.filter(doc => 
        doc.parent_folder_id === currentFolderId || doc.id === currentFolderId
      );
    }
    
    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(doc => 
        doc.metadata?.tags?.includes(selectedTag)
      );
    }
    
    // Apply view filters
    switch (activeView) {
      case "folders":
        return filtered.filter(doc => doc.is_folder);
      case "uncategorized":
        return filtered.filter(doc => !doc.is_folder && !doc.parent_folder_id);
      case "all":
      default:
        return filtered;
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
            parent_folder_id: currentFolderId
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
    setCurrentFolderId(folderId);
    onItemSelect(folderId, "folder");
  };

  const handleFolderNavigation = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    if (folderId) {
      setSelectedFolder(folderId);
      onItemSelect(folderId, "folder");
    }
  };

  const handleTagSelect = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  const handleAddTag = async (documentId: string, tag: string) => {
    try {
      // Get current document metadata
      const { data: documentData, error: fetchError } = await supabase
        .from('documents')
        .select('metadata')
        .eq('id', documentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Add tag to metadata
      const currentMetadata = documentData.metadata || {};
      const currentTags = currentMetadata.tags || [];
      
      if (!currentTags.includes(tag)) {
        const updatedTags = [...currentTags, tag];
        
        const { error: updateError } = await supabase
          .from('documents')
          .update({ 
            metadata: { ...currentMetadata, tags: updatedTags }
          })
          .eq('id', documentId);
        
        if (updateError) throw updateError;
        
        toast.success(`Tag "${tag}" added successfully`);
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.error("Failed to add tag");
    }
  };

  const handleRemoveTag = async (documentId: string, tag: string) => {
    try {
      // Get current document metadata
      const { data: documentData, error: fetchError } = await supabase
        .from('documents')
        .select('metadata')
        .eq('id', documentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Remove tag from metadata
      const currentMetadata = documentData.metadata || {};
      const currentTags = currentMetadata.tags || [];
      
      if (currentTags.includes(tag)) {
        const updatedTags = currentTags.filter(t => t !== tag);
        
        const { error: updateError } = await supabase
          .from('documents')
          .update({ 
            metadata: { ...currentMetadata, tags: updatedTags }
          })
          .eq('id', documentId);
        
        if (updateError) throw updateError;
        
        toast.success(`Tag "${tag}" removed successfully`);
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error('Error removing tag:', error);
      toast.error("Failed to remove tag");
    }
  };

  const updateMergeableClientFolders = (mergeables: Record<string, string[]>) => {
    setMergeableClientFolders(mergeables);
  };

  const updateHighlightMergeTargets = (highlight: boolean) => {
    setHighlightMergeTargets(highlight);
  };

  const filteredDocuments = getFilteredDocuments();
  const folders = filteredDocuments.filter(doc => doc.is_folder);
  const uncategorizedDocuments = filteredDocuments.filter(doc => !doc.is_folder && !doc.parent_folder_id);

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
    currentFolderId,
    searchQuery,
    setSearchQuery,
    allTags,
    selectedTag,
    handleTagSelect,
    handleAddTag,
    handleRemoveTag,
    handleCreateFolder,
    handleDocumentDrop,
    handleFolderSelect,
    handleFolderNavigation,
    mergeableClientFolders,
    updateMergeableClientFolders,
    highlightMergeTargets,
    updateHighlightMergeTargets,
    folders,
    uncategorizedDocuments,
    filteredDocuments
  };
};
