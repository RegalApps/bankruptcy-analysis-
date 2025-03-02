
import { useState, useEffect } from "react";
import { documentService } from "../services/documentService";

interface MergeFoldersHandlerProps {
  clientName: string;
  setMergeableClientFolders: (mergeables: Record<string, string[]>) => void;
  setFolderNames: (names: Record<string, string>) => void;
  updateMergeableClientFolders?: (mergeables: Record<string, string[]>) => void;
  updateHighlightMergeTargets?: (highlight: boolean) => void;
}

export const useMergeFoldersHandler = ({
  clientName,
  setMergeableClientFolders,
  setFolderNames,
  updateMergeableClientFolders,
  updateHighlightMergeTargets
}: MergeFoldersHandlerProps) => {
  const [debouncedClientName, setDebouncedClientName] = useState(clientName);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      handlePreviewMerge(debouncedClientName);
    }, 500);
    
    return () => clearTimeout(handler);
  }, [debouncedClientName]);
  
  const handleClientNameChange = (value: string) => {
    setDebouncedClientName(value);
  };
  
  const handlePreviewMerge = async (searchClientName: string) => {
    if (!searchClientName.trim()) {
      if (updateMergeableClientFolders) {
        updateMergeableClientFolders({});
      }
      return;
    }
    
    try {
      const { mergeableClientFolders: mergeables, folderNames: names } = 
        await documentService.findMergeableFolders(searchClientName);
      
      setMergeableClientFolders(mergeables);
      setFolderNames(names);
      
      if (updateMergeableClientFolders) {
        updateMergeableClientFolders(mergeables);
      }
      
      // Enable highlight mode only when we have found mergeable folders
      if (updateHighlightMergeTargets) {
        updateHighlightMergeTargets(Object.keys(mergeables).length > 0);
      }
    } catch (error) {
      console.error('Error finding mergeable folders:', error);
    }
  };
  
  const handleCancelPreview = () => {
    if (updateMergeableClientFolders) {
      updateMergeableClientFolders({});
    }
    if (updateHighlightMergeTargets) {
      updateHighlightMergeTargets(false);
    }
  };
  
  return {
    handleClientNameChange,
    handlePreviewMerge,
    handleCancelPreview
  };
};
