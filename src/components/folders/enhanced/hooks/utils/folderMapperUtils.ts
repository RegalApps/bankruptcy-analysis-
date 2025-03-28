
import { Document } from "@/components/DocumentList/types";
import { FolderStructure } from "@/types/folders";

/**
 * Maps Document objects to FolderStructure objects
 */
export const mapDocumentsToFolderStructure = (documents: Document[]): FolderStructure[] => {
  return documents
    .filter(doc => doc.is_folder)
    .map(doc => ({
      id: doc.id,
      title: doc.title || '',
      name: doc.title || '', // Add name property for components that use it
      parent_folder_id: doc.parent_folder_id,
      parentId: doc.parent_folder_id, // Add parentId for components that use it
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      is_folder: true,
      type: determineFolderType(doc),
      level: calculateFolderLevel(doc, documents),
      children: [],
      isExpanded: false,
      metadata: doc.metadata || {}
    }));
};

/**
 * Builds hierarchical folder structure from flat list
 */
export const buildFolderHierarchy = (folders: FolderStructure[]): FolderStructure[] => {
  const folderMap: Record<string, FolderStructure> = {};
  const rootFolders: FolderStructure[] = [];

  // First pass: create folder objects and map
  folders.forEach(folder => {
    folderMap[folder.id] = { ...folder, children: [] };
  });

  // Second pass: build the hierarchy
  Object.values(folderMap).forEach(folder => {
    const parentId = folder.parentId || folder.parent_folder_id;
    if (parentId && folderMap[parentId]) {
      // Add to parent's children
      if (!folderMap[parentId].children) {
        folderMap[parentId].children = [];
      }
      folderMap[parentId].children!.push(folder);
    } else {
      // Root level folder
      rootFolders.push(folder);
    }
  });

  return rootFolders;
};

/**
 * Flatten a hierarchical folder structure
 */
export const flattenFolderStructure = (folders: FolderStructure[]): FolderStructure[] => {
  let result: FolderStructure[] = [];
  
  for (const folder of folders) {
    result.push(folder);
    if (folder.children && folder.children.length > 0) {
      result = result.concat(flattenFolderStructure(folder.children));
    }
  }
  
  return result;
};

/**
 * Calculate folder level based on parent-child relationships
 */
const calculateFolderLevel = (folder: Document, allFolders: Document[]): number => {
  let level = 0;
  let currentFolder = folder;
  
  while (currentFolder.parent_folder_id) {
    level++;
    const parentFolder = allFolders.find(f => f.id === currentFolder.parent_folder_id);
    if (!parentFolder) break;
    currentFolder = parentFolder;
  }
  
  return level;
};

/**
 * Determine folder type from Document properties
 */
export const determineFolderType = (folder: Document): 'client' | 'form' | 'financial' | 'general' => {
  if (folder.folder_type === 'client') return 'client';
  if (folder.folder_type?.includes('Form') || folder.folder_type?.includes('form')) return 'form';
  if (folder.folder_type?.includes('Financial') || 
      folder.folder_type?.includes('financial') || 
      folder.folder_type?.includes('Income') || 
      folder.folder_type?.includes('Expense')) return 'financial';
  return 'general';
};
