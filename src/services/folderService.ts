import { supabase } from '@/lib/supabase';
import { Document } from '@/components/DocumentList/types';
import { FolderStructure } from '@/types/folders';

/**
 * Creates a new folder in the database
 */
export const createFolder = async (
  folderName: string,
  parentFolderId: string | null,
  userId: string
): Promise<FolderStructure | null> => {
  try {
    const { data, error } = await supabase.from('documents').insert({
      title: folderName,
      is_folder: true,
      parent_folder_id: parentFolderId,
      user_id: userId,
      metadata: {},
      type: 'folder'
    }).select().single();

    if (error) {
      console.error('Error creating folder:', error);
      return null;
    }

    if (!data) return null;

    // Convert the database document to a FolderStructure
    return {
      id: data.id,
      title: data.title || '',
      name: data.title || '', // Add name for components that use it
      parent_folder_id: data.parent_folder_id,
      parentId: data.parent_folder_id, // Add parentId for components that use it
      created_at: data.created_at,
      updated_at: data.updated_at,
      is_folder: true,
      type: 'general', // Default type
      level: parentFolderId ? 1 : 0, // Default level
      children: [],
      isExpanded: false,
      metadata: data.metadata || {}
    };
  } catch (error) {
    console.error('Unexpected error creating folder:', error);
    return null;
  }
};

/**
 * Fetches a list of all folders for a user
 */
export const getFolders = async (userId: string): Promise<FolderStructure[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .eq('is_folder', true);

    if (error) {
      console.error('Error fetching folders:', error);
      return [];
    }

    // Convert documents to folder structures
    return data.map(doc => ({
      id: doc.id,
      title: doc.title || '',
      name: doc.title || '', // For components that use name
      parent_folder_id: doc.parent_folder_id,
      parentId: doc.parent_folder_id, // For components that use parentId
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      is_folder: true,
      type: doc.folder_type === 'client' ? 'client' : 
            doc.folder_type?.includes('Form') ? 'form' :
            doc.folder_type?.includes('Financial') ? 'financial' : 'general',
      level: 0, // Will be calculated properly
      children: [],
      isExpanded: false,
      metadata: doc.metadata || {}
    }));
  } catch (error) {
    console.error('Unexpected error fetching folders:', error);
    return [];
  }
};

/**
 * Updates a folder's metadata
 */
export const updateFolderMetadata = async (
  folderId: string,
  metadata: any
): Promise<FolderStructure | null> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .update({ metadata: metadata })
      .eq('id', folderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating folder metadata:', error);
      return null;
    }

    if (!data) return null;

    // Convert the database document to a FolderStructure
    return {
      id: data.id,
      title: data.title || '',
      name: data.title || '', // Add name for components that use it
      parent_folder_id: data.parent_folder_id,
      parentId: data.parent_folder_id, // Add parentId for components that use it
      created_at: data.created_at,
      updated_at: data.updated_at,
      is_folder: true,
      type: data.folder_type === 'client' ? 'client' : 
            data.folder_type?.includes('Form') ? 'form' :
            data.folder_type?.includes('Financial') ? 'financial' : 'general',
      level: 0, // Will be calculated properly
      children: [],
      isExpanded: false,
      metadata: data.metadata || {}
    };
  } catch (error) {
    console.error('Unexpected error updating folder metadata:', error);
    return null;
  }
};

/**
 * Deletes a folder from the database
 */
export const deleteFolder = async (folderId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', folderId);

    if (error) {
      console.error('Error deleting folder:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting folder:', error);
    return false;
  }
};

/**
 * Renames a folder in the database
 */
export const renameFolder = async (folderId: string, newName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('documents')
      .update({ title: newName })
      .eq('id', folderId);

    if (error) {
      console.error('Error renaming folder:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error renaming folder:', error);
    return false;
  }
};

/**
 * Moves a folder to a different parent folder
 */
export const moveFolder = async (folderId: string, newParentFolderId: string | null): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('documents')
      .update({ parent_folder_id: newParentFolderId })
      .eq('id', folderId);

    if (error) {
      console.error('Error moving folder:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error moving folder:', error);
    return false;
  }
};

/**
 * Fetches a folder by its ID
 */
export const getFolderById = async (folderId: string): Promise<FolderStructure | null> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', folderId)
      .single();

    if (error) {
      console.error('Error fetching folder:', error);
      return null;
    }

    if (!data) return null;

    // Convert the database document to a FolderStructure
    return {
      id: data.id,
      title: data.title || '',
      name: data.title || '', // Add name for components that use it
      parent_folder_id: data.parent_folder_id,
      parentId: data.parent_folder_id, // Add parentId for components that use it
      created_at: data.created_at,
      updated_at: data.updated_at,
      is_folder: true,
      type: data.folder_type === 'client' ? 'client' : 
            data.folder_type?.includes('Form') ? 'form' :
            data.folder_type?.includes('Financial') ? 'financial' : 'general',
      level: 0, // Will be calculated properly
      children: [],
      isExpanded: false,
      metadata: data.metadata || {}
    };
  } catch (error) {
    console.error('Unexpected error fetching folder:', error);
    return null;
  }
};

/**
 * Builds a hierarchical folder structure from a flat list
 */
export const buildFolderHierarchy = (folders: FolderStructure[]): FolderStructure[] => {
  // Create a map for quick lookup
  const folderMap: Record<string, FolderStructure> = {};
  
  // First, add all folders to the map
  folders.forEach(folder => {
    folderMap[folder.id] = { ...folder, children: [] };
  });
  
  // Root folders will be collected here
  const rootFolders: FolderStructure[] = [];
  
  // Organize into hierarchy
  Object.values(folderMap).forEach(folder => {
    const parentId = folder.parentId || folder.parent_folder_id;
    
    if (parentId && folderMap[parentId]) {
      // This folder has a parent, add it to parent's children
      if (!folderMap[parentId].children) {
        folderMap[parentId].children = [];
      }
      folderMap[parentId].children!.push(folder);
      
      // Calculate level based on parent's level
      folder.level = (folderMap[parentId].level || 0) + 1;
    } else {
      // This is a root folder
      folder.level = 0;
      rootFolders.push(folder);
    }
  });
  
  return rootFolders;
};

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
