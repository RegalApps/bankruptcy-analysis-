
import { useState, useEffect, useMemo } from "react";
import { FolderStructure } from "@/types/folders";

interface UseFolderFilterAndExpandProps {
  folders: FolderStructure[];
  searchQuery: string;
}

export const useFolderFilterAndExpand = ({ 
  folders, 
  searchQuery 
}: UseFolderFilterAndExpandProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  // Filter folders based on search query
  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    
    const searchLower = searchQuery.toLowerCase();
    
    // Helper function to check if a folder or any of its children match the search
    const folderMatches = (folder: FolderStructure): boolean => {
      const nameMatches = folder.name.toLowerCase().includes(searchLower);
      
      if (nameMatches) return true;
      
      if (folder.children && folder.children.length > 0) {
        return folder.children.some(child => folderMatches(child));
      }
      
      return false;
    };
    
    // Filter top-level folders
    const filtered = folders.filter(folder => folderMatches(folder));
    
    // Auto-expand folders when searching
    if (filtered.length > 0 && searchQuery.trim()) {
      const newExpanded = { ...expandedFolders };
      
      // Recursive function to expand all folders that match or contain matches
      const expandMatchingFolders = (folder: FolderStructure) => {
        if (folder.name.toLowerCase().includes(searchLower)) {
          newExpanded[folder.id] = true;
          
          // Expand parent folders too
          if (folder.parentId) {
            newExpanded[folder.parentId] = true;
          }
        }
        
        if (folder.children && folder.children.length > 0) {
          folder.children.forEach(child => expandMatchingFolders(child));
        }
      };
      
      filtered.forEach(folder => expandMatchingFolders(folder));
      setExpandedFolders(newExpanded);
    }
    
    return filtered;
  }, [folders, searchQuery, expandedFolders]);

  // Toggle folder expansion
  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // Initialize with all top-level folders expanded
  useEffect(() => {
    if (folders.length > 0) {
      const initialExpanded: Record<string, boolean> = {};
      
      // Expand all top-level folders by default
      folders.forEach(folder => {
        initialExpanded[folder.id] = true;
      });
      
      setExpandedFolders(prevExpanded => ({
        ...initialExpanded,
        ...prevExpanded // Preserve any user-expanded state
      }));
    }
  }, [folders]);

  return {
    filteredFolders,
    expandedFolders,
    toggleFolder,
    setExpandedFolders
  };
};
